"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges } from "./badges";

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
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/fuel");

    const { data: { user } } = await supabase.auth.getUser();
    const newBadges = user ? await evaluateBadges(user.id) : [];

    return { success: true, newBadges };
}

export async function editFuelLog(logId: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Authentication required." };

    const vehicle_id = formData.get("vehicle_id") as string;
    const date = formData.get("date") as string;
    const odometer = parseFloat(formData.get("odometer") as string);
    const fuel_volume = parseFloat(formData.get("fuel_volume") as string);
    const total_cost = parseFloat(formData.get("total_cost") as string);
    const estimatedRangeStr = formData.get("estimated_range");
    const estimated_range = estimatedRangeStr ? parseFloat(estimatedRangeStr as string) : null;

    if (!vehicle_id || !date || !odometer || !fuel_volume || total_cost == null) {
        return { success: false, error: "All fields are required." };
    }

    // Verify the user owns this log via the vehicle
    const { data: vehicle } = await supabase
        .from("vehicles")
        .select("id, user_id, baseline_odometer")
        .eq("id", vehicle_id)
        .eq("user_id", user.id)
        .single();

    if (!vehicle) return { success: false, error: "Vehicle not found or access denied." };

    // Recalculate efficiency: find the log immediately before this one by odometer
    const { data: prevLog } = await supabase
        .from("fuel_logs")
        .select("odometer")
        .eq("vehicle_id", vehicle_id)
        .lt("odometer", odometer)
        .neq("id", logId)
        .order("odometer", { ascending: false })
        .limit(1)
        .single();

    let calculated_efficiency = null;
    const prevOdometer = prevLog ? Number(prevLog.odometer) : Number(vehicle.baseline_odometer);
    const distanceDriven = odometer - prevOdometer;
    if (distanceDriven > 0 && fuel_volume > 0) {
        calculated_efficiency = parseFloat((distanceDriven / fuel_volume).toFixed(2));
    }

    const { error } = await supabase
        .from("fuel_logs")
        .update({ date, odometer, fuel_volume, total_cost, calculated_efficiency, estimated_range })
        .eq("id", logId);

    if (error) {
        console.error("Error updating fuel log:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/fuel");
    revalidatePath("/dashboard");
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

    revalidatePath("/dashboard/fuel");
    revalidatePath("/dashboard");
    return { success: true };
}
