"use server";

import { createClient } from "@/utils/supabase/server";

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

    if (!make || !model || !yearStr || !odometerStr) {
        return { error: "Please fill out all required fields." };
    }

    const year = parseInt(yearStr, 10);
    const baseline_odometer = parseFloat(odometerStr);

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
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding vehicle:", error);
        return { error: error.message };
    }

    return { success: true, vehicle: data };
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
