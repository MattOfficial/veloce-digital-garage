"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const displayName = formData.get("display_name") as string;
    const avatarUrl = formData.get("avatar_url") as string;
    const currency = formData.get("currency") as string;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile." };
    }

    const { error } = await supabase
        .from("users")
        .update({
            display_name: displayName || null,
            avatar_url: avatarUrl || null,
            currency: currency || '₹',
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile. Please try again." };
    }

    revalidatePath("/profile");
    revalidatePath("/"); // Revalidate layout where sidebar might be

    return { success: true };
}
