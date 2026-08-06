"use server";

import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import type {
    ChargeSource,
    FuelLog,
    FuelLogEnergyType,
    FuelLogFillType,
} from "@/types/database";
import { deriveEnergyFromSocDelta } from "@/utils/ev-energy-analytics";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "./badges";
import { syncVehicleCurrentOdometer } from "./_vehicle-sync";

type FuelLogMutationPayload = {
    vehicle_id: string;
    date: string;
    odometer: number;
    fuel_volume: number | null;
    total_cost: number;
    energy_type: FuelLogEnergyType;
    /** ICE only. Charge rows carry null: "full charge" is not a meaningful concept. */
    fill_type: FuelLogFillType | null;
    estimated_range: number | null;
    charge_source: ChargeSource | null;
    start_soc: number | null;
    end_soc: number | null;
    charger_network: string | null;
    location: string | null;
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

function normalizeChargeSource(value: FormDataEntryValue | null): ChargeSource {
    if (value === "home" || value === "ac_public" || value === "dc_fast") {
        return value;
    }

    return "other";
}

function parseOptionalText(value: FormDataEntryValue | null): string | null {
    return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function isValidSoc(value: number | null): boolean {
    return value == null || (value >= 0 && value <= 100);
}

function parseFuelLogPayload(formData: FormData): FuelLogMutationPayload | null {
    const vehicle_id = formData.get("vehicle_id");
    const date = formData.get("date");
    const odometer = parseNumericField(formData.get("odometer"));
    const fuel_volume = parseNumericField(formData.get("fuel_volume"));
    const total_cost = parseNumericField(formData.get("total_cost"));
    const estimated_range = parseNumericField(formData.get("estimated_range"));
    const energy_type = normalizeEnergyType(formData.get("energy_type"));
    const isCharge = energy_type === "charge";

    const start_soc = isCharge ? parseNumericField(formData.get("start_soc")) : null;
    const end_soc = isCharge ? parseNumericField(formData.get("end_soc")) : null;

    if (
        typeof vehicle_id !== "string" ||
        typeof date !== "string" ||
        total_cost == null ||
        odometer == null ||
        odometer <= 0 ||
        total_cost < 0
    ) {
        return null;
    }

    // A charge session may report only the SoC it added; kWh is derived from that
    // later, once the vehicle's usable pack size is known.
    if (fuel_volume != null && fuel_volume <= 0) {
        return null;
    }

    if (!isCharge && fuel_volume == null) {
        return null;
    }

    if (!isValidSoc(start_soc) || !isValidSoc(end_soc)) {
        return null;
    }

    return {
        vehicle_id,
        date,
        odometer,
        fuel_volume,
        total_cost,
        energy_type,
        fill_type: isCharge ? null : normalizeFillType(formData.get("fill_type")),
        estimated_range,
        charge_source: isCharge ? normalizeChargeSource(formData.get("charge_source")) : null,
        start_soc,
        end_soc,
        charger_network: isCharge ? parseOptionalText(formData.get("charger_network")) : null,
        location: isCharge ? parseOptionalText(formData.get("location")) : null,
    };
}

/**
 * Charge rows never carry a volume of null into the database: either the session
 * reported kWh or we reconstruct it from the SoC delta and the pack size.
 */
function resolveChargeVolume(
    payload: FuelLogMutationPayload,
    usableBatteryKwh: number | null,
): number | null {
    if (payload.fuel_volume != null) {
        return payload.fuel_volume;
    }

    return deriveEnergyFromSocDelta(payload.start_soc, payload.end_soc, usableBatteryKwh);
}

async function deriveCalculatedEfficiency(
    supabase: Awaited<ReturnType<typeof createClient>>,
    vehicleId: string,
    baselineOdometer: number,
    candidateLog: FuelLog,
): Promise<number | null> {
    // The full-tank method applies to liquid fuel only. EV efficiency comes from
    // SoC snapshots instead — see docs/ev-redesign.md.
    if (candidateLog.energy_type === "charge" || candidateLog.fill_type !== "full") {
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
        .select("id, baseline_odometer, usable_battery_kwh")
        .eq("id", payload.vehicle_id)
        .eq("user_id", user.id)
        .single();

    if (vehicleError || !vehicle) {
        return { success: false, error: "Vehicle not found or access denied." };
    }

    const fuel_volume = resolveChargeVolume(payload, vehicle.usable_battery_kwh);
    if (fuel_volume == null) {
        return {
            success: false,
            error: "Enter the energy delivered, or a start and end state of charge with the battery size set on the vehicle.",
        };
    }

    const candidateLog: FuelLog = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        calculated_efficiency: null,
        is_estimated: false,
        ...payload,
        fuel_volume,
    };

    const calculated_efficiency = await deriveCalculatedEfficiency(
        supabase,
        payload.vehicle_id,
        Number(vehicle.baseline_odometer),
        candidateLog,
    );

    const { error } = await supabase.from("fuel_logs").insert({
        ...payload,
        fuel_volume,
        calculated_efficiency,
    });

    if (error) {
        console.error("Error inserting fuel log:", error);
        return { success: false, error: "Failed to save fuel log" };
    }

    await syncVehicleCurrentOdometer(supabase, payload.vehicle_id);
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
        .select("id, user_id, baseline_odometer, usable_battery_kwh")
        .eq("id", payload.vehicle_id)
        .eq("user_id", user.id)
        .single();

    if (!vehicle) return { success: false, error: "Vehicle not found or access denied." };

    const fuel_volume = resolveChargeVolume(payload, vehicle.usable_battery_kwh);
    if (fuel_volume == null) {
        return {
            success: false,
            error: "Enter the energy delivered, or a start and end state of charge with the battery size set on the vehicle.",
        };
    }

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
        fuel_volume,
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
        .update({ ...payload, fuel_volume, calculated_efficiency })
        .eq("id", logId);

    if (error) {
        console.error("Error updating fuel log:", error);
        return { success: false, error: error.message };
    }

    await syncVehicleCurrentOdometer(supabase, payload.vehicle_id, {
        discardCurrentAtOrBelow: existingLog.odometer,
    });
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

    const { data: existingLog, error: existingLogError } = await supabase
        .from("fuel_logs")
        .select("id, odometer, vehicle_id")
        .eq("id", logId)
        .eq("vehicle_id", vehicleId)
        .single();

    if (existingLogError || !existingLog) {
        return { success: false, error: "Fuel log not found." };
    }

    const { error } = await supabase
        .from("fuel_logs")
        .delete()
        .eq("id", logId)
        .eq("vehicle_id", vehicleId);

    if (error) {
        console.error("Error deleting fuel log:", error);
        return { success: false, error: error.message };
    }

    await syncVehicleCurrentOdometer(supabase, vehicleId, {
        discardCurrentAtOrBelow: existingLog.odometer,
    });
    revalidateFuelRelatedPaths(vehicleId);
    return { success: true };
}
