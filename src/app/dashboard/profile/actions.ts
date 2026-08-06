"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/utils/crypto";
import type { ProviderPreference } from "@/types/ai";
import type { TablesUpdate } from "@/types/supabase";
import { isEvEfficiencyUnit } from "@/utils/efficiency-units";

/** Blank means "not set", which is distinct from zero for a price or a rate. */
function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
    if (typeof value !== "string" || value.trim() === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export async function updateProfile(formData: FormData) {
    const displayName = formData.get("display_name") as string;
    const avatarUrl = formData.get("avatar_url") as string;
    const currency = formData.get("currency") as string;
    const distanceUnit = formData.get("distance_unit") as string;
    const llmKey = formData.get("llm_key") as string;
    const openAiKey = formData.get("openai_key") as string;
    const deepseekKey = formData.get("deepseek_key") as string;
    const preferredProvider = formData.get("preferred_provider") as ProviderPreference | null;
    const electricityTariff = parseOptionalNumber(formData.get("electricity_tariff_per_kwh"));
    const petrolPriceReference = parseOptionalNumber(formData.get("petrol_price_reference"));
    const iceReferenceEfficiency = parseOptionalNumber(formData.get("ice_reference_efficiency"));
    const evEfficiencyUnit = formData.get("ev_efficiency_unit") as string | null;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile." };
    }

    const updates: TablesUpdate<"users"> = {};
    updates.display_name = displayName || null;
    updates.avatar_url = avatarUrl || null;
    updates.currency = currency || '₹';
    updates.distance_unit = distanceUnit || 'km';
    updates.preferred_llm_provider = preferredProvider || 'gemini';
    updates.electricity_tariff_per_kwh = electricityTariff;
    updates.petrol_price_reference = petrolPriceReference;
    updates.ice_reference_efficiency = iceReferenceEfficiency;
    updates.ev_efficiency_unit =
        typeof evEfficiencyUnit === 'string' && isEvEfficiencyUnit(evEfficiencyUnit)
            ? evEfficiencyUnit
            : null;

    if (llmKey && llmKey.trim() !== '') {
        try {
            updates.encrypted_llm_key = encrypt(llmKey.trim());
        } catch (error: unknown) {
            console.error("Encryption error:", error);
            return { error: "Failed to encrypt Google Gemini API key." };
        }
    }

    if (openAiKey && openAiKey.trim() !== '') {
        try {
            updates.encrypted_openai_key = encrypt(openAiKey.trim());
        } catch (error: unknown) {
            console.error("Encryption error:", error);
            return { error: "Failed to encrypt OpenAI API key." };
        }
    }

    if (deepseekKey && deepseekKey.trim() !== '') {
        try {
            updates.encrypted_deepseek_key = encrypt(deepseekKey.trim());
        } catch (error: unknown) {
            console.error("Encryption error:", error);
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

    revalidatePath("/dashboard/profile");
    return { success: true };
}
