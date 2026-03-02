"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/utils/crypto";

export async function updateProfile(formData: FormData) {
    const displayName = formData.get("display_name") as string;
    const avatarUrl = formData.get("avatar_url") as string;
    const currency = formData.get("currency") as string;
    const distanceUnit = formData.get("distance_unit") as string;
    const llmKey = formData.get("llm_key") as string;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile." };
    }

    const updates: any = {
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
        currency: currency || '₹',
        distance_unit: distanceUnit || 'km',
    };

    if (llmKey && llmKey.trim() !== '') {
        try {
            updates.encrypted_llm_key = encrypt(llmKey.trim());
        } catch (e: any) {
            console.error("Encryption error:", e);
            return { error: "Failed to encrypt API key." };
        }
    }

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile. Please try again." };
    }

    revalidatePath("/profile");
    revalidatePath("/"); // Revalidate layout where sidebar might be

    return { success: true };
}

export async function deleteLlmKey() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in." };
    }

    const { error } = await supabase
        .from("users")
        .update({ encrypted_llm_key: null })
        .eq("id", user.id);

    if (error) {
        console.error("Error deleting API key:", error);
        return { error: "Failed to delete API key." };
    }

    revalidatePath("/profile");
    return { success: true };
}
