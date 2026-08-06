"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { BatteryCharging, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitVehicleSnapshot } from "@/app/actions/snapshots";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { ui } from "@/content/en/ui";
import type { VehicleWithLogs } from "@/types/database";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input } from "@mattofficial/veloce-ui";

const formSchema = z.object({
  date: z.string().nonempty({ message: "Date is required" }),
  odometer: z.coerce.number().min(0, { message: "Must be zero or more" }),
  soc_percent: z.coerce
    .number()
    .min(0, { message: "Must be between 0 and 100" })
    .max(100, { message: "Must be between 0 and 100" }),
  displayed_range: z.coerce.number().optional(),
});

type BatteryCheckInModalProps = {
  vehicle: VehicleWithLogs;
  trigger?: React.ReactNode;
};

/**
 * The primary logging action for an EV. Odometer plus battery percentage is
 * everything the analytics need — the owner never has to know a kWh figure.
 */
export function BatteryCheckInModal({
  vehicle,
  trigger,
}: BatteryCheckInModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            size="sm"
            className="rounded-full shadow-sm shadow-primary/20"
          >
            <BatteryCharging className="mr-2 h-4 w-4" />
            {ui.ev.checkIn.trigger}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl">{ui.ev.checkIn.title}</DialogTitle>
          <DialogDescription>
            {ui.ev.checkIn.description(`${vehicle.make} ${vehicle.model}`)}
          </DialogDescription>
        </DialogHeader>
        <BatteryCheckInForm
          key={`${vehicle.id}-${open ? "open" : "closed"}`}
          vehicle={vehicle}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function BatteryCheckInForm({
  vehicle,
  onSuccess,
}: {
  vehicle: VehicleWithLogs;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const { profile } = useUserStore();
  const { fetchVehicles } = useVehicleStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      odometer: getVehicleCurrentOdometer(vehicle),
      soc_percent: 0,
      displayed_range: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    const formData = new FormData();
    formData.append("vehicle_id", vehicle.id);
    formData.append("date", values.date);
    formData.append("odometer", values.odometer.toString());
    formData.append("soc_percent", values.soc_percent.toString());
    formData.append("source", "manual");

    if (values.displayed_range != null) {
      formData.append("displayed_range", values.displayed_range.toString());
    }

    startTransition(async () => {
      try {
        const result = await submitVehicleSnapshot(formData);

        if (!result.success) {
          setError(result.error ?? ui.ev.checkIn.messages.failed);
          return;
        }

        await fetchVehicles();
        router.refresh();
        toast.success(ui.ev.checkIn.messages.saved);
        onSuccess();
      } catch {
        setError(ui.ev.checkIn.messages.unexpected);
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
                <FormLabel>{ui.ev.checkIn.labels.date}</FormLabel>
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
                <FormLabel>
                  {ui.ev.checkIn.labels.odometer(profile.distanceUnit)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    className="rounded-xl"
                    placeholder={ui.ev.checkIn.placeholders.odometer}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soc_percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ui.ev.checkIn.labels.soc}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    className="rounded-xl"
                    placeholder={ui.ev.checkIn.placeholders.soc}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayed_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {ui.ev.checkIn.labels.displayedRange(profile.distanceUnit)}{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    {ui.ev.checkIn.labels.optional}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    className="rounded-xl"
                    placeholder={ui.ev.checkIn.placeholders.displayedRange}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <p className="text-xs text-muted-foreground">{ui.ev.checkIn.helper}</p>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="submit"
          className="w-full rounded-full h-11 text-base font-semibold"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {isPending
            ? ui.ev.checkIn.submit.saving
            : ui.ev.checkIn.submit.save}
        </Button>
      </form>
    </Form>
  );
}
