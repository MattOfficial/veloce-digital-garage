"use client";

import { useState, useTransition } from "react";
import { BellRing, Calendar, Activity } from "lucide-react";
import { createServiceReminder } from "@/app/actions/reminders";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { getErrorMessage } from "@/utils/errors";
import { ui } from "@/content/en/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Label,
  Input,
} from "@/lib/veloce-ui";

export function AddReminderModal({
  vehicleId,
  currentOdometer,
}: {
  vehicleId: string;
  currentOdometer: number;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createServiceReminder(formData);
        await fetchVehicles();
        router.refresh();
        setOpen(false);
      } catch (error: unknown) {
        setError(getErrorMessage(error, ui.maintenance.reminders.failed));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-white/10 bg-white/5 hover:bg-white/10"
        >
          <BellRing className="w-4 h-4 mr-2" />
          {ui.maintenance.reminders.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 bg-black/80 backdrop-blur-2xl border-white/10">
        <DialogHeader>
          <DialogTitle>{ui.maintenance.reminders.title}</DialogTitle>
          <DialogDescription>
            {ui.maintenance.reminders.description}
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="vehicle_id" value={vehicleId} />

          <div className="space-y-2">
            <Label htmlFor="service_type">
              {ui.maintenance.reminders.serviceComponentName}
            </Label>
            <Input
              id="service_type"
              name="service_type"
              placeholder={ui.maintenance.reminders.serviceComponentPlaceholder}
              required
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurring_months" className="text-xs">
                {ui.maintenance.reminders.intervalMonths}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recurring_months"
                  name="recurring_months"
                  type="number"
                  placeholder={ui.maintenance.reminders.monthsPlaceholder}
                  className="pl-9 bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring_distance" className="text-xs">
                {ui.maintenance.reminders.intervalDistance(
                  profile.distanceUnit,
                )}
              </Label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recurring_distance"
                  name="recurring_distance"
                  type="number"
                  placeholder={ui.maintenance.reminders.distancePlaceholder}
                  className="pl-9 bg-white/5 border-white/10"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-muted-foreground mb-3 font-medium">
              {ui.maintenance.reminders.baselineTitle}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="last_completed_date"
                  className="text-[10px] text-muted-foreground uppercase"
                >
                  {ui.maintenance.reminders.lastServiceDate}
                </Label>
                <Input
                  id="last_completed_date"
                  name="last_completed_date"
                  type="date"
                  className="bg-white/5 border-white/10 scheme-dark"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="last_completed_odometer"
                  className="text-[10px] text-muted-foreground uppercase"
                >
                  {ui.maintenance.reminders.lastServiceOdo}
                </Label>
                <Input
                  id="last_completed_odometer"
                  name="last_completed_odometer"
                  type="number"
                  placeholder={
                    ui.maintenance.reminders.lastServiceOdoPlaceholder
                  }
                  defaultValue={currentOdometer}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              {ui.common.actions.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPending
                ? ui.common.actions.saving
                : ui.maintenance.reminders.startTracking}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
