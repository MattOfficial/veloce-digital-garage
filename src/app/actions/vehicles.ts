"use server";

import { isFuelType } from "@/types/database";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "./badges";

export async function addVehicle(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to add a vehicle." };
    }

    const make = formData.get("make")?.toString();
    const model = formData.get("model")?.toString();
    const yearStr = formData.get("year")?.toString();
    const odometerStr = formData.get("baseline_odometer")?.toString();
    const image_url = formData.get("image_url")?.toString() || null;
    const vehicle_type = formData.get("vehicle_type")?.toString() || 'car';
    const powertrain = formData.get("powertrain")?.toString() || 'ice';
    const batteryCapacityStr = formData.get("battery_capacity_kwh")?.toString();

    // Only stored when it means something and the owner actually chose it: a
    // wrong fuel on a vehicle is worse than no fuel, and null reads as "not yet
    // answered" everywhere downstream.
    const fuelTypeValue = formData.get("fuel_type")?.toString() ?? "";
    const fuel_type =
        powertrain !== 'ev' && isFuelType(fuelTypeValue) ? fuelTypeValue : null;

    if (!make || !model || !yearStr || !odometerStr) {
        return { error: "Please fill out all required fields." };
    }

    const year = parseInt(yearStr, 10);
    const baseline_odometer = parseFloat(odometerStr);
    const battery_capacity_kwh = batteryCapacityStr ? parseFloat(batteryCapacityStr) : null;

    if (isNaN(year) || isNaN(baseline_odometer)) {
        return { error: "Year and Odometer must be valid numbers." };
    }

    const { data, error } = await supabase
        .from("vehicles")
        .insert({
            user_id: user.id,
            make,
            model,
            year,
            baseline_odometer,
            current_odometer: baseline_odometer,
            image_url,
            vehicle_type,
            powertrain,
            fuel_type,
            battery_capacity_kwh
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding vehicle:", error);
        return { error: error.message };
    }

    const newBadges = await evaluateBadges(user.id);

    return { success: true, vehicle: data, newBadges };
}

export async function deleteVehicle(vehicleId: string) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to delete a vehicle." };
    }

    const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicleId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting vehicle:", error);
        return { error: error.message };
    }

    return { success: true };
}

export async function updateVehicle(id: string, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to update a vehicle." };
    }

    const updates: Record<string, string | number | null | object> = {};

    const stringFields = ["make", "model", "image_url", "vin", "license_plate", "color", "nickname", "engine_type", "transmission", "notes", "vehicle_type", "powertrain"];
    stringFields.forEach((field) => {
        if (formData.has(field)) {
            updates[field] = formData.get(field)?.toString() || null;
        }
    });

    // Validated rather than passed through, and cleared outright when the
    // vehicle becomes electric — a stale "diesel" on a converted row would
    // otherwise keep showing up on reports and garage pills.
    if (formData.has("fuel_type") || formData.has("powertrain")) {
        const submitted = formData.get("fuel_type")?.toString() ?? "";
        const powertrain = updates.powertrain;
        updates.fuel_type =
            powertrain !== "ev" && isFuelType(submitted) ? submitted : null;
    }

    if (formData.has("year")) {
        const yearStr = formData.get("year")?.toString();
        if (yearStr) {
            const year = parseInt(yearStr, 10);
            if (!isNaN(year)) updates.year = year;
        }
    }

    if (formData.has("baseline_odometer")) {
        const odoStr = formData.get("baseline_odometer")?.toString();
        if (odoStr) {
            const odo = parseFloat(odoStr);
            if (!isNaN(odo)) updates.baseline_odometer = odo;
        }
    }

    if (formData.has("current_odometer")) {
        const odoStr = formData.get("current_odometer")?.toString();
        if (odoStr) {
            const odo = parseFloat(odoStr);
            if (!isNaN(odo)) updates.current_odometer = odo;
        }
    }

    // EV attributes. usable_battery_kwh is the denominator for Wh/km and
    // baseline_range_km is the denominator for state of health, so both need to
    // be clearable rather than merely settable.
    const numericFields = [
        "battery_capacity_kwh",
        "usable_battery_kwh",
        "rated_range_km",
        "baseline_range_km",
        "battery_warranty_years",
        "battery_warranty_km",
    ];

    for (const field of numericFields) {
        if (!formData.has(field)) continue;

        const rawValue = formData.get(field)?.toString();
        if (rawValue) {
            const parsed = parseFloat(rawValue);
            if (!isNaN(parsed)) updates[field] = parsed;
        } else {
            updates[field] = null;
        }
    }

    if (formData.has("custom_fields")) {
        try {
            const customFieldsStr = formData.get("custom_fields")?.toString();
            if (customFieldsStr) {
                updates.custom_fields = JSON.parse(customFieldsStr);
            } else {
                updates.custom_fields = {};
            }
        } catch (e) {
            console.error("Failed to parse custom_fields JSON", e);
            return { error: "Invalid format for custom specifications." };
        }
    }

    if (formData.has("tyre_info")) {
        try {
            const tyreInfoStr = formData.get("tyre_info")?.toString();
            if (tyreInfoStr) {
                updates.tyre_info = JSON.parse(tyreInfoStr);
            } else {
                updates.tyre_info = null;
            }
        } catch (e) {
            console.error("Failed to parse tyre_info JSON", e);
            return { error: "Invalid format for tire information." };
        }
    }

    // Ensure we actually have data to update
    if (Object.keys(updates).length === 0) {
        return { error: "No fields provided to update." };
    }

    const { data, error } = await supabase
        .from("vehicles")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating vehicle:", error);
        return { error: error.message };
    }

    revalidatePath(`/dashboard/vehicles/${id}`);
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard/insights");

    return { success: true, vehicle: data };
}
