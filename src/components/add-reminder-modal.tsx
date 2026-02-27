"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BellRing, Calendar, Activity } from "lucide-react";
import { createServiceReminder } from "@/app/actions/reminders";
import { useUserStore } from "@/store/user-store";

export function AddReminderModal({ vehicleId }: { vehicleId: string }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const { profile } = useUserStore();

    function onSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            try {
                await createServiceReminder(formData);
                setOpen(false);
            } catch (e: any) {
                setError(e.message || "Failed to create reminder");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                    <BellRing className="w-4 h-4 mr-2" />
                    New Reminder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-2xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Setup Service Reminder</DialogTitle>
                    <DialogDescription>
                        Track a component's lifespan. We'll alert you when it's due for service based on time or mileage.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-4 pt-4">
                    <input type="hidden" name="vehicle_id" value={vehicleId} />

                    <div className="space-y-2">
                        <Label htmlFor="service_type">Service / Component Name</Label>
                        <Input
                            id="service_type"
                            name="service_type"
                            placeholder="e.g. Engine Oil, Spark Plugs, Air Filter"
                            required
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recurring_months" className="text-xs">Interval (Months)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="recurring_months"
                                    name="recurring_months"
                                    type="number"
                                    placeholder="e.g. 6"
                                    className="pl-9 bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recurring_distance" className="text-xs">Interval ({profile.distanceUnit})</Label>
                            <div className="relative">
                                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="recurring_distance"
                                    name="recurring_distance"
                                    type="number"
                                    placeholder={`e.g. 10000`}
                                    className="pl-9 bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-muted-foreground mb-3 font-medium">Initial Baseline state (Optional)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="last_completed_date" className="text-[10px] text-muted-foreground uppercase">Last Service Date</Label>
                                <Input
                                    id="last_completed_date"
                                    name="last_completed_date"
                                    type="date"
                                    className="bg-white/5 border-white/10 [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_completed_odometer" className="text-[10px] text-muted-foreground uppercase">Last Service ODO</Label>
                                <Input
                                    id="last_completed_odometer"
                                    name="last_completed_odometer"
                                    type="number"
                                    placeholder="e.g. 45000"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            {isPending ? "Saving..." : "Start Tracking"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
