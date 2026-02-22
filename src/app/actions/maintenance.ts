"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitMaintenanceLog(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to log maintenance." };
    }

    const vehicle_id = formData.get("vehicle_id")?.toString();
    const date = formData.get("date")?.toString();
    const service_type = formData.get("service_type")?.toString();
    const costStr = formData.get("cost")?.toString();
    const notes = formData.get("notes")?.toString();

    if (!vehicle_id || !date || !service_type || !costStr) {
        return { error: "Missing required fields." };
    }

    const cost = parseFloat(costStr);
    if (isNaN(cost) || cost < 0) {
        return { error: "Cost must be a valid positive number." };
    }

    // Insert into Supabase
    const { error: insertError } = await supabase
        .from("maintenance_logs")
        .insert({
            vehicle_id,
            user_id: user.id,
            date,
            service_type,
            cost,
            notes: notes || null,
        });

    if (insertError) {
        console.error("Error inserting maintenance log:", insertError);
        return { error: insertError.message };
    }

    // Revalidate paths that might show this data
    revalidatePath("/maintenance");
    revalidatePath(`/vehicles/${vehicle_id}`);

    return { success: true };
}
