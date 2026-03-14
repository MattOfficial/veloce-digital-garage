"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateBadges, awardAiMechanicBadge } from "./badges";
import type { BadgeDefinition } from "@/lib/badges";

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
    const receipt_url = formData.get("receipt_url")?.toString();

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
            receipt_url: receipt_url || null,
        });

    if (insertError) {
        console.error("Error inserting maintenance log:", insertError);
        return { error: insertError.message };
    }

    // Revalidate paths that might show this data
    revalidatePath("/dashboard/maintenance");
    revalidatePath(`/dashboard/vehicles/${vehicle_id}`);

    let newBadges: BadgeDefinition[] = [];
    if (user) {
        newBadges = await evaluateBadges(user.id);
        if (receipt_url) {
            const aiBadges = await awardAiMechanicBadge(user.id);
            newBadges = [...newBadges, ...aiBadges];
        }
    }

    return { success: true, newBadges };
}

export async function deleteMaintenanceLog(logId: string, vehicleId: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to delete a maintenance log." };
    }

    const { error } = await supabase
        .from("maintenance_logs")
        .delete()
        .eq("id", logId)
        .eq("user_id", user.id); // Security: only delete if the user owns it

    if (error) {
        console.error("Error deleting maintenance log:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/maintenance");
    revalidatePath(`/dashboard/vehicles/${vehicleId}`);

    return { success: true };
}

export async function editMaintenanceLog(logId: string, formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to edit a maintenance log." };
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

    const { error: updateError } = await supabase
        .from("maintenance_logs")
        .update({
            date,
            service_type,
            cost,
            notes: notes || null,
        })
        .eq("id", logId)
        .eq("user_id", user.id);

    if (updateError) {
        console.error("Error updating maintenance log:", updateError);
        return { error: updateError.message };
    }

    revalidatePath("/dashboard/maintenance");
    revalidatePath(`/dashboard/vehicles/${vehicle_id}`);

    return { success: true, newBadges: [] };
}
