"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Car,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Droplet,
  Fuel,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  PiggyBank,
  Plus,
  Receipt,
  Route,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { AddMaintenanceModal } from "@/components/add-maintenance-modal";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { MetricCard } from "@/components/metric-card";
import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import type { CustomLogCategory } from "@/types/database";
import {
  calculateSmartNextRefillFromHistory,
  getRefillDisplayString,
  getStatusClassName,
  type RefillStatus,
} from "@/utils/cadence-predictions";
import {
  estimateDaysOfRangeLeft,
  collectSocObservations,
  getLatestSocSnapshot,
  summarizeBatteryHealth,
} from "@/utils/battery-health";
import { createTrailingDayRange, getVehicleDistanceSummary } from "@/utils/distance-analytics";
import {
  convertFuelEfficiency,
  getDefaultFuelEfficiencyUnit,
} from "@/utils/efficiency-units";
import { getEvEfficiencyDisplay } from "@/utils/ev-efficiency-display";
import { buildEvSavings } from "@/utils/ev-savings";
import { buildFuelAnalytics, type FuelAnalyticsMode } from "@/utils/fuel-analytics";
import {
  formatMoney,
  formatMoneyExact,
  formatNumber,
  getCurrencySymbol,
} from "@/utils/formatting";
import { getOwnershipCostSummary } from "@/utils/ownership-analytics";
import {
  getServiceReminderStatus,
  getVehicleCurrentOdometer,
} from "@/utils/vehicle-metrics";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";

const chartConfig = {
  fuel: { label: "Fuel", color: "#f59e0b" },
  maintenance: { label: "Maintenance", color: "#3b82f6" },
  other: { label: "Other", color: "#8b5cf6" },
} satisfies ChartConfig;

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Droplet,
  Receipt,
  Wrench,
  Map: MapIcon,
  Zap,
  Car,
};

const CATEGORY_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  emerald: "#10b981",
  violet: "#8b5cf6",
  rose: "#f43f5e",
  amber: "#f59e0b",
  slate: "#64748b",
};

type DashboardActivity = {
  id: string;
  type: "fuel" | "maintenance" | "other";
  label: string;
  detail: string;
  date: string;
  cost: number | null;
  icon: React.ElementType;
  color: string;
};

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatActivityDate(value: string) {
  const date = parseDateOnly(value);
  return date
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : value;
}

function getPredictionTone(status: RefillStatus) {
  switch (status) {
    case "overdue":
      return "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300";
    case "refuelling-imminent":
      return "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300";
    case "refuelling-soon":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "on-track":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    default:
      return "border-border bg-muted/60 text-muted-foreground";
  }
}

function PredictionStatusIcon({
  status,
  className,
}: {
  status: RefillStatus;
  className?: string;
}) {
  if (status === "overdue") {
    return <AlertTriangle className={className} />;
  }
  if (status === "refuelling-imminent" || status === "refuelling-soon") {
    return <Clock3 className={className} />;
  }
  if (status === "on-track") {
    return <CheckCircle2 className={className} />;
  }
  return <CalendarClock className={className} />;
}

export default function DashboardClient({
  categories = [],
}: {
  categories?: CustomLogCategory[];
}) {
  const { vehicles, isLoading } = useVehicleStore();
  const selectedVehicle = useVehicleStore((state) => state.getSelectedVehicle());
  const { profile, getVolumeUnit, getEvEfficiencyUnit } = useUserStore();

  const analytics = useMemo(
    () =>
      buildFuelAnalytics(
        selectedVehicle?.fuel_logs ?? [],
        selectedVehicle?.baseline_odometer ?? 0,
      ),
    [selectedVehicle?.baseline_odometer, selectedVehicle?.fuel_logs],
  );

  const ownership = useMemo(
    () => (selectedVehicle ? getOwnershipCostSummary(selectedVehicle) : null),
    [selectedVehicle],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <CircleGauge className="mx-auto h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">{ui.dashboard.loading}</p>
        </div>
      </div>
    );
  }

  if (!selectedVehicle || vehicles.length === 0 || !ownership) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-sm space-y-4 text-center">
          <h2 className="text-2xl font-semibold">
            {ui.dashboard.noVehiclesFoundTitle}
          </h2>
          <p className="text-muted-foreground">
            {ui.dashboard.noVehiclesFoundDescription}
          </p>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/profile">{ui.dashboard.goToProfile}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currencySymbol = getCurrencySymbol(profile.currency);
  const distanceUnit = profile.distanceUnit;
  const volumeUnit = getVolumeUnit();
  const latestOdometer = getVehicleCurrentOdometer(selectedVehicle);
  const distanceLast30Days = getVehicleDistanceSummary(
    selectedVehicle,
    createTrailingDayRange(30),
  );

  const hasFuelLogs = analytics.fuel.logs.length > 0;
  const hasChargeLogs = analytics.charge.logs.length > 0;
  const latestFuelDate = analytics.fuel.logs.at(-1)?.date ?? "";
  const latestChargeDate = analytics.charge.logs.at(-1)?.date ?? "";
  const analysisMode: FuelAnalyticsMode =
    selectedVehicle.powertrain === "ev" ||
    (!hasFuelLogs && hasChargeLogs) ||
    ((selectedVehicle.powertrain === "phev" || selectedVehicle.powertrain === "rex") &&
      latestChargeDate > latestFuelDate)
      ? "charge"
      : "fuel";
  const activeStream = analytics[analysisMode];

  // How much riding is left comes from state-of-charge check-ins; efficiency
  // does not. It is the same charge-session derivation the Energy & Battery page
  // shows, so the two surfaces cannot disagree.
  const isEv = selectedVehicle.powertrain === "ev";
  // Charge sessions record the same odometer-plus-percentage reading a check-in
  // does, and an owner logs far more of them.
  const socObservations = collectSocObservations(
    selectedVehicle.vehicle_snapshots ?? [],
    selectedVehicle.fuel_logs ?? [],
  );
  const batteryHealth = summarizeBatteryHealth(socObservations, {
    usableBatteryKwh:
      selectedVehicle.usable_battery_kwh ?? selectedVehicle.battery_capacity_kwh,
    baselineRangeKm: selectedVehicle.baseline_range_km,
  });
  const evEfficiency = getEvEfficiencyDisplay(selectedVehicle, {
    unit: getEvEfficiencyUnit(),
    distanceUnit,
  });
  const latestSocSnapshot = getLatestSocSnapshot(socObservations);
  const evDaysOfRangeLeft = estimateDaysOfRangeLeft(
    latestSocSnapshot?.soc_percent ?? null,
    batteryHealth.kmPerPercent,
    distanceLast30Days.value != null && distanceLast30Days.value > 0
      ? distanceLast30Days.value / 30
      : null,
  );
  // Same derivation as the Energy & Battery page's "Saved vs petrol" card, so
  // the two surfaces cannot disagree.
  const evSavings = isEv
    ? buildEvSavings(selectedVehicle, vehicles, {
        petrolPricePerUnit: profile.petrolPriceReference,
        iceReferenceEfficiency: profile.iceReferenceEfficiency,
        currency: profile.currency,
      })
    : null;

  const totalEfficiencyDistance = activeStream.closed_segments.reduce(
    (sum, segment) => sum + segment.distance,
    0,
  );
  const totalEfficiencyVolume = activeStream.closed_segments.reduce(
    (sum, segment) => sum + segment.volume,
    0,
  );
  const fuelEfficiencyUnit = getDefaultFuelEfficiencyUnit(
    distanceUnit,
    volumeUnit,
  );
  const efficiencyUnit =
    analysisMode === "charge"
      ? distanceUnit === "miles"
        ? "mi/kWh"
        : "km/kWh"
      : fuelEfficiencyUnit;
  const averageEfficiency =
    analysisMode === "charge"
      ? totalEfficiencyDistance > 0 && totalEfficiencyVolume > 0
        ? totalEfficiencyDistance / totalEfficiencyVolume
        : null
      : convertFuelEfficiency(
          totalEfficiencyDistance,
          totalEfficiencyVolume,
          fuelEfficiencyUnit,
          distanceUnit,
          volumeUnit,
        );

  const displaySegmentEfficiency = (index: number) => {
    const segment = activeStream.closed_segments[index];
    if (!segment) return null;
    return analysisMode === "charge"
      ? segment.distance / segment.volume
      : convertFuelEfficiency(
          segment.distance,
          segment.volume,
          fuelEfficiencyUnit,
          distanceUnit,
          volumeUnit,
        );
  };
  const latestEfficiency = displaySegmentEfficiency(
    activeStream.closed_segments.length - 1,
  );
  const previousEfficiency = displaySegmentEfficiency(
    activeStream.closed_segments.length - 2,
  );
  const efficiencyDirection =
    latestEfficiency != null && previousEfficiency != null && previousEfficiency > 0
      ? ((latestEfficiency - previousEfficiency) / previousEfficiency) *
        (fuelEfficiencyUnit === "L/100km" && analysisMode === "fuel" ? -100 : 100)
      : null;

  const prediction = calculateSmartNextRefillFromHistory(
    activeStream.logs.map((log) => log.date),
  );
  const serviceStatuses = (selectedVehicle.service_reminders ?? [])
    .map((reminder) =>
      getServiceReminderStatus(reminder, latestOdometer),
    )
    .sort((left, right) => {
      const priority = { overdue: 0, "due-soon": 1, "needs-baseline": 2, healthy: 3 };
      const byStatus = priority[left.status] - priority[right.status];
      if (byStatus !== 0) return byStatus;
      return (right.overallProgress ?? -1) - (left.overallProgress ?? -1);
    });
  const nextService = serviceStatuses[0] ?? null;

  const vehicleCategories = categories.filter(
    (category) => category.vehicle_id === selectedVehicle.id,
  );
  const activities: DashboardActivity[] = [
    ...(selectedVehicle.fuel_logs ?? []).map((log) => ({
      id: log.id,
      type: "fuel" as const,
      label: log.energy_type === "charge" ? "Charged" : "Refuelled",
      detail:
        log.energy_type === "charge"
          ? `${log.fuel_volume.toLocaleString()} kWh · ${log.odometer.toLocaleString()} ${distanceUnit}`
          : `${log.fuel_volume.toLocaleString()} ${volumeUnit} · ${log.odometer.toLocaleString()} ${distanceUnit}`,
      date: log.date,
      cost: log.total_cost,
      icon: log.energy_type === "charge" ? Zap : Droplet,
      color: log.energy_type === "charge" ? "#14b8a6" : "#f59e0b",
    })),
    ...(selectedVehicle.maintenance_logs ?? []).map((log) => ({
      id: log.id,
      type: "maintenance" as const,
      label: log.service_type,
      detail: log.notes || ui.dashboard.maintenanceLogged,
      date: log.date,
      cost: log.cost,
      icon: Wrench,
      color: "#3b82f6",
    })),
    ...(selectedVehicle.custom_logs ?? []).map((log) => {
      const category = vehicleCategories.find(
        (entry) => entry.id === log.category_id,
      );
      return {
        id: log.id,
        type: "other" as const,
        label: category?.name ?? ui.dashboard.customEntryLabel,
        detail: log.notes || ui.dashboard.entryLogged,
        date: log.date,
        cost: category?.track_cost === false ? null : log.cost,
        icon: category ? ICON_MAP[category.icon] ?? Activity : Activity,
        color: CATEGORY_COLORS[category?.color_theme ?? "slate"] ?? "#64748b",
      };
    }),
  ]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5);

  const spendMix = [
    { label: "Fuel", value: ownership.totalFuelCost, color: "bg-amber-500" },
    {
      label: "Maintenance",
      value: ownership.totalMaintenanceCost,
      color: "bg-blue-500",
    },
    { label: "Other", value: ownership.totalOtherCost, color: "bg-violet-500" },
  ].filter((item) => item.value > 0);

  const costPerDistanceLabel =
    ownership.costPerDistance == null
      ? ui.common.emptyValue
      : formatMoneyExact(ownership.costPerDistance, currencySymbol);
  const spendTrend = ownership.periodTrendPercent;
  const SpendTrendIcon =
    spendTrend != null && spendTrend > 0 ? ArrowUpRight : ArrowDownRight;

  const serviceSummary = (() => {
    if (!nextService) return "Add a reminder to stay ahead of service";
    if (nextService.status === "overdue") return "Service is overdue";
    if (nextService.status === "due-soon") {
      if (nextService.daysRemaining != null) {
        return `Due in ${Math.max(0, nextService.daysRemaining)} days`;
      }
      if (nextService.distanceRemaining != null) {
        return `${formatNumber(Math.max(0, nextService.distanceRemaining))} ${distanceUnit} remaining`;
      }
      return "Approaching its service interval";
    }
    if (nextService.status === "needs-baseline") {
      return "Add the last service baseline";
    }
    if (nextService.daysRemaining != null) {
      return `Due in ${nextService.daysRemaining} days`;
    }
    if (nextService.distanceRemaining != null) {
      return `${formatNumber(nextService.distanceRemaining)} ${distanceUnit} remaining`;
    }
    return "No service pressure detected";
  })();

  return (
    <MotionWrapper className="mx-auto max-w-7xl space-y-5 pb-10">
      <PageHeader
        title="Command center"
        description={ui.dashboard.overviewDescription(
          `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        )}
        icon={LayoutDashboard}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AddMaintenanceModal
            vehicleId={selectedVehicle.id}
            trigger={
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="mr-1.5 h-4 w-4" />
                Service
              </Button>
            }
          />
          <FuelLogModal vehicle={selectedVehicle} />
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-12">
        <MotionWrapper delay={0.05} className="lg:col-span-7">
          <Card className="relative h-full min-h-[22rem] overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/15 via-background to-background py-0 shadow-sm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[48px] border-primary/10"
            />
            <CardContent className="relative flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    All-in running cost
                  </p>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Fuel, maintenance and tracked extras across every recorded {distanceUnit}.
                  </p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden rounded-full bg-background/60 sm:inline-flex"
                >
                  <Link href="/dashboard/insights">
                    Explore trends <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="py-7">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-5xl font-semibold tracking-[-0.06em] tabular-nums sm:text-7xl">
                    {costPerDistanceLabel}
                  </span>
                  <span className="text-lg font-medium text-muted-foreground">
                    / {distanceUnit}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {ownership.trackedDistance > 0
                    ? `${formatMoney(ownership.totalCost, currencySymbol)} tracked over ${formatNumber(ownership.trackedDistance)} ${distanceUnit}`
                    : "Add odometer history to unlock your ownership rate."}
                </p>
                {isEv && evSavings?.savings != null && (
                  <Link
                    href="/dashboard/fuel"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/15 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/15"
                  >
                    <PiggyBank className="h-3.5 w-3.5" />
                    {formatMoney(evSavings.savings, currencySymbol)} saved vs petrol
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-border/70 pt-5 sm:grid-cols-3 sm:gap-0">
                <div className="sm:pr-5">
                  <p className="text-xs text-muted-foreground">30-day spend</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold tabular-nums">
                      {formatMoney(ownership.currentPeriodCost, currencySymbol)}
                    </span>
                    {spendTrend == null ? (
                      <span className="text-[11px] text-muted-foreground">No prior period</span>
                    ) : (
                      <span
                        className={`inline-flex items-center text-[11px] font-medium ${
                          spendTrend > 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        <SpendTrendIcon className="mr-0.5 h-3 w-3" />
                        {Math.abs(spendTrend).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-border/70 sm:border-l sm:px-5">
                  <p className="text-xs text-muted-foreground">30-day distance</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {distanceLast30Days.hasSufficientData &&
                    distanceLast30Days.value != null
                      ? `${formatNumber(distanceLast30Days.value)} ${distanceUnit}`
                      : ui.common.emptyValue}
                  </p>
                </div>
                <div className="border-border/70 sm:border-l sm:pl-5">
                  <p className="text-xs text-muted-foreground">Current odometer</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {formatNumber(latestOdometer)} {distanceUnit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <MotionWrapper delay={0.1}>
            <MetricCard
              tone="emerald"
              icon={<Gauge className="h-4 w-4" />}
              label="Efficiency pulse"
              value={
                isEv
                  ? evEfficiency.value == null
                    ? ui.common.emptyValue
                    : evEfficiency.value.toFixed(evEfficiency.precision)
                  : averageEfficiency == null
                    ? ui.common.emptyValue
                    : averageEfficiency.toFixed(2)
              }
              hint={
                <>
                  <span>{isEv ? evEfficiency.unit : efficiencyUnit}</span>
                  {isEv && evEfficiency.basis != null && (
                    <span>· {ui.ev.efficiency.basis[evEfficiency.basis]}</span>
                  )}
                  {!isEv && efficiencyDirection != null && (
                    <span
                      className={
                        efficiencyDirection >= 0
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-rose-700 dark:text-rose-300"
                      }
                    >
                      · {efficiencyDirection >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(efficiencyDirection).toFixed(1)}% latest
                    </span>
                  )}
                </>
              }
            />
          </MotionWrapper>

          <MotionWrapper delay={0.15}>
            <Card className="h-full gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
              <div className="grid h-full sm:grid-cols-2 lg:grid-cols-2">
                <Link
                  href="/dashboard/fuel"
                  className="group p-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {isEv
                        ? "Range left"
                        : analysisMode === "charge"
                          ? "Next charge"
                          : "Next refuel"}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${getPredictionTone(prediction.status)}`}
                    >
                      {isEv
                        ? batteryHealth.confidence === "none"
                          ? "Learning"
                          : `${batteryHealth.confidence} confidence`
                        : prediction.confidence === "none"
                          ? "Learning"
                          : `${prediction.confidence} confidence`}
                    </span>
                  </div>
                  {/* Charging is nightly, so "when is the next one due" is not a
                      useful question for an EV. How much riding is left is. */}
                  {isEv ? (
                    <>
                      <Zap className="mt-5 h-5 w-5 text-teal-500" />
                      <p className="mt-2 text-sm font-semibold leading-snug">
                        {evDaysOfRangeLeft != null
                          ? ui.ev.rangeLeft.daysRemaining(evDaysOfRangeLeft)
                          : ui.ev.rangeLeft.unavailable}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {latestSocSnapshot?.soc_percent != null
                          ? ui.ev.rangeLeft.atSoc(latestSocSnapshot.soc_percent)
                          : ui.ev.health.emptyTitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <PredictionStatusIcon
                        status={prediction.status}
                        className={`mt-5 h-5 w-5 ${getStatusClassName(prediction.status)}`}
                      />
                      <p className={`mt-2 text-sm font-semibold leading-snug ${getStatusClassName(prediction.status)}`}>
                        {getRefillDisplayString(prediction, analysisMode)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {prediction.intervalDays
                          ? `Typical cadence: ${prediction.intervalDays} days`
                          : "Two dated sessions unlock a forecast"}
                      </p>
                    </>
                  )}
                </Link>

                <Link
                  href="/dashboard/maintenance"
                  className="group border-t border-border/70 p-5 transition-colors hover:bg-muted/40 sm:border-l sm:border-t-0 lg:border-l"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Service watch
                    </p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <Wrench
                    className={`mt-5 h-5 w-5 ${
                      nextService?.status === "overdue"
                        ? "text-rose-600 dark:text-rose-400"
                        : nextService?.status === "due-soon"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                  <p className="mt-2 line-clamp-1 text-sm font-semibold">
                    {nextService?.reminder.service_type ?? "No reminder set"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{serviceSummary}</p>
                </Link>
              </div>
            </Card>
          </MotionWrapper>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <MotionWrapper delay={0.2} className="min-w-0 lg:col-span-8">
          <Card className="h-full min-w-0 gap-4 overflow-hidden rounded-3xl py-0 shadow-sm">
            <CardHeader className="flex flex-col items-start justify-between gap-3 border-b border-border/70 px-5 py-5 sm:flex-row sm:px-6">
              <div>
                <CardTitle>Cost velocity</CardTitle>
                <CardDescription>Six months of fuel, service and tracked extras</CardDescription>
              </div>
              <div className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium tabular-nums">
                {formatMoney(ownership.currentPeriodCost, currencySymbol)} last 30 days
              </div>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden px-3 pb-5 sm:px-6">
              <ChartContainer config={chartConfig} className="h-[280px] min-w-0 w-full max-w-full">
                <BarChart
                  accessibilityLayer
                  data={ownership.monthlyCosts}
                  margin={{ top: 18, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 5" opacity={0.35} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    tickFormatter={(value) =>
                      `${currencySymbol}${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`
                    }
                  />
                  <ChartTooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.35 }}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        formatter={(value, name) => (
                          <div className="flex w-full min-w-36 items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                            </span>
                            <span className="font-mono font-medium tabular-nums">
                              {formatMoney(Number(value), currencySymbol)}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="fuel" stackId="cost" fill="var(--color-fuel)" radius={[0, 0, 3, 3]} />
                  <Bar dataKey="maintenance" stackId="cost" fill="var(--color-maintenance)" />
                  <Bar dataKey="other" stackId="cost" fill="var(--color-other)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>

              {spendMix.length > 0 && (
                <div className="grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-3">
                  {spendMix.map((item) => {
                    const share = ownership.totalCost > 0 ? (item.value / ownership.totalCost) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium tabular-nums">{share.toFixed(0)}%</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${share}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.25} className="min-w-0 lg:col-span-4">
          <Card className="h-full gap-0 overflow-hidden rounded-3xl py-0 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between border-b border-border/70 px-5 py-5">
              <div>
                <CardTitle>{ui.dashboard.recentActivityTitle}</CardTitle>
                <CardDescription>Latest events across this vehicle</CardDescription>
              </div>
              <Route className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {activities.length > 0 ? (
                <div className="divide-y divide-border/70">
                  {activities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 px-5 py-3.5">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${item.color}18`, color: item.color }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium">{item.label}</p>
                            <span className="shrink-0 text-sm font-semibold tabular-nums">
                              {item.cost == null ? "" : formatMoney(item.cost, currencySymbol)}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <p className="truncate">{item.detail}</p>
                            <span className="shrink-0">{formatActivityDate(item.date)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                  <Fuel className="mb-3 h-7 w-7 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{ui.dashboard.noRecentActivity}</p>
                </div>
              )}
            </CardContent>
            <div className="border-t border-border/70 px-5 py-3">
              <Button asChild variant="ghost" size="sm" className="w-full rounded-full">
                <Link href="/dashboard/fuel">
                  Open fuel history <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </MotionWrapper>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span>
          Costs use every tracked category; efficiency uses completed fuel or charge segments.
        </span>
        <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
          <Link href={`/dashboard/vehicles/${selectedVehicle.id}`}>
            {ui.dashboard.viewFullVehicleProfile} <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </MotionWrapper>
  );
}
