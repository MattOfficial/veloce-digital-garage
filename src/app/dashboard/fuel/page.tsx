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
  Fuel,
  DollarSign,
  Activity,
  Settings2,
  Pencil,
  Trash2,
} from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FuelLogModal } from "@/components/fuel-log-modal";
import { FuelEditModal } from "@/components/fuel-edit-modal";
import { FuelDeleteDialog } from "@/components/fuel-delete-dialog";
import { PageHeader } from "@/components/page-header";
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
import { Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  Tabs,
  TabsList,
  TabsTrigger } from "@veloce/ui";;

export type FuelEfficiencyUnit = "km/L" | "L/100km" | "MPG (US)" | "MPG (UK)";
const METRIC_OPTIONS: readonly FuelEfficiencyUnit[] = ui.fuel.metricOptions;

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

function convertFuelEfficiency(
  distance: number,
  volume: number,
  targetMetric: FuelEfficiencyUnit,
  distanceUnit: "km" | "miles",
  volumeUnit: string,
): number {
  if (distance <= 0 || volume <= 0) {
    return 0;
  }

  let distanceKm = distance;
  if (distanceUnit === "miles") {
    distanceKm = distance * 1.60934;
  }

  let volumeLiters = volume;
  if (volumeUnit === "Gallons") {
    volumeLiters = volume * 3.78541;
  } else if (volumeUnit.includes("UK")) {
    volumeLiters = volume * 4.54609;
  }

  switch (targetMetric) {
    case "km/L":
      return distanceKm / volumeLiters;
    case "L/100km":
      return (volumeLiters / distanceKm) * 100;
    case "MPG (US)":
      return (distanceKm * 0.621371) / (volumeLiters * 0.264172);
    case "MPG (UK)":
      return (distanceKm * 0.621371) / (volumeLiters * 0.219969);
    default:
      return 0;
  }
}

function convertChargeEfficiency(distance: number, energy: number): number {
  if (distance <= 0 || energy <= 0) {
    return 0;
  }

  return distance / energy;
}

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatHistoryDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
  const defaultMetric =
    profile.distanceUnit === "km" && volumeUnit.includes("Liter")
      ? "km/L"
      : volumeUnit.includes("UK")
        ? "MPG (UK)"
        : "MPG (US)";
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
      ? convertChargeEfficiency(totalSegmentDistance, totalSegmentVolume)
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

  const efficiencyTrendData = activeStream.closed_segments.map((segment) => ({
    date: formatDateLabel(segment.closing_log_date),
    rawDate: segment.closing_log_date,
    efficiency: Number(
      (activeAnalysisMode === "charge"
        ? convertChargeEfficiency(segment.distance, segment.volume)
        : convertFuelEfficiency(
            segment.distance,
            segment.volume,
            activeMetric,
            profile.distanceUnit,
            volumeUnit,
          )
      ).toFixed(2),
    ),
  }));

  const costVsVolumeData = activeStream.logs.map((log) => ({
    date: formatDateLabel(log.date),
    rawDate: log.date,
    cost: Number(log.total_cost.toFixed(2)),
    volume: Number(log.fuel_volume.toFixed(2)),
  }));

  const rangeTrendData = analytics.charge.logs
    .filter((log) => log.estimated_range != null)
    .map((log) => ({
      date: formatDateLabel(log.date),
      rawDate: log.date,
      range: Number(log.estimated_range),
    }));

  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatCurrency = (value: number) =>
    `${profile.currency || "$"}${numberFormat.format(value)}`;

  const getLogEfficiencyDisplay = (log: DerivedFuelLog) => {
    if (log.fill_type === "partial" || log.pending_full) {
      return {
        text: ui.fuel.efficiencyStates.pending,
        className: "text-muted-foreground",
      };
    }

    if (log.segment_distance == null || log.segment_volume == null) {
      return {
        text: ui.fuel.efficiencyStates.unavailable,
        className: "text-muted-foreground",
      };
    }

    const value =
      log.energy_type === "charge"
        ? convertChargeEfficiency(log.segment_distance, log.segment_volume)
        : convertFuelEfficiency(
            log.segment_distance,
            log.segment_volume,
            activeMetric,
            profile.distanceUnit,
            volumeUnit,
          );
    const unit = log.energy_type === "charge" ? chargeMetricUnit : activeMetric;

    return {
      text: `${value.toFixed(2)} ${unit}`,
      className: "text-emerald-600 dark:text-emerald-400 font-semibold",
    };
  };

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
            onValueChange={(value) =>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MotionWrapper delay={0.1}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.averageEfficiency}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    {activeAnalysisMode === "fuel" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none hover:bg-white/10 p-1 rounded-md transition-colors">
                          <Settings2 className="h-4 w-4 text-muted-foreground hover:text-white" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border border-white/10 bg-veloce-bg backdrop-blur-xl shadow-2xl"
                        >
                          {METRIC_OPTIONS.map((metric) => (
                            <DropdownMenuItem
                              key={metric}
                              onClick={() => setSelectedMetric(metric)}
                              className={`cursor-pointer focus:bg-white/10 ${activeMetric === metric ? "font-bold bg-white/5" : ""}`}
                            >
                              {metric}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-md">
                    {averageEfficiency > 0
                      ? averageEfficiency.toFixed(2)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {efficiencyUnit}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.2}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.costPerDistance(profile.distanceUnit)}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-rose-500 shadow-rose-500/20 drop-shadow-md">
                    {averageCostPerDistance > 0
                      ? formatCurrency(averageCostPerDistance)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.fuel.averageRunningCost}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.3} className="md:col-span-2 lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.fuel.totalLogs}
                  </CardTitle>
                  <Fuel className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-blue-500 shadow-blue-500/20 drop-shadow-md">
                    {activeStream.logs.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.fuel.logSessionsRecorded(activeAnalysisMode)}
                  </p>
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
                          stroke="#ffffff20"
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#e2e8f0", fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#e2e8f0", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "1rem",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(17, 24, 39, 0.8)",
                            backdropFilter: "blur(10px)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="efficiency"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "#10b981",
                            strokeWidth: 2,
                            stroke: "#030712",
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

            {costVsVolumeData.length > 0 && (
              <MotionWrapper delay={0.5}>
                <Card className="h-full overflow-hidden">
                  <CardHeader className="border-b border-white/5">
                    <CardTitle>
                      {ui.fuel.costVsVolumeTitle(activeAnalysisMode)}
                    </CardTitle>
                    <CardDescription>
                      {ui.fuel.costVsVolumeDescription(activeAnalysisMode)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={costVsVolumeData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#88888833"
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "1rem",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cost"
                          stackId="1"
                          stroke="#f43f5e"
                          fill="#f43f5e"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          name={`Cost (${profile.currency})`}
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
                        stroke="#ffffff20"
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#e2e8f0", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#e2e8f0", fontSize: 12 }}
                        domain={["dataMin - 10", "dataMax + 10"]}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "1rem",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(17, 24, 39, 0.8)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="range"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#3b82f6",
                          strokeWidth: 2,
                          stroke: "#030712",
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

          <Card className="rounded-[2rem] shadow-sm overflow-hidden border">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle>{ui.fuel.fillUpHistoryTitle}</CardTitle>
              <CardDescription>
                {ui.fuel.fillUpHistoryDescription}
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/10 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      {ui.fuel.columns.date}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {ui.fuel.columns.energyType}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {ui.fuel.columns.fillType}
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      {ui.fuel.columns.odometer}
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      {ui.fuel.columns.volume}
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      {ui.fuel.columns.cost}
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      {ui.fuel.columns.efficiency}
                    </th>
                    <th className="px-6 py-4 font-medium text-right">
                      {ui.fuel.columns.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allLogs.map((log) => {
                    const efficiencyDisplay = getLogEfficiencyDisplay(log);

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {formatHistoryDate(log.date)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300">
                            {ui.fuel.energyTypes[log.energy_type]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${log.fill_type === "full" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" : "bg-amber-500/10 text-amber-600 dark:text-amber-300"}`}
                          >
                            {ui.fuel.fillTypes[log.fill_type]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {log.odometer.toLocaleString()}{" "}
                          <span className="text-muted-foreground text-xs">
                            {profile.distanceUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {log.fuel_volume.toLocaleString()}{" "}
                          <span className="text-muted-foreground text-xs">
                            {log.energy_type === "charge" ? "kWh" : volumeUnit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-rose-600 dark:text-rose-400">
                          {formatCurrency(log.total_cost)}
                        </td>
                        <td
                          className={`px-6 py-4 text-right ${efficiencyDisplay.className}`}
                        >
                          {efficiencyDisplay.text}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                              onClick={() => setEditingLog(log)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
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
          </Card>
        </>
      )}

      {editingLog && (
        <FuelEditModal
          log={editingLog}
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
          logDate={formatHistoryDate(deletingLog.date)}
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
