import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MaintenanceClient from "./maintenance-client";

export default async function MaintenancePage() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Fetch custom categories for the user so the dashboard can map tracking history names
    const { data: categories } = await supabase
        .from("custom_log_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return <MaintenanceClient categories={categories || []} />;
}
