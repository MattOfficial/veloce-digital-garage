"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { useUserStore } from "@/store/user-store";

export default function MaintenancePage() {
    const { vehicles, selectedVehicleId } = useVehicleStore();
    const { profile } = useUserStore();
    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    if (!selectedVehicle) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicle Selected</h2>
                    <p className="text-muted-foreground">Select a vehicle to view maintenance schedules.</p>
                </div>
            </div>
        );
    }

    // Find the last recorded odometer reading
    let currentOdometer = selectedVehicle.baseline_odometer;
    if (selectedVehicle.fuel_logs && selectedVehicle.fuel_logs.length > 0) {
        const sortedLogs = [...selectedVehicle.fuel_logs].sort((a, b) => b.odometer - a.odometer);
        currentOdometer = sortedLogs[0].odometer;
    }

    // We can construct simple predictive maintenance schedules here based on general knowledge
    // Standard intervals: Oil change every 10,000 km, Tires every 40,000 km, Air filter every 20,000 km.
    const maintenanceSchedules = [
        { name: "Engine Oil Change", interval: 10000 },
        { name: "Tire Rotation / Replacement", interval: 40000 },
        { name: "Air Filter Replacement", interval: 20000 },
        { name: "Brake Pad Inspection", interval: 30000 },
    ];

    // Try to find the last time this maintenance was done
    const maintenanceStatus = maintenanceSchedules.map(schedule => {
        let lastDoneOdometer = selectedVehicle.baseline_odometer;
        let lastDoneDate = "Never";

        const relatedLogs = selectedVehicle.maintenance_logs?.filter(log =>
            log.service_type.toLowerCase().includes(schedule.name.toLowerCase().split(' ')[0])
        );

        if (relatedLogs && relatedLogs.length > 0) {
            // Approximate the odometer reading based on the date of the maintenance log
            // (Since maintenance logs don't directly store odometer in our schema yet, we just assume it was done and use the current distance calculation logic if we added it, but for now we'll do a basic status check based on how many km the car has driven total)
            // For a robust system we'd add `odometer_at_service` to the `maintenance_logs` table.
            // For Phase 5 we'll simulate.
            lastDoneDate = new Date(relatedLogs[0].date).toLocaleDateString();
        }

        // Simulated driven since last service. In a real system you'd calculate "Current Odo - Odo at Service"
        // Since our schema only has `vehicle_id`, `date`, `service_type`, `cost`, `notes`, we will calculate the 'distance driven since vehicle baseline'.
        // If we assumed baseline was the last service for everything...
        const drivenSinceLast = currentOdometer - selectedVehicle.baseline_odometer;
        const progress = (drivenSinceLast % schedule.interval) / schedule.interval;

        const kmUntilNext = schedule.interval - (drivenSinceLast % schedule.interval);

        let statusRaw: "good" | "warning" | "critical" = "good";
        if (kmUntilNext <= 1000) statusRaw = "critical";
        else if (kmUntilNext <= 3000) statusRaw = "warning";

        // If there's a recent "New Tires" log like our seed data for Tires
        if (schedule.name.includes("Tire") && lastDoneDate !== "Never") {
            statusRaw = "good"; // Override since they are new
        }

        return {
            ...schedule,
            lastDoneDate,
            kmUntilNext,
            status: statusRaw,
            progressPercent: progress * 100
        };
    });

    return (
        <MotionWrapper className="max-w-4xl mx-auto space-y-6 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Wrench className="h-8 w-8 text-primary" />
                    Predictive Maintenance
                </h1>
                <p className="text-muted-foreground mt-2">
                    Keep your {selectedVehicle.year} {selectedVehicle.make} healthy. We predict upcoming services based on your logged mileage.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="bg-primary text-primary-foreground border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary-foreground/80">Estimated Current Mileage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{currentOdometer.toLocaleString()} km</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Service Intervals</CardTitle>
                    <CardDescription>Estimated based on standard mileage intervals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {maintenanceStatus.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 font-medium">
                                        {item.status === "good" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                        {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                        {item.status === "critical" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                        {item.name}
                                    </div>
                                    <div className={`text-sm font-bold ${item.status === 'critical' ? 'text-red-500' : item.status === 'warning' ? 'text-yellow-500' : ''}`}>
                                        {item.status === "good" && item.name.includes("Tire") && item.lastDoneDate !== "Never"
                                            ? "Recently replaced"
                                            : `In ${Math.floor(item.kmUntilNext).toLocaleString()} km`}
                                    </div>
                                </div>

                                {/* Progress bar visual */}
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.status === 'critical' ? 'bg-red-500' : item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: item.status === "good" && item.name.includes("Tire") && item.lastDoneDate !== "Never" ? '0%' : `${item.progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Logs</CardTitle>
                    <CardDescription>History of services performed on this vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedVehicle.maintenance_logs && selectedVehicle.maintenance_logs.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Cost</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedVehicle.maintenance_logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{log.service_type}</TableCell>
                                        <TableCell>{profile.currency}{log.cost.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground">{log.notes || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">No maintenance logs found.</div>
                    )}
                </CardContent>
            </Card>

        </MotionWrapper>
    );
}
