import { getVehicleCurrentOdometer, getVehicleServiceInterval, isRoutineServiceType } from "@/utils/vehicle-metrics";

type SupabaseLikeClient = {
    from: (table: string) => {
        select: (query: string) => {
            eq: (column: string, value: string) => Promise<{ data: any; error: any }>;
        };
        update: (values: Record<string, unknown>) => {
            eq: (column: string, value: string) => Promise<{ error: any }>;
        };
    };
};

export async function syncVehicleCurrentOdometer(
    supabase: SupabaseLikeClient,
    vehicleId: string,
) {
    const { data: vehicle, error } = await supabase
        .from("vehicles")
        .select("baseline_odometer, current_odometer, fuel_logs(odometer), maintenance_logs(odometer)")
        .eq("id", vehicleId);

    const vehicleRow = Array.isArray(vehicle) ? vehicle[0] : vehicle;
    if (error || !vehicleRow) {
        if (error) {
            console.error("Error loading vehicle for odometer sync:", error);
        }
        return null;
    }

    const nextOdometer = getVehicleCurrentOdometer(vehicleRow);
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
    supabase: SupabaseLikeClient,
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

    const reminder = getVehicleServiceInterval(Array.isArray(reminders) ? reminders : []);
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
