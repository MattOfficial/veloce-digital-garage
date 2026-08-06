"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVehicleStore } from "@/store/vehicle-store";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitFuelLog } from "@/app/actions/fuel";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

import { Plus, Loader2 } from "lucide-react";
import { VehicleWithLogs } from "@/types/database";
import type { BadgeDefinition } from "@/lib/badges";
import { ui } from "@/content/en/ui";
import { CHARGE_SOURCES } from "@/utils/ev-energy-analytics";
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
  // Optional because a charge session can report only the state of charge it
  // added, from which kWh is derived server-side.
  fuel_volume: z.coerce
    .number()
    .positive({ message: "Must be a positive number" })
    .optional(),
  total_cost: z.coerce
    .number()
    .min(0, { message: "Must be a positive number or zero" }),
  fill_type: z.enum(["full", "partial"]),
  charge_source: z.enum(["home", "ac_public", "dc_fast", "other"]),
  start_soc: z.coerce
    .number()
    .min(0, { message: "Must be between 0 and 100" })
    .max(100, { message: "Must be between 0 and 100" })
    .optional(),
  end_soc: z.coerce
    .number()
    .min(0, { message: "Must be between 0 and 100" })
    .max(100, { message: "Must be between 0 and 100" })
    .optional(),
  charger_network: z.string().optional(),
  location: z.string().optional(),
});

export function FuelLogModal({ vehicle }: { vehicle: VehicleWithLogs }) {
  const [open, setOpen] = useState(false);

  const isEV = vehicle.powertrain === "ev";
  const isPHEV = vehicle.powertrain === "phev" || vehicle.powertrain === "rex";

  return (
    <Dialog
      open={open}
      onOpenChange={(o: boolean) => {
        setOpen(o);
      }}
    >
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

        <FuelLogForm
          key={`${vehicle.id}-${open ? "open" : "closed"}`}
          vehicle={vehicle}
          isPHEV={isPHEV}
          isEV={isEV}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function FuelLogForm({
  vehicle,
  isPHEV,
  isEV,
  onSuccess,
}: {
  vehicle: VehicleWithLogs;
  isPHEV: boolean;
  isEV: boolean;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const { fetchVehicles } = useVehicleStore();
  const { profile, getVolumeUnit } = useUserStore();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const defaultEnergyType = isEV ? "charge" : "fuel";
  const [energyType, setEnergyType] = useState<"fuel" | "charge">(
    defaultEnergyType,
  );

  const latestOdometer = getVehicleCurrentOdometer(vehicle);
  const isCharge = energyType === "charge";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      odometer: latestOdometer,
      fuel_volume: undefined,
      total_cost: 0,
      fill_type: "full",
      charge_source: "dc_fast",
      start_soc: undefined,
      end_soc: undefined,
      charger_network: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setMessage(null);

    // A liquid fill has no other way to know the volume; a charge session can
    // fall back to the state-of-charge delta.
    const hasSocDelta =
      values.start_soc != null &&
      values.end_soc != null &&
      values.end_soc > values.start_soc;

    if (values.fuel_volume == null && (!isCharge || !hasSocDelta)) {
      form.setError("fuel_volume", {
        message: isCharge
          ? "Enter the energy delivered, or both battery percentages."
          : "Must be a positive number",
      });
      return;
    }

    const formData = new FormData();
    formData.append("vehicle_id", vehicle.id);
    formData.append("date", values.date);
    formData.append("odometer", values.odometer.toString());
    formData.append("total_cost", values.total_cost.toString());
    formData.append("energy_type", energyType);

    if (values.fuel_volume != null) {
      formData.append("fuel_volume", values.fuel_volume.toString());
    }

    if (isCharge) {
      formData.append("charge_source", values.charge_source);
      if (values.start_soc != null) {
        formData.append("start_soc", values.start_soc.toString());
      }
      if (values.end_soc != null) {
        formData.append("end_soc", values.end_soc.toString());
      }
      if (values.charger_network) {
        formData.append("charger_network", values.charger_network);
      }
      if (values.location) {
        formData.append("location", values.location);
      }
    } else {
      formData.append("fill_type", values.fill_type);
    }

    startTransition(async () => {
      try {
        const result = await submitFuelLog(formData);
        if (result.success) {
          setMessage({ type: "success", text: ui.fuel.modal.messages.saved });
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
          setTimeout(() => {
            onSuccess();
          }, 1000);
        } else {
          setMessage({
            type: "error",
            text: result.error || ui.fuel.modal.messages.failed,
          });
        }
      } catch {
        setMessage({ type: "error", text: ui.fuel.modal.messages.unexpected });
      }
    });
  }

  return (
    <>
      {isPHEV && (
        <Tabs
          value={energyType}
          onValueChange={(value: string) =>
            setEnergyType(value === "charge" ? "charge" : "fuel")
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

            {/* Fill type is an ICE concept: it exists because a petrol gauge is
                only trustworthy at full. A charge session does not need it. */}
            {!isCharge && (
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
            )}

            {isCharge && (
              <FormField
                control={form.control}
                name="charge_source"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {ui.ev.chargeModal.labels.chargeSource}
                    </FormLabel>
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
                        {CHARGE_SOURCES.map((source) => (
                          <SelectItem key={source} value={source}>
                            {ui.ev.mix.sources[source]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="fuel_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isCharge
                      ? ui.fuel.modal.labels.energy
                      : ui.fuel.modal.labels.volume(getVolumeUnit())}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl"
                      placeholder={
                        isCharge
                          ? ui.fuel.modal.placeholders.energy
                          : ui.fuel.modal.placeholders.volume
                      }
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

            {isCharge && (
              <>
                <FormField
                  control={form.control}
                  name="start_soc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ui.ev.chargeModal.labels.startSoc}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="rounded-xl"
                          placeholder={ui.ev.chargeModal.placeholders.soc}
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
                  name="end_soc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ui.ev.chargeModal.labels.endSoc}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          className="rounded-xl"
                          placeholder={ui.ev.chargeModal.placeholders.soc}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="col-span-2 text-xs text-muted-foreground">
                  {ui.ev.chargeModal.labels.energyOptional}
                </p>

                <FormField
                  control={form.control}
                  name="charger_network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ui.ev.chargeModal.labels.network}</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-xl"
                          placeholder={ui.ev.chargeModal.placeholders.network}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{ui.ev.chargeModal.labels.location}</FormLabel>
                      <FormControl>
                        <Input
                          className="rounded-xl"
                          placeholder={ui.ev.chargeModal.placeholders.location}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-full h-11 text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : null}
            {isPending
              ? ui.fuel.modal.submit.saving
              : ui.fuel.modal.submit.save}
          </Button>
        </form>
      </Form>
    </>
  );
}
