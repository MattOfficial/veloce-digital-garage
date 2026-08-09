"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { submitFuelLog } from "@/app/actions/fuel";
import { useUserStore } from "@/store/user-store";

import { Plus } from "lucide-react";
import type { FuelLogEnergyType, VehicleWithLogs } from "@/types/database";
import { canChooseEnergyType, resolveEnergyType } from "@/utils/energy-type";
import { ui } from "@/content/en/ui";
import { ChargeSessionForm } from "@/components/ev/charge-session-form";
import { SubmitButton } from "@/components/submit-button";
import { useVehicleMutation } from "@/hooks/use-vehicle-mutation";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@mattofficial/veloce-ui";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mattofficial/veloce-ui";

const formSchema = z.object({
  date: z.string().nonempty({ message: "Date is required" }),
  odometer: z.coerce
    .number()
    .positive({ message: "Must be a positive number" }),
  fuel_volume: z.coerce
    .number()
    .positive({ message: "Must be a positive number" }),
  total_cost: z.coerce
    .number()
    .min(0, { message: "Must be a positive number or zero" }),
  fill_type: z.enum(["full", "partial"]),
});

export function FuelLogModal({ vehicle }: { vehicle: VehicleWithLogs }) {
  const [open, setOpen] = useState(false);

  const isEV = vehicle.powertrain === "ev";
  const isPHEV = canChooseEnergyType(vehicle.powertrain);

  // Only the plug-in hybrid tabs write this, and only they read it back.
  // Seeding it from the powertrain instead would strand the first value: a
  // useState initialiser runs once, and this modal is never unmounted when the
  // owner switches vehicle, so a petrol car inherited the EV's charge form.
  const [preferredEnergyType, setPreferredEnergyType] =
    useState<FuelLogEnergyType>("fuel");
  const energyType = resolveEnergyType(vehicle.powertrain, preferredEnergyType);
  const isCharge = energyType === "charge";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={isEV ? "outline" : "default"}
          className="rounded-full shadow-sm shadow-primary/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isEV ? ui.ev.chargeModal.trigger : ui.fuel.modal.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-112.5 max-h-[90vh] overflow-y-auto rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEV
              ? ui.ev.chargeModal.title
              : isPHEV
                ? ui.fuel.modal.title.hybrid
                : ui.fuel.modal.title.fillUp}
          </DialogTitle>
          <DialogDescription>
            {isEV
              ? ui.ev.chargeModal.description
              : ui.fuel.modal.description(`${vehicle.make} ${vehicle.model}`)}
          </DialogDescription>
        </DialogHeader>

        {/* A plug-in hybrid runs both streams, and they have nothing in common
            beyond a date and an odometer — different units, different tariffs,
            different way of deriving efficiency. Two forms, not one with
            branches. */}
        {isPHEV && (
          <Tabs
            value={energyType}
            onValueChange={(value: string) =>
              setPreferredEnergyType(value === "charge" ? "charge" : "fuel")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="fuel" className="rounded-lg">
                {ui.fuel.modal.tabs.fuel}
              </TabsTrigger>
              <TabsTrigger value="charge" className="rounded-lg">
                {ui.fuel.modal.tabs.charge}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {isCharge ? (
          <ChargeSessionForm
            key={`${vehicle.id}-charge-${open ? "open" : "closed"}`}
            vehicle={vehicle}
            onSuccess={() => setOpen(false)}
          />
        ) : (
          <FuelLogForm
            key={`${vehicle.id}-fuel-${open ? "open" : "closed"}`}
            vehicle={vehicle}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function FuelLogForm({
  vehicle,
  onSuccess,
}: {
  vehicle: VehicleWithLogs;
  onSuccess: () => void;
}) {
  const { profile, getVolumeUnit } = useUserStore();
  const { run, isPending, error } = useVehicleMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      odometer: getVehicleCurrentOdometer(vehicle),
      fuel_volume: undefined,
      total_cost: 0,
      fill_type: "full",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("vehicle_id", vehicle.id);
    formData.append("date", values.date);
    formData.append("odometer", values.odometer.toString());
    formData.append("fuel_volume", values.fuel_volume.toString());
    formData.append("total_cost", values.total_cost.toString());
    formData.append("energy_type", "fuel");
    formData.append("fill_type", values.fill_type);

    run(() => submitFuelLog(formData), {
      successMessage: ui.fuel.modal.messages.saved,
      failureMessage: ui.fuel.modal.messages.failed,
      onSuccess,
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
                <FormLabel>
                  {ui.fuel.modal.labels.odometer(profile.distanceUnit)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    className="rounded-xl"
                    placeholder={ui.fuel.modal.placeholders.odometer}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fill type exists because a petrol gauge is only trustworthy at
              full. A charge session has a percentage instead, so this field
              lives on the liquid form only. */}
          <FormField
            control={form.control}
            name="fill_type"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{ui.fuel.modal.labels.fillType}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full">
                      {ui.fuel.modal.fillTypeOptions.fullFuel}
                    </SelectItem>
                    <SelectItem value="partial">
                      {ui.fuel.modal.fillTypeOptions.partialFuel}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {ui.fuel.modal.labels.partialFillHelper}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuel_volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {ui.fuel.modal.labels.volume(getVolumeUnit())}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="rounded-xl"
                    placeholder={ui.fuel.modal.placeholders.volume}
                    {...field}
                    value={field.value ?? ""}
                  />
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
                <FormLabel>
                  {ui.fuel.modal.labels.cost(profile.currency)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    className="rounded-xl"
                    placeholder={ui.fuel.modal.placeholders.cost}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/15 p-4 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <SubmitButton isPending={isPending}>
          {ui.fuel.modal.submit.save}
        </SubmitButton>
      </form>
    </Form>
  );
}
