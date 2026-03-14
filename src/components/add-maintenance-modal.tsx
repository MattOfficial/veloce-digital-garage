"use client";

import { useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { Wrench, CalendarIcon, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { submitMaintenanceLog, editMaintenanceLog } from "@/app/actions/maintenance";
import { MaintenanceLog } from "@/types/database";
import type { BadgeDefinition } from "@/lib/badges";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface AddMaintenanceModalProps {
    vehicleId: string;
    logToEdit?: MaintenanceLog;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function AddMaintenanceModal({ vehicleId, logToEdit, trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddMaintenanceModalProps) {
    const { profile } = useUserStore();
    const { fetchVehicles } = useVehicleStore();

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = isControlled && controlledOnOpenChange ? controlledOnOpenChange : setUncontrolledOpen;

    const [date, setDate] = useState<Date>(logToEdit ? parseISO(logToEdit.date) : new Date());
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const currencySymbol = profile.currency === "USD" ? "$" : profile.currency === "EUR" ? "€" : profile.currency === "GBP" ? "£" : "₹";

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        // Inject the contextual data
        formData.append("vehicle_id", vehicleId);
        formData.append("date", format(date, "yyyy-MM-dd"));

        startTransition(async () => {
            const result = logToEdit
                ? await editMaintenanceLog(logToEdit.id, formData)
                : await submitMaintenanceLog(formData);

            if (result.error) {
                setError(result.error);
            } else {
                // Success! Refresh global state and close modal
                toast.success(logToEdit ? "Service record updated!" : "Service record saved!");
                if ("newBadges" in result && result.newBadges?.length) {
                    result.newBadges.forEach((badge: BadgeDefinition) => setTimeout(() => toast.success(`🏆 Unlocked: ${badge.name}!`, { description: badge.description }), 500));
                }
                fetchVehicles();
                setOpen(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button size="sm" className="rounded-full shadow-sm shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Log Maintenance
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-0 overflow-hidden border-primary/10 shadow-xl">
                <div className="bg-muted/30 p-6 pb-4 border-b">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            {logToEdit ? <Edit className="w-5 h-5 mr-2 text-primary" /> : <Wrench className="w-5 h-5 mr-2 text-primary" />}
                            {logToEdit ? "Edit Service Record" : "Log Service Record"}
                        </DialogTitle>
                        <DialogDescription>
                            {logToEdit ? "Update the details of this maintenance record." : "This record will be permanently attached to this vehicle's history."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                        <Label>Service Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal rounded-xl",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selected) => selected && setDate(selected)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Service Type Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="service_type">Service Performed</Label>
                        <Select name="service_type" required defaultValue={logToEdit?.service_type || "Engine Oil Change"}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select maintenance type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Engine Oil Change">Engine Oil Change</SelectItem>
                                <SelectItem value="Tire Rotation / Replacement">Tire Rotation / Replacement</SelectItem>
                                <SelectItem value="Brake Pad Replacement">Brake Pad Replacement</SelectItem>
                                <SelectItem value="Air Filter Replacement">Air Filter Replacement</SelectItem>
                                <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
                                <SelectItem value="Transmission Fluid">Transmission Fluid</SelectItem>
                                <SelectItem value="General Inspection">General Inspection</SelectItem>
                                <SelectItem value="Other Repair">Other Repair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cost Input */}
                    <div className="space-y-2">
                        <Label htmlFor="cost">Total Cost ({currencySymbol})</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">{currencySymbol}</span>
                            <Input
                                id="cost"
                                name="cost"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                defaultValue={logToEdit?.cost}
                                required
                                className="pl-7 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes & Provider (Optional)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="e.g. Jiffy Lube, included multi-point inspection."
                            defaultValue={logToEdit?.notes || ""}
                            className="rounded-xl resize-none"
                            rows={3}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-full shadow-md px-6"
                        >
                            {isPending ? "Saving..." : "Save Record"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
