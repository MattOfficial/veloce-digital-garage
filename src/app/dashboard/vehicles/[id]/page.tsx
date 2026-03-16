import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VehicleManagerClient } from "./vehicle-manager-client";

export default async function VehiclePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Fetch the specific vehicle with all logs
    const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*, fuel_logs(*), maintenance_logs(*), custom_logs(*), service_reminders(*)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (vehicleError || !vehicle) {
        redirect("/dashboard/profile"); // Redirect back to the garage if not found or unauthorized
    }

    return <VehicleManagerClient vehicle={vehicle} />;
}
