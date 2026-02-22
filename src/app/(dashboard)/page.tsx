import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";
import { VehicleWithLogs } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select(
      `
      *,
      fuel_logs (*),
      maintenance_logs (*)
    `
    );

  // Return the mock vehicles since we haven't authenticated or added any records yet.
  const initialVehicles = (vehicles as unknown as VehicleWithLogs[]) || [];

  return <DashboardClient vehicles={initialVehicles} />;
}
