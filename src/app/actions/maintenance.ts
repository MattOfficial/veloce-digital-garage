"use server";

import { evaluateBadges, awardAiMechanicBadge } from "./badges";
import type { BadgeDefinition } from "@/lib/badges";
import { parseNumericField } from "@/utils/form-values";
import { getAuthenticatedUser } from "./_auth";
import {
    syncVehicleServiceInterval,
    syncVehicleCurrentOdometer,
    revalidateVehiclePaths,
} from "./_vehicle-sync";

function revalidateMaintenanceRelatedPaths(vehicleId: string) {
    revalidateVehiclePaths(vehicleId, { tab: "maintenance" });
}

export async function submitMaintenanceLog(formData: FormData) {
    const { user, error: authError, supabase } = await getAuthenticatedUser(
        "You must be logged in to log maintenance.",
    );

    if (authError || !user) {
        return { error: authError ?? "You must be logged in to log maintenance." };
    }

    const vehicle_id = formData.get("vehicle_id")?.toString();
    const date = formData.get("date")?.toString();
    const service_type = formData.get("service_type")?.toString();
    const notes = formData.get("notes")?.toString();
    const receipt_url = formData.get("receipt_url")?.toString();

    const cost = parseNumericField(formData.get("cost"));
    if (cost == null || cost < 0) {
        return { error: "Cost must be a valid positive number." };
    }

    const odometerRaw = formData.get("odometer");
    const odometer = parseNumericField(odometerRaw);
    if (odometerRaw && (odometer == null || odometer < 0)) {
        return { error: "Odometer must be a valid positive number." };
    }

    if (!vehicle_id || !date || !service_type) {
        return { error: "Missing required fields." };
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
            odometer,
            notes: notes || null,
            receipt_url: receipt_url || null,
        });

    if (insertError) {
        console.error("Error inserting maintenance log:", insertError);
        return { error: insertError.message };
    }

    await syncVehicleServiceInterval(supabase, vehicle_id, service_type, date, odometer);
    await syncVehicleCurrentOdometer(supabase, vehicle_id);
    revalidateMaintenanceRelatedPaths(vehicle_id);

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
    const { user, error: authError, supabase } = await getAuthenticatedUser(
        "You must be logged in to delete a maintenance log.",
    );

    if (authError || !user) {
        return { error: authError ?? "You must be logged in to delete a maintenance log." };
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

    await syncVehicleCurrentOdometer(supabase, vehicleId);
    revalidateMaintenanceRelatedPaths(vehicleId);

    return { success: true };
}

export async function editMaintenanceLog(logId: string, formData: FormData) {
    const { user, error: authError, supabase } = await getAuthenticatedUser(
        "You must be logged in to edit a maintenance log.",
    );

    if (authError || !user) {
        return { error: authError ?? "You must be logged in to edit a maintenance log." };
    }

    const vehicle_id = formData.get("vehicle_id")?.toString();
    const date = formData.get("date")?.toString();
    const service_type = formData.get("service_type")?.toString();
    const notes = formData.get("notes")?.toString();

    const cost = parseNumericField(formData.get("cost"));
    if (cost == null || cost < 0) {
        return { error: "Cost must be a valid positive number." };
    }

    const odometerRaw = formData.get("odometer");
    const odometer = parseNumericField(odometerRaw);
    if (odometerRaw && (odometer == null || odometer < 0)) {
        return { error: "Odometer must be a valid positive number." };
    }

    if (!vehicle_id || !date || !service_type) {
        return { error: "Missing required fields." };
    }

    const { error: updateError } = await supabase
        .from("maintenance_logs")
        .update({
            date,
            service_type,
            cost,
            odometer,
            notes: notes || null,
        })
        .eq("id", logId)
        .eq("user_id", user.id);

    if (updateError) {
        console.error("Error updating maintenance log:", updateError);
        return { error: updateError.message };
    }

    await syncVehicleServiceInterval(supabase, vehicle_id, service_type, date, odometer);
    await syncVehicleCurrentOdometer(supabase, vehicle_id);
    revalidateMaintenanceRelatedPaths(vehicle_id);

    return { success: true, newBadges: [] };
}
