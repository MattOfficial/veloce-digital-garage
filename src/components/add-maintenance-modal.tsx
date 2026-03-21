"use client";

import { useState, useTransition } from "react";
import { format, parseISO } from "date-fns";
import { Wrench, CalendarIcon, Plus, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import {
  submitMaintenanceLog,
  editMaintenanceLog,
} from "@/app/actions/maintenance";
import { MaintenanceLog } from "@/types/database";
import type { BadgeDefinition } from "@/lib/badges";

import { ui } from "@/content/en/ui";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/veloce-ui";

interface AddMaintenanceModalProps {
  vehicleId: string;
  logToEdit?: MaintenanceLog;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddMaintenanceModal({
  vehicleId,
  logToEdit,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddMaintenanceModalProps) {
  const router = useRouter();
  const { profile } = useUserStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen =
    isControlled && controlledOnOpenChange
      ? controlledOnOpenChange
      : setUncontrolledOpen;

  const [date, setDate] = useState<Date>(
    logToEdit ? parseISO(logToEdit.date) : new Date(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currencySymbol =
    profile.currency === "USD"
      ? "$"
      : profile.currency === "EUR"
        ? "€"
        : profile.currency === "GBP"
          ? "£"
          : "₹";
  const vehicle = vehicles.find((entry) => entry.id === vehicleId);
  const currentOdometer = vehicle ? getVehicleCurrentOdometer(vehicle) : 0;

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
        toast.success(
          logToEdit
            ? ui.maintenance.addMaintenance.updated
            : ui.maintenance.addMaintenance.saved,
        );
        if ("newBadges" in result && result.newBadges?.length) {
          result.newBadges.forEach((badge: BadgeDefinition) =>
            setTimeout(
              () =>
                toast.success(`🏆 Unlocked: ${badge.name}!`, {
                  description: badge.description,
                }),
              500,
            ),
          );
        }
        await fetchVehicles();
        router.refresh();
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            size="sm"
            className="rounded-full shadow-sm shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            {ui.maintenance.addMaintenance.trigger}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 rounded-[2rem] p-0 overflow-hidden border-primary/10 shadow-xl">
        <div className="bg-muted/30 p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              {logToEdit ? (
                <Edit className="w-5 h-5 mr-2 text-primary" />
              ) : (
                <Wrench className="w-5 h-5 mr-2 text-primary" />
              )}
              {logToEdit
                ? ui.maintenance.addMaintenance.title.edit
                : ui.maintenance.addMaintenance.title.create}
            </DialogTitle>
            <DialogDescription>
              {logToEdit
                ? ui.maintenance.addMaintenance.description.edit
                : ui.maintenance.addMaintenance.description.create}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>{ui.maintenance.addMaintenance.labels.serviceDate}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>{ui.maintenance.addMaintenance.pickDate}</span>
                  )}
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
            <Label htmlFor="service_type">
              {ui.maintenance.addMaintenance.labels.servicePerformed}
            </Label>
            <Select
              name="service_type"
              required
              defaultValue={
                logToEdit?.service_type ||
                ui.maintenance.addMaintenance.serviceTypes[0]
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue
                  placeholder={ui.maintenance.addMaintenance.servicePlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {ui.maintenance.addMaintenance.serviceTypes.map(
                  (serviceType) => (
                    <SelectItem key={serviceType} value={serviceType}>
                      {serviceType}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="odometer">
              {ui.maintenance.addMaintenance.labels.odometerAtService(
                profile.distanceUnit,
              )}
            </Label>
            <Input
              id="odometer"
              name="odometer"
              type="number"
              min="0"
              step="any"
              placeholder={ui.maintenance.addMaintenance.odometerPlaceholder}
              defaultValue={logToEdit?.odometer ?? currentOdometer}
              required
              className="rounded-xl"
            />
          </div>

          {/* Cost Input */}
          <div className="space-y-2">
            <Label htmlFor="cost">
              {ui.maintenance.addMaintenance.labels.totalCost(currencySymbol)}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder={ui.maintenance.addMaintenance.costPlaceholder}
                defaultValue={logToEdit?.cost}
                required
                className="pl-7 rounded-xl"
              />
            </div>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {ui.maintenance.addMaintenance.labels.notes}
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder={ui.maintenance.addMaintenance.notesPlaceholder}
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
              {ui.common.actions.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full shadow-md px-6"
            >
              {isPending
                ? ui.common.actions.saving
                : ui.maintenance.addMaintenance.saveRecord}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
