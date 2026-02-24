"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
            image_url,
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

export async function updateVehicle(id: string, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to update a vehicle." };
    }

    const updates: Record<string, any> = {};

    const stringFields = ["make", "model", "image_url", "vin", "license_plate", "color", "engine_type", "transmission", "notes"];
    stringFields.forEach((field) => {
        if (formData.has(field)) {
            updates[field] = formData.get(field)?.toString() || null;
        }
    });

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

    revalidatePath(`/(dashboard)/vehicles/${id}`, "page");
    revalidatePath("/(dashboard)/vehicles", "layout");

    return { success: true, vehicle: data };
}
