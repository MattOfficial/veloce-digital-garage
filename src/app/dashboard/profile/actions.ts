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
    const openAiKey = formData.get("openai_key") as string;
    const deepseekKey = formData.get("deepseek_key") as string;
    const preferredProvider = formData.get("preferred_provider") as string;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile." };
    }

    const updates: any = {};
    updates.display_name = displayName || null;
    updates.avatar_url = avatarUrl || null;
    updates.currency = currency || '₹';
    updates.distance_unit = distanceUnit || 'km';
    updates.preferred_llm_provider = preferredProvider || 'gemini';

    if (llmKey && llmKey.trim() !== '') {
        try {
            updates.encrypted_llm_key = encrypt(llmKey.trim());
        } catch (e: any) {
            console.error("Encryption error:", e);
            return { error: "Failed to encrypt Google Gemini API key." };
        }
    }

    if (openAiKey && openAiKey.trim() !== '') {
        try {
            updates.encrypted_openai_key = encrypt(openAiKey.trim());
        } catch (e: any) {
            console.error("Encryption error:", e);
            return { error: "Failed to encrypt OpenAI API key." };
        }
    }

    if (deepseekKey && deepseekKey.trim() !== '') {
        try {
            updates.encrypted_deepseek_key = encrypt(deepseekKey.trim());
        } catch (e: any) {
            console.error("Encryption error:", e);
            return { error: "Failed to encrypt Deepseek API key." };
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

    revalidatePath("/dashboard/profile");
    revalidatePath("/"); // Revalidate layout where sidebar might be

    return { success: true };
}

export async function deleteLlmKey(provider: 'gemini' | 'openai' | 'deepseek' = 'gemini') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in." };
    }

    const columnMap = {
        gemini: 'encrypted_llm_key',
        openai: 'encrypted_openai_key',
        deepseek: 'encrypted_deepseek_key'
    };

    const { error } = await supabase
        .from("users")
        .update({ [columnMap[provider]]: null })
        .eq("id", user.id);

    if (error) {
        console.error("Error deleting API key:", error);
        return { error: "Failed to delete API key." };
    }

    revalidatePath("/profile");
    return { success: true };
}
