"use client";

import { useMemo, useState } from "react";
import { useVehicleStore } from "@/store/vehicle-store";
import { useUserStore } from "@/store/user-store";
import type { FuelLog } from "@/types/database";
import {
  buildFuelAnalytics,
  type DerivedFuelLog,
  type FuelAnalyticsMode,
} from "@/utils/fuel-analytics";
import {
  FUEL_EFFICIENCY_UNITS,
  convertEvEfficiency,
  convertFuelEfficiency,
  getDefaultFuelEfficiencyUnit,
  isFuelEfficiencyUnit,
  type FuelEfficiencyUnit,
} from "@/utils/efficiency-units";
import {
  formatDayLabel,
  formatMoneyExact,
  formatTableDate,
} from "@/utils/formatting";
import { getUnitPriceSummary } from "@/utils/unit-price";

import {
  Fuel,
  DollarSign,
  Activity,
  BadgeDollarSign,
  BatteryCharging,
  Pencil,
  Receipt,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { EnergyBatteryPanel } from "@/components/ev/energy-battery-panel";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { FuelEditModal } from "@/components/fuel-edit-modal";
import { FuelDeleteDialog } from "@/components/fuel-delete-dialog";
import { PageHeader } from "@/components/page-header";
import { Pill, PillDot } from "@/components/ui/pill";
import { TablePagination } from "@/components/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@mattofficial/veloce-ui";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ui } from "@/content/en/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Button,
} from "@mattofficial/veloce-ui";

const METRIC_OPTIONS = FUEL_EFFICIENCY_UNITS;

function sortLogsDescending(
  left: {
    date: string;
    odometer: number;
    created_at: string | null;
    id: string;
  },
  right: {
    date: string;
    odometer: number;
    created_at: string | null;
    id: string;
  },
) {
  const byDate = new Date(right.date).getTime() - new Date(left.date).getTime();
  if (byDate !== 0) return byDate;

  const byOdometer = right.odometer - left.odometer;
  if (byOdometer !== 0) return byOdometer;

  const byCreatedAt = (right.created_at ?? "").localeCompare(
    left.created_at ?? "",
  );
  if (byCreatedAt !== 0) return byCreatedAt;

  return right.id.localeCompare(left.id);
}

function convertChargeEfficiency(
  distance: number,
  energy: number,
  distanceUnit: "km" | "miles",
): number | null {
  return convertEvEfficiency(
    distance,
    energy,
    distanceUnit === "miles" ? "mi/kWh" : "km/kWh",
    distanceUnit,
  );
}

export default function FuelPage() {
  const { selectedVehicleId, vehicles } = useVehicleStore();
  const { profile, getVolumeUnit } = useUserStore();

  const [selectedMetric, setSelectedMetric] =
    useState<FuelEfficiencyUnit | null>(null);
  const [preferredAnalysisMode, setPreferredAnalysisMode] =
    useState<FuelAnalyticsMode>("fuel");
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);
  const [deletingLog, setDeletingLog] = useState<{
    id: string;
    vehicle_id: string;
    date: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  const analytics = useMemo(
    () =>
      buildFuelAnalytics(
        selectedVehicle?.fuel_logs ?? [],
        selectedVehicle?.baseline_odometer ?? 0,
      ),
    [selectedVehicle?.baseline_odometer, selectedVehicle?.fuel_logs],
  );

  const selectedPowertrain = selectedVehicle?.powertrain;
  const canToggleAnalysisMode =
    selectedPowertrain === "phev" || selectedPowertrain === "rex";
  const defaultAnalysisMode: FuelAnalyticsMode =
    selectedPowertrain === "ev" ? "charge" : "fuel";
  const hasFuelLogs = analytics.fuel.logs.length > 0;
  const hasChargeLogs = analytics.charge.logs.length > 0;

  const activeAnalysisMode: FuelAnalyticsMode = canToggleAnalysisMode
    ? (preferredAnalysisMode === "fuel" && hasFuelLogs) || !hasChargeLogs
      ? "fuel"
      : "charge"
    : defaultAnalysisMode;

  const activeStream = analytics[activeAnalysisMode];
  const allLogs = useMemo(
    () =>
      [...analytics.fuel.logs, ...analytics.charge.logs].sort(
        sortLogsDescending,
      ),
    [analytics.charge.logs, analytics.fuel.logs],
  );
  const hasLogs = allLogs.length > 0;

  const totalPages = Math.max(1, Math.ceil(allLogs.length / pageSize));
  const safePage = Math.min(page, totalPages);
  
  const paginatedLogs = useMemo(() => {
    return allLogs.slice((safePage - 1) * pageSize, safePage * pageSize);
  }, [allLogs, safePage, pageSize]);

  if (!selectedVehicle) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {ui.fuel.noVehicleSelectedTitle}
          </h2>
          <p className="text-muted-foreground">
            {ui.fuel.noVehicleSelectedDescription}
          </p>
        </div>
      </div>
    );
  }

  const volumeUnit = getVolumeUnit();
  const defaultMetric = getDefaultFuelEfficiencyUnit(
    profile.distanceUnit,
    volumeUnit,
  );
  const activeMetric = selectedMetric ?? defaultMetric;
  const chargeMetricUnit =
    profile.distanceUnit === "miles"
      ? ui.fuel.chargeMetricUnits.miles
      : ui.fuel.chargeMetricUnits.km;

  const totalSegmentDistance = activeStream.closed_segments.reduce(
    (sum, segment) => sum + segment.distance,
    0,
  );
  const totalSegmentVolume = activeStream.closed_segments.reduce(
    (sum, segment) => sum + segment.volume,
    0,
  );
  const totalSegmentCost = activeStream.closed_segments.reduce(
    (sum, segment) => sum + segment.cost,
    0,
  );

  const averageEfficiency =
    activeAnalysisMode === "charge"
      ? convertChargeEfficiency(totalSegmentDistance, totalSegmentVolume, profile.distanceUnit)
      : convertFuelEfficiency(
          totalSegmentDistance,
          totalSegmentVolume,
          activeMetric,
          profile.distanceUnit,
          volumeUnit,
        );
  const averageCostPerDistance =
    totalSegmentDistance > 0 ? totalSegmentCost / totalSegmentDistance : 0;
  const efficiencyUnit =
    activeAnalysisMode === "charge" ? chargeMetricUnit : activeMetric;

  const efficiencyTrendData = activeStream.closed_segments.map((segment) => {
    const efficiency =
      activeAnalysisMode === "charge"
        ? convertChargeEfficiency(segment.distance, segment.volume, profile.distanceUnit)
        : convertFuelEfficiency(
            segment.distance,
            segment.volume,
            activeMetric,
            profile.distanceUnit,
            volumeUnit,
          );

    return {
      date: formatDayLabel(segment.closing_log_date),
      rawDate: segment.closing_log_date,
      efficiency:
        efficiency == null ? null : Number(efficiency.toFixed(2)),
    };
  });

  const unitPriceTrendData = activeStream.logs
    .filter(
      (log) =>
        Number.isFinite(log.total_cost) &&
        Number.isFinite(log.fuel_volume) &&
        log.total_cost >= 0 &&
        log.fuel_volume > 0,
    )
    .map((log) => ({
      date: formatDayLabel(log.date),
      rawDate: log.date,
      rate: Number((log.total_cost / log.fuel_volume).toFixed(2)),
    }));

  const rangeTrendData = analytics.charge.logs
    .filter((log) => log.estimated_range != null)
    .map((log) => ({
      date: formatDayLabel(log.date),
      rawDate: log.date,
      range: Number(log.estimated_range),
    }));

  const unitPriceSummary = getUnitPriceSummary(activeStream.logs);
  const unitPriceTrendClass = unitPriceSummary.direction === "up"
    ? "text-rose-600 dark:text-rose-400"
    : unitPriceSummary.direction === "down"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-muted-foreground";
  const unitPriceUnit =
    activeAnalysisMode === "charge"
      ? "kWh"
      : volumeUnit === "Liters"
        ? "L"
        : volumeUnit === "Gallons (UK)"
          ? "UK gal"
          : "US gal";

  /** `value` is null for the pending and unavailable states, which render plainly. */
  const getLogEfficiencyDisplay = (
    log: DerivedFuelLog,
  ): { text: string; value: number | null } => {
    if (log.fill_type === "partial" || log.pending_full) {
      return { text: ui.fuel.efficiencyStates.pending, value: null };
    }

    if (log.segment_distance == null || log.segment_volume == null) {
      return { text: ui.fuel.efficiencyStates.unavailable, value: null };
    }

    const value =
      log.energy_type === "charge"
        ? convertChargeEfficiency(log.segment_distance, log.segment_volume, profile.distanceUnit)
        : convertFuelEfficiency(
            log.segment_distance,
            log.segment_volume,
            activeMetric,
            profile.distanceUnit,
            volumeUnit,
          );
    const unit = log.energy_type === "charge" ? chargeMetricUnit : activeMetric;

    if (value == null) {
      return { text: ui.fuel.efficiencyStates.unavailable, value: null };
    }

    return { text: `${value.toFixed(2)} ${unit}`, value };
  };

  // A pure EV gets a different page entirely. Tank segments and the full-tank
  // method do not apply to a vehicle that is charged at home most nights —
  // see docs/ev-redesign.md.
  if (selectedPowertrain === "ev") {
    return (
      <MotionWrapper className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          title={ui.ev.pageTitle}
          description={ui.ev.pageDescription(
            `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
          )}
          icon={BatteryCharging}
        />
        <EnergyBatteryPanel vehicle={selectedVehicle} />
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title={ui.fuel.pageTitle}
        description={ui.fuel.pageDescription(
          `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        )}
        icon={Fuel}
      >
        <FuelLogModal vehicle={selectedVehicle} />
      </PageHeader>

      {canToggleAnalysisMode && (
        <div className="flex justify-end">
          <Tabs
            value={activeAnalysisMode}
            onValueChange={(value: string) =>
              setPreferredAnalysisMode(value === "charge" ? "charge" : "fuel")
            }
          >
            <TabsList className="grid w-full grid-cols-2 rounded-xl md:w-[280px]">
              <TabsTrigger value="fuel" disabled={!hasFuelLogs}>
                {ui.fuel.analysisMode.fuel}
              </TabsTrigger>
              <TabsTrigger value="charge" disabled={!hasChargeLogs}>
                {ui.fuel.analysisMode.charge}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {!hasLogs ? (
        <MotionWrapper delay={0.1}>
          <Card className="bg-white/5 border-dashed border-2 border-white/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Fuel className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold tracking-tight">
                {ui.fuel.noFuelDataYetTitle}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                {ui.fuel.noFuelDataYetDescription}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-auto-rows-[1fr] items-stretch">
            <MotionWrapper delay={0.1} className="h-full">
              <Card className="relative h-full gap-4 overflow-hidden rounded-3xl py-5 shadow-sm">
                {/* A wash of the metric's own colour, so the three summary
                    cards are distinguishable before you read them. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent"
                />
                <CardHeader className="relative z-10 flex flex-row items-center justify-between px-5 pb-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.averageEfficiency}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                      <Activity aria-hidden="true" className="h-4 w-4" />
                    </span>
                    {activeAnalysisMode === "fuel" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg border border-border/60 bg-background/70 px-2.5 text-xs font-semibold shadow-sm"
                            aria-label={ui.fuel.changeEfficiencyUnit(activeMetric)}
                          >
                            {activeMetric}
                            <ChevronDown
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-muted-foreground"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border border-white/10 bg-veloce-bg backdrop-blur-xl shadow-2xl"
                        >
                          <DropdownMenuRadioGroup
                            value={activeMetric}
                            onValueChange={(metric) => {
                              if (isFuelEfficiencyUnit(metric)) {
                                setSelectedMetric(metric);
                              }
                            }}
                          >
                            {METRIC_OPTIONS.map((metric) => (
                              <DropdownMenuRadioItem
                                key={metric}
                                value={metric}
                                className="cursor-pointer focus:bg-white/10"
                              >
                                {metric}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 px-5">
                  <div className="text-3xl font-semibold tracking-tight tabular-nums text-emerald-700 dark:text-emerald-300">
                    {averageEfficiency != null
                      ? averageEfficiency.toFixed(2)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {efficiencyUnit}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.2} className="h-full">
              <Card className="relative h-full gap-4 overflow-hidden rounded-3xl py-5 shadow-sm">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-rose-500/10 to-transparent"
                />
                <CardHeader className="relative z-10 flex flex-row items-center justify-between px-5 pb-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.costPerDistance(profile.distanceUnit)}
                  </CardTitle>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </CardHeader>
                <CardContent className="relative z-10 px-5">
                  <div className="text-3xl font-semibold tracking-tight tabular-nums text-rose-700 dark:text-rose-300">
                    {averageCostPerDistance > 0
                      ? formatMoneyExact(averageCostPerDistance, profile.currency)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.fuel.averageRunningCost}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper
              delay={0.3}
              className="md:col-span-2 lg:col-span-1 h-full"
            >
              <Card className="relative h-full gap-4 overflow-hidden rounded-3xl py-5 shadow-sm">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent"
                />
                <CardHeader className="relative z-10 flex flex-row items-center justify-between px-5 pb-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.latestUnitPrice(activeAnalysisMode)}
                  </CardTitle>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
                    <BadgeDollarSign className="h-4 w-4" />
                  </span>
                </CardHeader>
                <CardContent className="relative z-10 px-5">
                  <div className="text-3xl font-semibold tracking-tight tabular-nums text-blue-700 dark:text-blue-300">
                    {unitPriceSummary.latest == null
                      ? "--"
                      : formatMoneyExact(unitPriceSummary.latest, profile.currency)}
                  </div>
                  {unitPriceSummary.latest == null ? (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {ui.fuel.unitPriceUnavailable}
                    </p>
                  ) : (
                    <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs font-medium">
                      <span className="text-muted-foreground">
                        {ui.fuel.perUnit(unitPriceUnit)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-muted-foreground"
                      >
                        ·
                      </span>
                      <span className={unitPriceTrendClass}>
                        {unitPriceSummary.previous == null
                          ? ui.fuel.noPreviousUnitPrice
                          : unitPriceSummary.changePercent == null
                            ? ui.fuel.unitPriceUpFromFreeSession
                            : ui.fuel.unitPriceComparison(
                                unitPriceSummary.changePercent,
                              )}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {efficiencyTrendData.length > 0 && (
              <MotionWrapper delay={0.4}>
                <Card className="h-full overflow-hidden">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle>{ui.fuel.efficiencyTrendTitle}</CardTitle>
                    <CardDescription>
                      {ui.fuel.efficiencyTrendDescription(activeAnalysisMode)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] w-full pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={efficiencyTrendData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--border)"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "1rem",
                            border: "1px solid var(--border)",
                            background: "var(--card)",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="efficiency"
                          stroke="var(--chart-2)"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "var(--chart-2)",
                            strokeWidth: 2,
                            stroke: "var(--card)",
                          }}
                          activeDot={{ r: 6 }}
                          name={efficiencyUnit}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </MotionWrapper>
            )}

            {unitPriceTrendData.length > 0 && (
              <MotionWrapper delay={0.5}>
                <Card className="h-full overflow-hidden rounded-3xl shadow-sm">
                  <CardHeader className="border-b border-border/70">
                    <CardTitle>
                      {ui.fuel.unitPriceTrendTitle(activeAnalysisMode)}
                    </CardTitle>
                    <CardDescription>
                      {ui.fuel.unitPriceTrendDescription(activeAnalysisMode)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={unitPriceTrendData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--border)"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "1rem",
                            border: "1px solid var(--border)",
                            background: "var(--card)",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="var(--chart-5)"
                          fill="var(--chart-5)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name={`${profile.currency}/${unitPriceUnit}`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </MotionWrapper>
            )}
          </div>

          {activeAnalysisMode === "charge" && rangeTrendData.length > 0 && (
            <MotionWrapper delay={0.6}>
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-white/5">
                  <CardTitle>{ui.fuel.batteryRangeTrendTitle}</CardTitle>
                  <CardDescription>
                    {ui.fuel.batteryRangeTrendDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] w-full pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={rangeTrendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        domain={["dataMin - 10", "dataMax + 10"]}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "1rem",
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="range"
                        stroke="var(--chart-1)"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "var(--chart-1)",
                          strokeWidth: 2,
                          stroke: "var(--card)",
                        }}
                        activeDot={{ r: 6 }}
                        name={ui.fuel.modal.labels.estimatedRange(
                          profile.distanceUnit,
                        )}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </MotionWrapper>
          )}

          <Card className="overflow-hidden rounded-[2rem] border shadow-sm">
            <CardHeader className="border-b bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent pb-4">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt className="h-4 w-4" />
                </span>
                {ui.fuel.fillUpHistoryTitle}
              </CardTitle>
              <CardDescription>
                {ui.fuel.fillUpHistoryDescription}
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gradient-to-r from-muted/40 via-muted/20 to-transparent text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      {ui.fuel.columns.date}
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      {ui.fuel.columns.energyType}
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      {ui.fuel.columns.fillType}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.fuel.columns.odometer}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.fuel.columns.volume}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.fuel.columns.cost}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.fuel.columns.efficiency}
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      {ui.fuel.columns.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedLogs.map((log) => {
                    const efficiencyDisplay = getLogEfficiencyDisplay(log);

                    return (
                      <tr
                        key={log.id}
                        className="group transition-colors even:bg-muted/[0.12] hover:bg-primary/[0.05] dark:even:bg-white/[0.02]"
                      >
                        {/* A colour rail keyed to the energy type: at a glance
                            you can see which rows are petrol and which are
                            charges without reading the pill. */}
                        <td className="relative px-6 py-4 font-medium tabular-nums">
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity group-hover:opacity-100 ${log.energy_type === "charge" ? "bg-blue-500" : "bg-amber-500"}`}
                          />
                          {formatTableDate(log.date)}
                        </td>
                        <td className="px-6 py-4">
                          <Pill
                            tone={log.energy_type === "charge" ? "blue" : "amber"}
                          >
                            <PillDot />
                            {ui.fuel.energyTypes[log.energy_type]}
                          </Pill>
                        </td>
                        <td className="px-6 py-4">
                          {/* Charge rows have no fill type — the concept is
                              ICE-only. */}
                          {log.fill_type == null ? (
                            <span className="text-muted-foreground">
                              {ui.common.emptyValue}
                            </span>
                          ) : (
                            <Pill
                              tone={log.fill_type === "full" ? "emerald" : "amber"}
                            >
                              {ui.fuel.fillTypes[log.fill_type]}
                            </Pill>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {log.odometer.toLocaleString()}{" "}
                          <span className="text-xs text-muted-foreground">
                            {profile.distanceUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {log.fuel_volume.toLocaleString()}{" "}
                          <span className="text-xs text-muted-foreground">
                            {log.energy_type === "charge" ? "kWh" : volumeUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold tabular-nums text-rose-700 dark:text-rose-300">
                          {formatMoneyExact(log.total_cost, profile.currency)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {efficiencyDisplay.value != null ? (
                            <Pill tone="emerald" className="tabular-nums">
                              {efficiencyDisplay.text}
                            </Pill>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {efficiencyDisplay.text}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.edit}
                              className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              onClick={() => setEditingLog(log)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={ui.common.actions.delete}
                              className="h-8 w-8 rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setDeletingLog(log)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <TablePagination
              page={safePage}
              pageSize={pageSize}
              totalItems={allLogs.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </>
      )}

      {editingLog && (
        <FuelEditModal
          log={editingLog}
          vehicle={selectedVehicle}
          open={Boolean(editingLog)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingLog(null);
            }
          }}
        />
      )}

      {deletingLog && (
        <FuelDeleteDialog
          logId={deletingLog.id}
          vehicleId={deletingLog.vehicle_id}
          logDate={formatTableDate(deletingLog.date)}
          open={Boolean(deletingLog)}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingLog(null);
            }
          }}
        />
      )}
    </MotionWrapper>
  );
}
