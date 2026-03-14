"use server";

import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import type { FuelLog, FuelLogEnergyType, FuelLogFillType } from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "./badges";

type FuelLogMutationPayload = {
    vehicle_id: string;
    date: string;
    odometer: number;
    fuel_volume: number;
    total_cost: number;
    energy_type: FuelLogEnergyType;
    fill_type: FuelLogFillType;
    estimated_range: number | null;
};

type FuelLogMutationResult = {
    success: boolean;
    error?: string;
    newBadges?: Awaited<ReturnType<typeof evaluateBadges>>;
};

function parseNumericField(value: FormDataEntryValue | null): number | null {
    if (typeof value !== "string" || value.trim() === "") {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function normalizeEnergyType(value: FormDataEntryValue | null): FuelLogEnergyType {
    return value === "charge" ? "charge" : "fuel";
}

function normalizeFillType(value: FormDataEntryValue | null): FuelLogFillType {
    return value === "partial" ? "partial" : "full";
}

function parseFuelLogPayload(formData: FormData): FuelLogMutationPayload | null {
    const vehicle_id = formData.get("vehicle_id");
    const date = formData.get("date");
    const odometer = parseNumericField(formData.get("odometer"));
    const fuel_volume = parseNumericField(formData.get("fuel_volume"));
    const total_cost = parseNumericField(formData.get("total_cost"));
    const estimated_range = parseNumericField(formData.get("estimated_range"));

    if (
        typeof vehicle_id !== "string" ||
        typeof date !== "string" ||
        odometer == null ||
        fuel_volume == null ||
        total_cost == null ||
        odometer <= 0 ||
        fuel_volume <= 0 ||
        total_cost < 0
    ) {
        return null;
    }

    return {
        vehicle_id,
        date,
        odometer,
        fuel_volume,
        total_cost,
        energy_type: normalizeEnergyType(formData.get("energy_type")),
        fill_type: normalizeFillType(formData.get("fill_type")),
        estimated_range,
    };
}

async function deriveCalculatedEfficiency(
    supabase: Awaited<ReturnType<typeof createClient>>,
    vehicleId: string,
    baselineOdometer: number,
    candidateLog: FuelLog,
): Promise<number | null> {
    if (candidateLog.fill_type !== "full") {
        return null;
    }

    const { data, error } = await supabase
        .from("fuel_logs")
        .select("*")
        .eq("vehicle_id", vehicleId);

    if (error) {
        console.error("Error fetching fuel logs for efficiency derivation:", error);
        return null;
    }

    const existingLogs = ((data as unknown as FuelLog[]) ?? []).filter((log) => log.id !== candidateLog.id);
    const analytics = buildFuelAnalytics([...existingLogs, candidateLog], baselineOdometer);
    const stream = analytics[candidateLog.energy_type];
    const derivedLog = stream.logs.find((log) => log.id === candidateLog.id);

    return derivedLog?.derived_efficiency != null
        ? Number(derivedLog.derived_efficiency.toFixed(2))
        : null;
}

function revalidateFuelRelatedPaths(vehicleId: string) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/fuel");
    revalidatePath("/dashboard/insights");
    revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function submitFuelLog(formData: FormData): Promise<FuelLogMutationResult> {
    const supabase = await createClient();
    const payload = parseFuelLogPayload(formData);

    if (!payload) {
        return { success: false, error: "All required fields must be valid." };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: "Authentication required." };
    }

    const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select("id, baseline_odometer")
        .eq("id", payload.vehicle_id)
        .eq("user_id", user.id)
        .single();

    if (vehicleError || !vehicle) {
        return { success: false, error: "Vehicle not found or access denied." };
    }

    const candidateLog: FuelLog = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        calculated_efficiency: null,
        ...payload,
    };

    const calculated_efficiency = await deriveCalculatedEfficiency(
        supabase,
        payload.vehicle_id,
        Number(vehicle.baseline_odometer),
        candidateLog,
    );

    const { error } = await supabase.from("fuel_logs").insert({
        ...payload,
        calculated_efficiency,
    });

    if (error) {
        console.error("Error inserting fuel log:", error);
        return { success: false, error: "Failed to save fuel log" };
    }

    revalidateFuelRelatedPaths(payload.vehicle_id);

    const newBadges = user ? await evaluateBadges(user.id) : [];

    return { success: true, newBadges };
}

export async function editFuelLog(logId: string, formData: FormData): Promise<FuelLogMutationResult> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Authentication required." };

    const payload = parseFuelLogPayload(formData);
    if (!payload) {
        return { success: false, error: "All required fields must be valid." };
    }

    // Verify the user owns this log via the vehicle
    const { data: vehicle } = await supabase
        .from("vehicles")
        .select("id, user_id, baseline_odometer")
        .eq("id", payload.vehicle_id)
        .eq("user_id", user.id)
        .single();

    if (!vehicle) return { success: false, error: "Vehicle not found or access denied." };

    const { data: existingLog, error: existingLogError } = await supabase
        .from("fuel_logs")
        .select("*")
        .eq("id", logId)
        .single();

    if (existingLogError || !existingLog) {
        return { success: false, error: "Fuel log not found." };
    }

    const candidateLog: FuelLog = {
        ...(existingLog as unknown as FuelLog),
        ...payload,
        id: logId,
        created_at: existingLog.created_at ?? new Date().toISOString(),
        calculated_efficiency: null,
    };

    const calculated_efficiency = await deriveCalculatedEfficiency(
        supabase,
        payload.vehicle_id,
        Number(vehicle.baseline_odometer),
        candidateLog,
    );

    const { error } = await supabase
        .from("fuel_logs")
        .update({ ...payload, calculated_efficiency })
        .eq("id", logId);

    if (error) {
        console.error("Error updating fuel log:", error);
        return { success: false, error: error.message };
    }

    revalidateFuelRelatedPaths(payload.vehicle_id);
    return { success: true };
}

export async function deleteFuelLog(logId: string, vehicleId: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Authentication required." };

    // Verify ownership via vehicle before deleting
    const { data: vehicle } = await supabase
        .from("vehicles")
        .select("id")
        .eq("id", vehicleId)
        .eq("user_id", user.id)
        .single();

    if (!vehicle) return { success: false, error: "Vehicle not found or access denied." };

    const { error } = await supabase.from("fuel_logs").delete().eq("id", logId);

    if (error) {
        console.error("Error deleting fuel log:", error);
        return { success: false, error: error.message };
    }

    revalidateFuelRelatedPaths(vehicleId);
    return { success: true };
}
