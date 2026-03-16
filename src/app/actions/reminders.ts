"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getVehicleServiceInterval, VEHICLE_SERVICE_INTERVAL_NAME } from "@/utils/vehicle-metrics";

export async function createServiceReminder(formData: FormData) {
    const supabase = await createClient();
    const vehicleId = formData.get("vehicle_id") as string;

    if (!vehicleId) throw new Error("Vehicle ID is required");

    const recurringMonthsStr = formData.get("recurring_months") as string;
    const recurringDistanceStr = formData.get("recurring_distance") as string;
    const recurringMonths = recurringMonthsStr ? parseInt(recurringMonthsStr, 10) : null;
    const recurringDistance = recurringDistanceStr ? parseInt(recurringDistanceStr, 10) : null;

    if (recurringMonths == null && recurringDistance == null) {
        throw new Error("Please add a time interval, a distance interval, or both.");
    }

    const newReminder = {
        vehicle_id: vehicleId,
        service_type: formData.get("service_type") as string,
        recurring_months: recurringMonths,
        recurring_distance: recurringDistance,
        last_completed_date: formData.get("last_completed_date") as string || null,
        last_completed_odometer: formData.get("last_completed_odometer") ? parseInt(formData.get("last_completed_odometer") as string, 10) : null,
    };

    const { error } = await supabase.from("service_reminders").insert(newReminder);
    if (error) {
        console.error("Error creating reminder:", error);
        throw new Error("Failed to create reminder");
    }

    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function upsertVehicleServiceInterval(formData: FormData) {
    const supabase = await createClient();
    const vehicleId = formData.get("vehicle_id") as string;

    if (!vehicleId) {
        throw new Error("Vehicle ID is required");
    }

    const recurringMonthsStr = formData.get("recurring_months") as string;
    const recurringDistanceStr = formData.get("recurring_distance") as string;
    const recurringMonths = recurringMonthsStr ? parseInt(recurringMonthsStr, 10) : null;
    const recurringDistance = recurringDistanceStr ? parseInt(recurringDistanceStr, 10) : null;

    if (recurringMonths == null && recurringDistance == null) {
        throw new Error("Please add a time interval, a distance interval, or both.");
    }

    const { data: reminders, error: fetchError } = await supabase
        .from("service_reminders")
        .select("*")
        .eq("vehicle_id", vehicleId);

    if (fetchError) {
        console.error("Error loading service interval:", fetchError);
        throw new Error("Failed to load service interval");
    }

    const existingInterval = getVehicleServiceInterval((reminders as any[]) || []);
    const payload = {
        vehicle_id: vehicleId,
        service_type: VEHICLE_SERVICE_INTERVAL_NAME,
        recurring_months: recurringMonths,
        recurring_distance: recurringDistance,
    };

    if (existingInterval) {
        const { data, error } = await supabase
            .from("service_reminders")
            .update({
                ...payload,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingInterval.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating service interval:", error);
            throw new Error("Failed to update service interval");
        }

        revalidatePath("/dashboard/maintenance");
        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/vehicles/${vehicleId}`);
        return { success: true, reminder: data };
    }

    const { data, error } = await supabase
        .from("service_reminders")
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error("Error creating service interval:", error);
        throw new Error("Failed to create service interval");
    }

    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/vehicles/${vehicleId}`);
    return { success: true, reminder: data };
}

export async function deleteServiceReminder(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("service_reminders").delete().eq("id", id);
    if (error) {
        console.error("Error deleting reminder:", error);
        throw new Error("Failed to delete reminder");
    }

    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard");
    return { success: true };
}
