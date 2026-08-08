"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown } from "lucide-react";

import { editFuelLog, submitFuelLog } from "@/app/actions/fuel";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import { useVehicleMutation } from "@/hooks/use-vehicle-mutation";
import { SubmitButton } from "@/components/submit-button";
import {
  CHARGE_PRICING_MODES,
  type ChargePricingMode,
  type FuelLog,
  type VehicleWithLogs,
} from "@/types/database";
import { calculateSessionCost, resolveSessionEnergy } from "@/utils/charge-session";
import { CHARGE_SOURCES } from "@/utils/ev-energy-analytics";
import { formatMoney } from "@/utils/formatting";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@mattofficial/veloce-ui";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@mattofficial/veloce-ui";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value == null ? undefined : Number(value)),
  z.number().optional(),
);

const optionalPercent = z.preprocess(
  (value) => (value === "" || value == null ? undefined : Number(value)),
  z
    .number()
    .min(0, { message: "Must be between 0 and 100" })
    .max(100, { message: "Must be between 0 and 100" })
    .optional(),
);

const formSchema = z.object({
  date: z.string().nonempty({ message: "Date is required" }),
  odometer: z.coerce.number().positive({ message: "Must be a positive number" }),
  charge_source: z.enum(["home", "ac_public", "dc_fast", "other"]),
  pricing_mode: z.enum(["per_kwh", "per_minute", "flat", "free"]),
  fuel_volume: optionalNumber,
  rate_per_unit: optionalNumber,
  duration_minutes: optionalNumber,
  session_fee: optionalNumber,
  idle_minutes: optionalNumber,
  idle_rate_per_minute: optionalNumber,
  tax_percent: optionalNumber,
  start_soc: optionalPercent,
  end_soc: optionalPercent,
  charged_to_full: z.boolean(),
  total_cost: optionalNumber,
  charger_network: z.string().optional(),
  location: z.string().optional(),
});

type ChargeFormValues = z.infer<typeof formSchema>;

function appendOptional(formData: FormData, key: string, value: number | undefined) {
  if (value != null && Number.isFinite(value)) {
    formData.append(key, value.toString());
  }
}

export function ChargeSessionForm({
  vehicle,
  log,
  onSuccess,
}: {
  vehicle: VehicleWithLogs;
  /** Present when editing an existing session. */
  log?: FuelLog;
  onSuccess: () => void;
}) {
  const { profile } = useUserStore();
  const { run, isPending, error } = useVehicleMutation();
  const [showExtras, setShowExtras] = useState(
    log != null &&
      (log.session_fee != null || log.idle_minutes != null || log.tax_percent != null),
  );
  const [overrideCost, setOverrideCost] = useState(false);

  const usableBatteryKwh = vehicle.usable_battery_kwh ?? vehicle.battery_capacity_kwh;

  const form = useForm<ChargeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: log?.date ?? new Date().toISOString().split("T")[0],
      odometer: log?.odometer ?? getVehicleCurrentOdometer(vehicle),
      charge_source: log?.charge_source ?? "home",
      pricing_mode: log?.pricing_mode ?? "per_kwh",
      fuel_volume: log?.fuel_volume ?? undefined,
      // A tariff typed once is usually the tariff next time too.
      rate_per_unit: log?.rate_per_unit ?? profile.electricityTariffPerKwh ?? undefined,
      duration_minutes: log?.duration_minutes ?? undefined,
      session_fee: log?.session_fee ?? undefined,
      idle_minutes: log?.idle_minutes ?? undefined,
      idle_rate_per_minute: log?.idle_rate_per_minute ?? undefined,
      tax_percent: log?.tax_percent ?? undefined,
      start_soc: log?.start_soc ?? undefined,
      end_soc: log?.end_soc ?? undefined,
      charged_to_full: log?.charged_to_full ?? false,
      total_cost: log?.total_cost ?? undefined,
      charger_network: log?.charger_network ?? "",
      location: log?.location ?? "",
    },
  });

  const values = useWatch({ control: form.control });
  const pricingMode = (values.pricing_mode ?? "per_kwh") as ChargePricingMode;
  const isHome = values.charge_source === "home";

  // The same functions the server uses, so the preview is the saved figure.
  const preview = useMemo(() => {
    const energy = resolveSessionEnergy({
      pricingMode,
      energyKwh: pricingMode === "per_kwh" ? values.fuel_volume : null,
      startSoc: values.start_soc,
      endSoc: values.end_soc,
      usableBatteryKwh,
    });

    const cost = calculateSessionCost({
      pricingMode,
      energyKwh: energy.energyKwh,
      ratePerUnit: values.rate_per_unit,
      durationMinutes: values.duration_minutes,
      sessionFee: pricingMode === "flat" ? values.total_cost : values.session_fee,
      idleMinutes: values.idle_minutes,
      idleRatePerMinute: values.idle_rate_per_minute,
      taxPercent: values.tax_percent,
    });

    const total = overrideCost && values.total_cost != null ? values.total_cost : cost.total;

    return {
      energyKwh: energy.energyKwh,
      basis: energy.basis,
      total,
      effectiveRate:
        energy.energyKwh != null && energy.energyKwh > 0 ? total / energy.energyKwh : null,
    };
  }, [overrideCost, pricingMode, usableBatteryKwh, values]);

  function onSubmit(formValues: ChargeFormValues) {
    if (
      formValues.start_soc != null &&
      formValues.end_soc != null &&
      formValues.end_soc <= formValues.start_soc
    ) {
      form.setError("end_soc", { message: ui.ev.chargeModal.errors.socOrder });
      return;
    }

    if (preview.energyKwh == null) {
      form.setError("fuel_volume", {
        message: ui.ev.chargeModal.errors.missingEnergy,
      });
      return;
    }

    const formData = new FormData();
    formData.append("vehicle_id", vehicle.id);
    formData.append("energy_type", "charge");
    formData.append("date", formValues.date);
    formData.append("odometer", formValues.odometer.toString());
    formData.append("charge_source", formValues.charge_source);
    formData.append("pricing_mode", formValues.pricing_mode);
    formData.append("charged_to_full", String(formValues.charged_to_full));

    if (formValues.pricing_mode === "per_kwh") {
      appendOptional(formData, "fuel_volume", formValues.fuel_volume);
    }

    appendOptional(formData, "rate_per_unit", formValues.rate_per_unit);
    appendOptional(formData, "duration_minutes", formValues.duration_minutes);
    appendOptional(formData, "idle_minutes", formValues.idle_minutes);
    appendOptional(formData, "idle_rate_per_minute", formValues.idle_rate_per_minute);
    appendOptional(formData, "tax_percent", formValues.tax_percent);
    appendOptional(formData, "start_soc", formValues.start_soc);
    appendOptional(formData, "end_soc", formValues.end_soc);

    // A flat session's price *is* the session fee, so it lands in that column
    // rather than looking like a surcharge on nothing.
    if (formValues.pricing_mode === "flat") {
      appendOptional(formData, "session_fee", formValues.total_cost);
    } else {
      appendOptional(formData, "session_fee", formValues.session_fee);
    }

    // Omitting the total lets the server price the session from its components.
    // Sending it means the receipt disagreed, and the receipt wins.
    if (overrideCost) {
      appendOptional(formData, "total_cost", formValues.total_cost);
    }

    if (formValues.charger_network) {
      formData.append("charger_network", formValues.charger_network);
    }
    if (formValues.location) {
      formData.append("location", formValues.location);
    }

    run(
      () => (log ? editFuelLog(log.id, formData) : submitFuelLog(formData)),
      {
        successMessage: log
          ? ui.ev.chargeModal.messages.editSaved
          : ui.ev.chargeModal.messages.saved,
        failureMessage: ui.ev.chargeModal.messages.failed,
        onSuccess,
      },
    );
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

          <FormField
            control={form.control}
            name="charge_source"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{ui.ev.chargeModal.labels.chargeSource}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
        </div>

        {/* Presets over the four tariff dimensions, not a taxonomy of their
            own — see docs/ev-charging-redesign.md. */}
        <FormField
          control={form.control}
          name="pricing_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ui.ev.chargeModal.labels.pricingMode}</FormLabel>
              <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-xl">
                  {CHARGE_PRICING_MODES.map((mode) => (
                    <TabsTrigger key={mode} value={mode} className="rounded-lg text-xs">
                      {ui.ev.chargeModal.pricingModes[mode]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground">
                {ui.ev.chargeModal.pricingModeHelp[field.value]}
              </p>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {pricingMode === "per_kwh" && (
            <>
              <FormField
                control={form.control}
                name="fuel_volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ui.ev.chargeModal.labels.units}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        placeholder={ui.ev.chargeModal.placeholders.units}
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
                name="rate_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {ui.ev.chargeModal.labels.ratePerKwh(profile.currency)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        placeholder={ui.ev.chargeModal.placeholders.rate}
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

          {pricingMode === "per_minute" && (
            <>
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ui.ev.chargeModal.labels.durationMinutes}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        className="rounded-xl"
                        placeholder={ui.ev.chargeModal.placeholders.minutes}
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
                name="rate_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {ui.ev.chargeModal.labels.ratePerMinute(profile.currency)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        placeholder={ui.ev.chargeModal.placeholders.rate}
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

          {pricingMode === "flat" && (
            <FormField
              control={form.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    {ui.ev.chargeModal.labels.sessionPrice(profile.currency)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
        </div>

        {/* Without percentages a full charge is the only reference point that
            can anchor an efficiency figure, so it has to be askable. */}
        {values.end_soc == null && (
          <FormField
            control={form.control}
            name="charged_to_full"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-4 dark:border-white/5 dark:bg-white/5">
                <div>
                  <FormLabel className="text-sm">
                    {ui.ev.chargeModal.labels.chargedToFull}
                  </FormLabel>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ui.ev.chargeModal.labels.chargedToFullHelper}
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {!isHome && (
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}

        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg px-2 text-xs font-medium text-muted-foreground"
            onClick={() => setShowExtras((open) => !open)}
          >
            <ChevronDown
              aria-hidden="true"
              className={`mr-1 h-3.5 w-3.5 transition-transform ${showExtras ? "rotate-180" : ""}`}
            />
            {ui.ev.chargeModal.labels.extras}
          </Button>

          {showExtras && (
            <div className="mt-3 grid grid-cols-2 gap-4">
              {pricingMode !== "flat" && (
                <FormField
                  control={form.control}
                  name="session_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {ui.ev.chargeModal.labels.sessionFee(profile.currency)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="tax_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ui.ev.chargeModal.labels.taxPercent}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        placeholder={ui.ev.chargeModal.placeholders.tax}
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
                name="idle_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ui.ev.chargeModal.labels.idleMinutes}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        className="rounded-xl"
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
                name="idle_rate_per_minute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {ui.ev.chargeModal.labels.idleRate(profile.currency)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="rounded-xl"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4 dark:border-white/5 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {ui.ev.chargeModal.summary.title}
          </p>

          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {ui.ev.chargeModal.summary.total}
            </span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatMoney(preview.total, profile.currency, { maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">
              {ui.ev.chargeModal.summary.energy}
            </span>
            <span className="font-medium tabular-nums">
              {preview.energyKwh != null
                ? `${preview.energyKwh.toFixed(2)} kWh`
                : ui.vehicle.emptyValue}
            </span>
          </div>

          {preview.effectiveRate != null && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {ui.ev.chargeModal.summary.effectiveRate(profile.currency)}
              </span>
              <span className="font-medium tabular-nums">
                {preview.effectiveRate.toFixed(2)}
              </span>
            </div>
          )}

          {preview.basis === "soc_derived" && (
            <p className="text-xs text-muted-foreground">
              {ui.ev.chargeModal.summary.derivedFromSoc}
            </p>
          )}

          {preview.energyKwh == null && (
            <p className="text-xs text-amber-700 dark:text-amber-200">
              {usableBatteryKwh == null
                ? ui.ev.chargeModal.summary.needsBatterySize
                : ui.ev.chargeModal.summary.needsSoc}
            </p>
          )}

          {pricingMode !== "flat" && (
            <div className="flex items-center justify-between gap-4 border-t border-border pt-3 dark:border-white/5">
              <div>
                <p className="text-sm font-medium">
                  {ui.ev.chargeModal.labels.overrideCost}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {ui.ev.chargeModal.labels.overrideCostHelper}
                </p>
              </div>
              <Switch checked={overrideCost} onCheckedChange={setOverrideCost} />
            </div>
          )}

          {overrideCost && pricingMode !== "flat" && (
            <FormField
              control={form.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {ui.ev.chargeModal.labels.totalCost(profile.currency)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
