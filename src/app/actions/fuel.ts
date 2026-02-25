"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitFuelLog(formData: FormData) {
    const supabase = await createClient();

    // Extract form data
    const vehicle_id = formData.get("vehicle_id") as string;
    const date = formData.get("date") as string;
    const odometer = parseFloat(formData.get("odometer") as string);
    const fuel_volume = parseFloat(formData.get("fuel_volume") as string);
    const total_cost = parseFloat(formData.get("total_cost") as string);
    const energy_type = (formData.get("energy_type") as string) || "fuel";
    const estimatedRangeStr = formData.get("estimated_range");
    const estimated_range = estimatedRangeStr ? parseFloat(estimatedRangeStr as string) : null;

    if (!vehicle_id || !date || !odometer || !fuel_volume || !total_cost) {
        return { success: false, error: "All fields are required" };
    }

    // Calculate efficiency.
    // We need the previous odometer reading for this vehicle to calculate the distance.
    const { data: previousLog } = await supabase
        .from("fuel_logs")
        .select("odometer")
        .eq("vehicle_id", vehicle_id)
        .order("odometer", { ascending: false })
        .limit(1)
        .single();

    let calculated_efficiency = null;

    if (previousLog) {
        const distanceDriven = odometer - Number(previousLog.odometer);
        if (distanceDriven > 0 && fuel_volume > 0) {
            // km per liter
            calculated_efficiency = parseFloat((distanceDriven / fuel_volume).toFixed(2));
        }
    } else {
        // If no previous log, try to use the baseline odometer from the vehicle
        const { data: vehicle } = await supabase
            .from("vehicles")
            .select("baseline_odometer")
            .eq("id", vehicle_id)
            .single();

        if (vehicle) {
            const distanceDriven = odometer - Number(vehicle.baseline_odometer);
            if (distanceDriven > 0 && fuel_volume > 0) {
                calculated_efficiency = parseFloat((distanceDriven / fuel_volume).toFixed(2));
            }
        }
    }

    // Insert the new log
    const { error } = await supabase.from("fuel_logs").insert({
        vehicle_id,
        date,
        odometer,
        fuel_volume,
        total_cost,
        calculated_efficiency,
        energy_type,
        estimated_range,
    });

    if (error) {
        console.error("Error inserting fuel log:", error);
        return { success: false, error: "Failed to save fuel log" };
    }

    // Revalidate the dashboard and fuel pages so new data is shown
    revalidatePath("/");
    revalidatePath("/fuel");

    return { success: true };
}
