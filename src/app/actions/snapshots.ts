"use server";

import type { VehicleSnapshotSource } from "@/types/database";
import type { createClient } from "@/utils/supabase/server";
import { parseNumericField } from "@/utils/form-values";
import { revalidateVehiclePaths, syncVehicleCurrentOdometer } from "./_vehicle-sync";
import { getAuthenticatedUser } from "./_auth";

/**
 * Vehicle state check-ins. For an EV this is the primary logging action: odometer
 * plus state of charge, from which km per %SoC, usable range and Wh/km all follow
 * without the owner ever knowing a kWh figure. For an ICE vehicle it is simply an
 * odometer update, so `soc_percent` is optional.
 */

type SnapshotMutationPayload = {
    vehicle_id: string;
    date: string;
    odometer: number;
    soc_percent: number | null;
    displayed_range: number | null;
    source: VehicleSnapshotSource;
    notes: string | null;
};

type SnapshotMutationResult = {
    success: boolean;
    error?: string;
};

function normalizeSource(value: FormDataEntryValue | null): VehicleSnapshotSource {
    if (value === "ocr" || value === "api") {
        return value;
    }

    return "manual";
}

function parseSnapshotPayload(formData: FormData): SnapshotMutationPayload | null {
    const vehicle_id = formData.get("vehicle_id");
    const date = formData.get("date");
    const odometer = parseNumericField(formData.get("odometer"));
    const soc_percent = parseNumericField(formData.get("soc_percent"));
    const displayed_range = parseNumericField(formData.get("displayed_range"));
    const notes = formData.get("notes");

    if (
        typeof vehicle_id !== "string" ||
        typeof date !== "string" ||
        odometer == null ||
        odometer < 0
    ) {
        return null;
    }

    if (soc_percent != null && (soc_percent < 0 || soc_percent > 100)) {
        return null;
    }

    return {
        vehicle_id,
        date,
        odometer,
        soc_percent,
        displayed_range,
        source: normalizeSource(formData.get("source")),
        notes: typeof notes === "string" && notes.trim() !== "" ? notes.trim() : null,
    };
}

function revalidateSnapshotPaths(vehicleId: string) {
    revalidateVehiclePaths(vehicleId, { tab: "fuel" });
}

async function assertVehicleOwnership(
    supabase: Awaited<ReturnType<typeof createClient>>,
    vehicleId: string,
    userId: string,
) {
    const { data: vehicle } = await supabase
        .from("vehicles")
        .select("id")
        .eq("id", vehicleId)
        .eq("user_id", userId)
        .single();

    return vehicle != null;
}

export async function submitVehicleSnapshot(formData: FormData): Promise<SnapshotMutationResult> {
    const payload = parseSnapshotPayload(formData);

    if (!payload) {
        return { success: false, error: "Odometer is required and state of charge must be 0-100." };
    }

    const { user, error: authError, supabase } = await getAuthenticatedUser("Authentication required.");
    if (authError || !user) {
        return { success: false, error: authError ?? "Authentication required." };
    }

    if (!(await assertVehicleOwnership(supabase, payload.vehicle_id, user.id))) {
        return { success: false, error: "Vehicle not found or access denied." };
    }

    const { error } = await supabase.from("vehicle_snapshots").insert(payload);

    if (error) {
        console.error("Error inserting vehicle snapshot:", error);
        return { success: false, error: "Failed to save the check-in." };
    }

    await syncVehicleCurrentOdometer(supabase, payload.vehicle_id);
    revalidateSnapshotPaths(payload.vehicle_id);

    return { success: true };
}

export async function editVehicleSnapshot(
    snapshotId: string,
    formData: FormData,
): Promise<SnapshotMutationResult> {
    const payload = parseSnapshotPayload(formData);

    if (!payload) {
        return { success: false, error: "Odometer is required and state of charge must be 0-100." };
    }

    const { user, error: authError, supabase } = await getAuthenticatedUser("Authentication required.");
    if (authError || !user) {
        return { success: false, error: authError ?? "Authentication required." };
    }

    if (!(await assertVehicleOwnership(supabase, payload.vehicle_id, user.id))) {
        return { success: false, error: "Vehicle not found or access denied." };
    }

    const { data: existingSnapshot, error: existingError } = await supabase
        .from("vehicle_snapshots")
        .select("id, odometer")
        .eq("id", snapshotId)
        .eq("vehicle_id", payload.vehicle_id)
        .single();

    if (existingError || !existingSnapshot) {
        return { success: false, error: "Check-in not found." };
    }

    const { error } = await supabase
        .from("vehicle_snapshots")
        .update(payload)
        .eq("id", snapshotId);

    if (error) {
        console.error("Error updating vehicle snapshot:", error);
        return { success: false, error: error.message };
    }

    // Lowering a reading can invalidate the cached current odometer, so the sync
    // has to be told to discard it rather than keep the stale higher value.
    await syncVehicleCurrentOdometer(supabase, payload.vehicle_id, {
        discardCurrentAtOrBelow: existingSnapshot.odometer,
    });
    revalidateSnapshotPaths(payload.vehicle_id);

    return { success: true };
}

export async function deleteVehicleSnapshot(
    snapshotId: string,
    vehicleId: string,
): Promise<SnapshotMutationResult> {
    const { user, error: authError, supabase } = await getAuthenticatedUser("Authentication required.");
    if (authError || !user) {
        return { success: false, error: authError ?? "Authentication required." };
    }

    if (!(await assertVehicleOwnership(supabase, vehicleId, user.id))) {
        return { success: false, error: "Vehicle not found or access denied." };
    }

    const { data: existingSnapshot, error: existingError } = await supabase
        .from("vehicle_snapshots")
        .select("id, odometer")
        .eq("id", snapshotId)
        .eq("vehicle_id", vehicleId)
        .single();

    if (existingError || !existingSnapshot) {
        return { success: false, error: "Check-in not found." };
    }

    const { error } = await supabase
        .from("vehicle_snapshots")
        .delete()
        .eq("id", snapshotId)
        .eq("vehicle_id", vehicleId);

    if (error) {
        console.error("Error deleting vehicle snapshot:", error);
        return { success: false, error: error.message };
    }

    await syncVehicleCurrentOdometer(supabase, vehicleId, {
        discardCurrentAtOrBelow: existingSnapshot.odometer,
    });
    revalidateSnapshotPaths(vehicleId);

    return { success: true };
}
