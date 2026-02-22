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

    // Fetch the specific vehicle
    const { data: vehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*, fuel_logs(*), maintenance_logs(*)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (vehicleError || !vehicle) {
        redirect("/profile"); // Redirect back to garage if not found or unauthorized
    }

    return <VehicleManagerClient vehicle={vehicle} />;
}
