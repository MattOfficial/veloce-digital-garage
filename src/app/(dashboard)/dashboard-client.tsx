"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { VehicleWithLogs } from "@/types/database";
import { MotionWrapper } from "@/components/motion-wrapper";

export default function DashboardClient() {
    const { vehicles, isLoading } = useVehicleStore();
    const selectedVehicle = useVehicleStore((state) => state.getSelectedVehicle());

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!selectedVehicle || vehicles.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicles Found</h2>
                    <p className="text-muted-foreground">
                        Please add a vehicle to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <MotionWrapper className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Overview for your {selectedVehicle.year} {selectedVehicle.make}{" "}
                    {selectedVehicle.model}.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* We will build these metric cards out later */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">
                            Current Odometer
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                            {selectedVehicle.baseline_odometer.toLocaleString()} km
                        </div>
                    </div>
                </div>
            </div>
        </MotionWrapper>
    );
}
