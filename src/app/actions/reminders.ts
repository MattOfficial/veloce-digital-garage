"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createServiceReminder(formData: FormData) {
    const supabase = await createClient();
    const vehicleId = formData.get("vehicle_id") as string;

    if (!vehicleId) throw new Error("Vehicle ID is required");

    const recurringMonthsStr = formData.get("recurring_months") as string;
    const recurringDistanceStr = formData.get("recurring_distance") as string;

    const newReminder = {
        vehicle_id: vehicleId,
        service_type: formData.get("service_type") as string,
        recurring_months: recurringMonthsStr ? parseInt(recurringMonthsStr) : null,
        recurring_distance: recurringDistanceStr ? parseInt(recurringDistanceStr) : null,
        last_completed_date: formData.get("last_completed_date") as string || null,
        last_completed_odometer: formData.get("last_completed_odometer") ? parseInt(formData.get("last_completed_odometer") as string) : null,
    };

    const { error } = await supabase.from("service_reminders").insert(newReminder);
    if (error) {
        console.error("Error creating reminder:", error);
        throw new Error("Failed to create reminder");
    }

    revalidatePath("/dashboard/maintenance");
    return { success: true };
}

export async function deleteServiceReminder(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("service_reminders").delete().eq("id", id);
    if (error) {
        console.error("Error deleting reminder:", error);
        throw new Error("Failed to delete reminder");
    }

    revalidatePath("/dashboard/maintenance");
    return { success: true };
}
