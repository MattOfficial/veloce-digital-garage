"use server";

import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import type {
    ChargeEnergyBasis,
    ChargePricingMode,
    ChargeSource,
    FuelLog,
    FuelLogEnergyType,
    FuelLogFillType,
} from "@/types/database";
import { calculateSessionCost, resolveSessionEnergy } from "@/utils/charge-session";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "./badges";
import { syncVehicleCurrentOdometer } from "./_vehicle-sync";

type FuelLogMutationPayload = {
    vehicle_id: string;
    date: string;
    odometer: number;
    fuel_volume: number | null;
    /**
     * Null means "work it out from the rate components". Once resolved it is
     * authoritative — see docs/ev-charging-redesign.md.
     */
    total_cost: number | null;
    energy_type: FuelLogEnergyType;
    /** ICE only. Charge rows carry null: "full charge" is not a meaningful concept. */
    fill_type: FuelLogFillType | null;
    estimated_range: number | null;
    charge_source: ChargeSource | null;
    start_soc: number | null;
    end_soc: number | null;
    charger_network: string | null;
    location: string | null;
    pricing_mode: ChargePricingMode | null;
    rate_per_unit: number | null;
    duration_minutes: number | null;
    session_fee: number | null;
    idle_minutes: number | null;
    idle_rate_per_minute: number | null;
    tax_percent: number | null;
    charged_to_full: boolean | null;
};

/** What actually reaches the table: energy, cost and basis all resolved. */
type FuelLogInsertRow = Omit<FuelLogMutationPayload, "total_cost"> & {
    fuel_volume: number;
    total_cost: number;
    energy_basis: ChargeEnergyBasis | null;
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

function normalizePricingMode(value: FormDataEntryValue | null): ChargePricingMode {
    if (value === "per_minute" || value === "flat" || value === "free") {
        return value;
    }

    return "per_kwh";
}

function parseOptionalText(value: FormDataEntryValue | null): string | null {
    return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parseBooleanField(value: FormDataEntryValue | null): boolean {
    return value === "true" || value === "on" || value === "1";
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
        odometer == null ||
        odometer <= 0
    ) {
        return null;
    }

    // A liquid fill always states its cost. A charge session may instead state
    // the tariff it was billed at, and let the server do the arithmetic.
    if (total_cost != null && total_cost < 0) {
        return null;
    }

    if (!isCharge && total_cost == null) {
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
        pricing_mode: isCharge ? normalizePricingMode(formData.get("pricing_mode")) : null,
        rate_per_unit: isCharge ? parseNumericField(formData.get("rate_per_unit")) : null,
        duration_minutes: isCharge ? parseNumericField(formData.get("duration_minutes")) : null,
        session_fee: isCharge ? parseNumericField(formData.get("session_fee")) : null,
        idle_minutes: isCharge ? parseNumericField(formData.get("idle_minutes")) : null,
        idle_rate_per_minute: isCharge
            ? parseNumericField(formData.get("idle_rate_per_minute"))
            : null,
        tax_percent: isCharge ? parseNumericField(formData.get("tax_percent")) : null,
        charged_to_full: isCharge ? parseBooleanField(formData.get("charged_to_full")) : null,
    };
}

/**
 * Resolves a payload into a row: energy from the meter or the SoC delta, and
 * cost from what the user typed or, failing that, from the tariff components.
 * Returns null when a charge session has no route to a kWh figure at all.
 */
function resolveChargeRow(
    payload: FuelLogMutationPayload,
    usableBatteryKwh: number | null,
): FuelLogInsertRow | null {
    const isCharge = payload.energy_type === "charge";

    if (!isCharge) {
        return payload.fuel_volume != null && payload.total_cost != null
            ? {
                  ...payload,
                  fuel_volume: payload.fuel_volume,
                  total_cost: payload.total_cost,
                  energy_basis: null,
              }
            : null;
    }

    const pricingMode = payload.pricing_mode ?? "per_kwh";
    const { energyKwh, basis } = resolveSessionEnergy({
        pricingMode,
        energyKwh: payload.fuel_volume,
        startSoc: payload.start_soc,
        endSoc: payload.end_soc,
        usableBatteryKwh,
    });

    if (energyKwh == null) {
        return null;
    }

    // The user's own figure wins. The calculator only fills a gap, so a network
    // with a tariff we cannot model is still logged accurately.
    const total_cost =
        payload.total_cost ??
        calculateSessionCost({
            pricingMode,
            energyKwh,
            ratePerUnit: payload.rate_per_unit,
            durationMinutes: payload.duration_minutes,
            sessionFee: payload.session_fee,
            idleMinutes: payload.idle_minutes,
            idleRatePerMinute: payload.idle_rate_per_minute,
            taxPercent: payload.tax_percent,
        }).total;

    return {
        ...payload,
        fuel_volume: energyKwh,
        total_cost,
        energy_basis: basis,
    };
}

const MISSING_ENERGY_ERROR =
    "Enter the units consumed, or the start and end battery percentages with the battery size set on the vehicle.";

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

    const row = resolveChargeRow(payload, vehicle.usable_battery_kwh);
    if (row == null) {
        return { success: false, error: MISSING_ENERGY_ERROR };
    }

    const candidateLog: FuelLog = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        calculated_efficiency: null,
        is_estimated: false,
        ...row,
    };

    const calculated_efficiency = await deriveCalculatedEfficiency(
        supabase,
        payload.vehicle_id,
        Number(vehicle.baseline_odometer),
        candidateLog,
    );

    const { error } = await supabase.from("fuel_logs").insert({
        ...row,
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

    const row = resolveChargeRow(payload, vehicle.usable_battery_kwh);
    if (row == null) {
        return { success: false, error: MISSING_ENERGY_ERROR };
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
        ...row,
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
        .update({ ...row, calculated_efficiency })
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
