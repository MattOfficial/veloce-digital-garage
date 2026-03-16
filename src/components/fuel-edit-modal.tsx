"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVehicleStore } from "@/store/vehicle-store";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { editFuelLog } from "@/app/actions/fuel";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { ui } from "@/content/en/ui";

const formSchema = z.object({
    date: z.string().nonempty({ message: "Date is required" }),
    odometer: z.coerce.number().positive({ message: "Must be a positive number" }),
    fuel_volume: z.coerce.number().positive({ message: "Must be a positive number" }),
    total_cost: z.coerce.number().min(0, { message: "Must be 0 or greater" }),
    fill_type: z.enum(["full", "partial"]),
    estimated_range: z.coerce.number().optional(),
});

type FuelLog = {
    id: string;
    vehicle_id: string;
    date: string;
    odometer: number;
    fuel_volume: number;
    total_cost: number;
    estimated_range?: number | null;
    energy_type?: string;
    fill_type: "full" | "partial";
};

interface FuelEditModalProps {
    log: FuelLog;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FuelEditModal({ log, open, onOpenChange }: FuelEditModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Pencil className="h-5 w-5 text-primary" />
                        {ui.fuel.modal.editTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {ui.fuel.modal.editDescription}
                    </DialogDescription>
                </DialogHeader>

                <FuelEditForm key={`${log.id}-${open ? "open" : "closed"}`} log={log} onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
}

function FuelEditForm({ log, onOpenChange }: { log: FuelLog; onOpenChange: (open: boolean) => void }) {
    const router = useRouter();
    const { fetchVehicles } = useVehicleStore();
    const { profile, getVolumeUnit } = useUserStore();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const isCharge = log.energy_type === 'charge';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: log.date,
            odometer: log.odometer,
            fuel_volume: log.fuel_volume,
            total_cost: log.total_cost,
            fill_type: log.fill_type,
            estimated_range: log.estimated_range ?? undefined,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        const formData = new FormData();
        formData.append("vehicle_id", log.vehicle_id);
        formData.append("date", values.date);
        formData.append("odometer", values.odometer.toString());
        formData.append("fuel_volume", values.fuel_volume.toString());
        formData.append("total_cost", values.total_cost.toString());
        formData.append("fill_type", values.fill_type);
        if (values.estimated_range != null) {
            formData.append("estimated_range", values.estimated_range.toString());
        }

        startTransition(async () => {
            try {
                const result = await editFuelLog(log.id, formData);
                if (result.success) {
                    toast.success(ui.fuel.modal.editSaved);
                    await fetchVehicles();
                    router.refresh();
                    onOpenChange(false);
                } else {
                    setError(result.error || ui.fuel.modal.editFailed);
                }
            } catch {
                setError(ui.fuel.modal.messages.unexpected);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{ui.fuel.modal.labels.date}</FormLabel>
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
                                <FormLabel>{ui.fuel.modal.labels.odometer(profile.distanceUnit)}</FormLabel>
                                <FormControl>
                                    <Input type="number" step="1" className="rounded-xl" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fill_type"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>{ui.fuel.modal.labels.fillType}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="full">
                                            {isCharge ? ui.fuel.modal.fillTypeOptions.fullCharge : ui.fuel.modal.fillTypeOptions.fullFuel}
                                        </SelectItem>
                                        <SelectItem value="partial">
                                            {isCharge ? ui.fuel.modal.fillTypeOptions.partialCharge : ui.fuel.modal.fillTypeOptions.partialFuel}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">{ui.fuel.modal.labels.partialFillHelper}</p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fuel_volume"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{isCharge ? ui.fuel.modal.labels.energy : ui.fuel.modal.labels.volume(getVolumeUnit())}</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" className="rounded-xl" {...field} />
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
                                <FormLabel>{ui.fuel.modal.labels.cost(profile.currency)}</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" className="rounded-xl" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isCharge && (
                        <FormField
                            control={form.control}
                            name="estimated_range"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>{ui.fuel.modal.estimatedRangeShort(profile.distanceUnit)} <span className="text-muted-foreground text-xs font-normal">{ui.fuel.modal.labels.estimatedRangeOptional}</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.1" className="rounded-xl" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {error && (
                    <div className="p-4 rounded-xl text-sm font-medium bg-destructive/15 text-destructive">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full rounded-full h-11 text-base font-semibold" disabled={isPending}>
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {isPending ? ui.common.actions.saving : ui.fuel.modal.saveChanges}
                </Button>
            </form>
        </Form>
    );
}
