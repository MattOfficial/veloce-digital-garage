"use server";

import { createClient } from "@/utils/supabase/server";

export async function createTrackerCategory(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to create a tracker." };
    }

    const name = formData.get("name")?.toString();
    const icon = formData.get("icon")?.toString();
    const color_theme = formData.get("color_theme")?.toString();
    const track_cost = formData.get("track_cost") === "true";
    const vehicle_id = formData.get("vehicle_id")?.toString();

    if (!name || !icon || !color_theme || !vehicle_id) {
        return { error: "Please fill out all required fields." };
    }

    // Verify ownership of the vehicle
    const { data: vehicle } = await supabase.from("vehicles").select("user_id").eq("id", vehicle_id).single();
    if (!vehicle || vehicle.user_id !== user.id) {
        return { error: "You don't have permission to add trackers to this vehicle." };
    }

    const { data, error } = await supabase
        .from("custom_log_categories")
        .insert({
            vehicle_id,
            name,
            icon,
            color_theme,
            track_cost,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating tracker category:", error);
        return { error: error.message };
    }

    return { success: true, category: data };
}

export async function addCustomLog(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to add a log." };
    }

    const vehicle_id = formData.get("vehicle_id")?.toString();
    const category_id = formData.get("category_id")?.toString();
    const date = formData.get("date")?.toString();
    const costStr = formData.get("cost")?.toString();
    const notes = formData.get("notes")?.toString();

    if (!vehicle_id || !category_id || !date) {
        return { error: "Vehicle, Tracker Category, and Date are required." };
    }

    let cost: number | null = null;
    if (costStr) {
        cost = parseFloat(costStr);
        if (isNaN(cost)) {
            return { error: "Cost must be a valid number." };
        }
    }

    const { data, error } = await supabase
        .from("custom_logs")
        .insert({
            vehicle_id,
            category_id,
            date,
            cost,
            notes: notes || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding custom log:", error);
        return { error: error.message };
    }

    return { success: true, log: data };
}

export async function getCustomCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
        .from("custom_log_categories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching categories:", error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function getCustomLogsByVehicle(vehicleId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("custom_logs")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching custom logs:", error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function deleteTrackerCategory(categoryId: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "You must be logged in to delete a tracker." };
    }

    // Check ownership by tracing from category -> vehicle
    const { data: category } = await supabase.from("custom_log_categories").select("vehicle_id").eq("id", categoryId).single();
    if (!category) return { error: "Category not found." };

    const { data: vehicle } = await supabase.from("vehicles").select("user_id").eq("id", category.vehicle_id).single();
    if (!vehicle || vehicle.user_id !== user.id) {
        return { error: "You don't have permission to delete this tracker." };
    }

    const { error } = await supabase
        .from("custom_log_categories")
        .delete()
        .eq("id", categoryId);

    if (error) {
        console.error("Error deleting tracker category:", error);
        return { error: error.message };
    }

    return { success: true };
}
