import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/supabase";
import {
    getNextSyncedVehicleCurrentOdometer,
    getVehicleServiceInterval,
    isRoutineServiceType,
} from "@/utils/vehicle-metrics";

type ActionSupabaseClient = Awaited<ReturnType<typeof createClient>>;
type VehicleOdometerSyncRow =
    Pick<Database["public"]["Tables"]["vehicles"]["Row"], "baseline_odometer" | "current_odometer"> & {
        fuel_logs: Array<Pick<Database["public"]["Tables"]["fuel_logs"]["Row"], "odometer">>;
        maintenance_logs: Array<Pick<Database["public"]["Tables"]["maintenance_logs"]["Row"], "odometer">>;
    };
type ServiceIntervalRow = Pick<Database["public"]["Tables"]["service_reminders"]["Row"], "id" | "service_type">;

export async function syncVehicleCurrentOdometer(
    supabase: ActionSupabaseClient,
    vehicleId: string,
    options?: { discardCurrentAtOrBelow?: number | null },
) {
    const { data: vehicle, error } = await supabase
        .from("vehicles")
        .select("baseline_odometer, current_odometer, fuel_logs(odometer), maintenance_logs(odometer)")
        .eq("id", vehicleId);

    const vehicleRow = ((vehicle as unknown as VehicleOdometerSyncRow[]) ?? [])[0];
    if (error || !vehicleRow) {
        if (error) {
            console.error("Error loading vehicle for odometer sync:", error);
        }
        return null;
    }

    const nextOdometer = getNextSyncedVehicleCurrentOdometer(vehicleRow, options);
    const { error: updateError } = await supabase
        .from("vehicles")
        .update({ current_odometer: nextOdometer })
        .eq("id", vehicleId);

    if (updateError) {
        console.error("Error syncing current odometer:", updateError);
        return null;
    }

    return nextOdometer;
}

export async function syncVehicleServiceInterval(
    supabase: ActionSupabaseClient,
    vehicleId: string,
    serviceType: string,
    completedDate: string,
    completedOdometer?: number | null,
) {
    if (!isRoutineServiceType(serviceType)) {
        return;
    }

    const { data: reminders, error } = await supabase
        .from("service_reminders")
        .select("id, service_type")
        .eq("vehicle_id", vehicleId);

    if (error) {
        console.error("Error loading service reminders for sync:", error);
        return;
    }

    const reminder = getVehicleServiceInterval((reminders as unknown as ServiceIntervalRow[]) ?? []);
    if (!reminder) {
        return;
    }

    const updates: Record<string, unknown> = {
        last_completed_date: completedDate,
        updated_at: new Date().toISOString(),
    };

    if (completedOdometer != null) {
        updates.last_completed_odometer = completedOdometer;
    }

    const { error: updateError } = await supabase
        .from("service_reminders")
        .update(updates)
        .eq("id", reminder.id);

    if (updateError) {
        console.error(`Error syncing service interval ${reminder.id}:`, updateError);
    }
}
