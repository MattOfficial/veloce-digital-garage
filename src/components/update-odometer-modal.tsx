"use client";

import { useState, useTransition } from "react";
import { Gauge } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateVehicle } from "@/app/actions/vehicles";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Button,
  Input,
  Label,
} from "@mattofficial/veloce-ui";

type UpdateOdometerModalProps = {
  vehicleId: string;
  currentOdometer: number;
  trigger?: React.ReactNode;
  onUpdated?: (nextOdometer: number) => void;
};

export function UpdateOdometerModal({
  vehicleId,
  currentOdometer,
  trigger,
  onUpdated,
}: UpdateOdometerModalProps) {
  const router = useRouter();
  const { profile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);

    startTransition(async () => {
      const result = await updateVehicle(vehicleId, formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      const nextOdometer = Number(
        formData.get("current_odometer") || currentOdometer,
      );
      await fetchVehicles();
      router.refresh();
      onUpdated?.(nextOdometer);
      toast.success(ui.vehicle.currentOdometerUpdated);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="rounded-full">
            <Gauge className="mr-2 h-4 w-4" />
            {ui.vehicle.currentOdometer}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>{ui.vehicle.currentOdometer}</DialogTitle>
          <DialogDescription>
            {ui.vehicle.currentOdometerDescription}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_odometer">
              {ui.vehicle.currentOdometer}
            </Label>
            <Input
              id="current_odometer"
              name="current_odometer"
              type="number"
              min="0"
              step="any"
              defaultValue={currentOdometer}
              placeholder={ui.vehicle.currentOdometerPlaceholder}
              className="rounded-xl"
              required
            />
            <p className="text-xs text-muted-foreground">
              {profile.distanceUnit}
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => setOpen(false)}
            >
              {ui.common.actions.cancel}
            </Button>
            <Button type="submit" className="rounded-full" disabled={isPending}>
              {isPending ? ui.common.actions.saving : ui.common.actions.update}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
