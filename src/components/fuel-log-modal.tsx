"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVehicleStore } from "@/store/vehicle-store";
import { useState } from "react";
import { submitFuelLog } from "@/app/actions/fuel";
import { useUserStore } from "@/store/user-store";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { VehicleWithLogs } from "@/types/database";

const formSchema = z.object({
    date: z.string().nonempty({ message: "Date is required" }),
    odometer: z.coerce.number().positive({ message: "Must be a positive number" }),
    fuel_volume: z.coerce.number().positive({ message: "Must be a positive number" }),
    total_cost: z.coerce.number().positive({ message: "Must be a positive number" }),
});

export function FuelLogModal({ vehicle }: { vehicle: VehicleWithLogs }) {
    const { fetchVehicles } = useVehicleStore();
    const { profile, getVolumeUnit } = useUserStore();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Auto-fill odometer based on highest previous reading if any exist
    const latestOdometer = vehicle.fuel_logs?.length > 0
        ? Math.max(...vehicle.fuel_logs.map(l => l.odometer))
        : vehicle.baseline_odometer || 0;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            odometer: latestOdometer,
            fuel_volume: 0,
            total_cost: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("vehicle_id", vehicle.id);
        formData.append("date", values.date);
        formData.append("odometer", values.odometer.toString());
        formData.append("fuel_volume", values.fuel_volume.toString());
        formData.append("total_cost", values.total_cost.toString());

        try {
            const result = await submitFuelLog(formData);
            if (result.success) {
                setMessage({ type: "success", text: "Fuel log successfully added!" });
                fetchVehicles(); // Refresh data for the dashboard
                setTimeout(() => {
                    setOpen(false);
                    setMessage(null);
                    form.reset({
                        date: values.date, // Keep the date they just entered in case of back to back logs
                        odometer: values.odometer,
                        fuel_volume: 0,
                        total_cost: 0
                    });
                }, 1000);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to add log." });
            }
        } catch {
            setMessage({ type: "error", text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => {
            if (!o) setMessage(null);
            setOpen(o);
        }}>
            <DialogTrigger asChild>
                <Button className="rounded-full shadow-md transition-all active:scale-95 bg-primary/90 hover:bg-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Fill-Up
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Log Fill-Up</DialogTitle>
                    <DialogDescription>
                        Enter details for your {vehicle.make} {vehicle.model}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" className="rounded-xl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="odometer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Odometer ({profile.distanceUnit})</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="1" className="rounded-xl" placeholder="e.g. 46250" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fuel_volume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Volume ({getVolumeUnit()})</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" className="rounded-xl" placeholder="e.g. 35.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="total_cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost ({profile.currency})</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" className="rounded-xl" placeholder="e.g. 50.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-destructive/15 text-destructive'}`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full rounded-full h-11 text-base font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                            {isSubmitting ? "Saving..." : "Save Log"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
