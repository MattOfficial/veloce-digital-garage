"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVehicleStore } from "@/store/vehicle-store";
import { useState } from "react";
import { submitFuelLog } from "@/app/actions/fuel";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel } from "lucide-react";

const formSchema = z.object({
    date: z.string().nonempty({ message: "Date is required" }),
    odometer: z.coerce.number().positive({ message: "Must be a positive number" }),
    fuel_volume: z.coerce.number().positive({ message: "Must be a positive number" }),
    total_cost: z.coerce.number().positive({ message: "Must be a positive number" }),
});

export default function FuelPage() {
    const { selectedVehicleId, vehicles } = useVehicleStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            odometer: 0,
            fuel_volume: 0,
            total_cost: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!selectedVehicleId) return;

        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("vehicle_id", selectedVehicleId);
        formData.append("date", values.date);
        formData.append("odometer", values.odometer.toString());
        formData.append("fuel_volume", values.fuel_volume.toString());
        formData.append("total_cost", values.total_cost.toString());

        try {
            const result = await submitFuelLog(formData);
            if (result.success) {
                setMessage({ type: "success", text: "Fuel log successfully added!" });
                // Reset specific fields while keeping date and potentially previous values as baseline
                form.reset({
                    date: values.date,
                    odometer: values.odometer, // Keep the last entered odometer as a convenience
                    fuel_volume: 0,
                    total_cost: 0
                });
            } else {
                setMessage({ type: "error", text: result.error || "Failed to add log." });
            }
        } catch {
            setMessage({ type: "error", text: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!selectedVehicle) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">No Vehicle Selected</h2>
                    <p className="text-muted-foreground">Select a vehicle from the top nav to log fuel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Fuel className="h-8 w-8 text-primary" />
                    Log Fill-Up
                </h1>
                <p className="text-muted-foreground mt-2">
                    Recording fuel for your {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Frictionless Data Entry</CardTitle>
                    <CardDescription>Enter the details from your latest gas station visit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                            <FormLabel>Odometer Reading (km)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" placeholder="e.g. 46250" {...field} />
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
                                            <FormLabel>Fuel Volume (Liters)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="e.g. 35.5" {...field} />
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
                                            <FormLabel>Total Cost (£/$/€)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="e.g. 50.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Fuel Log"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
