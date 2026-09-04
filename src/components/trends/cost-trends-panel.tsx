"use client";

import { useMemo, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import {
  CalendarClock,
  CircleDollarSign,
  Fuel,
  Gauge,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "@/components/metric-card";
import { MotionWrapper } from "@/components/motion-wrapper";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ui } from "@/content/en/ui";
import type { VehicleWithLogs } from "@/types/database";
import {
  calculateSmartNextRefillFromHistory,
  getRefillDisplayString,
  getStatusClassName,
} from "@/utils/cadence-predictions";
import {
  buildFuelAnalytics,
  type FuelAnalyticsMode,
} from "@/utils/fuel-analytics";
import { buildChargeSegments } from "@/utils/ev-energy-analytics";
import { canChooseEnergyType } from "@/utils/energy-type";
import { getOwnershipCostSummary } from "@/utils/ownership-analytics";
import { formatMoneyCompact, formatMoneyExact } from "@/utils/formatting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";

type CostTrendsPanelProps = {
  vehicle: VehicleWithLogs;
  currencySymbol: string;
  distanceUnit: string;
};

function parseDate(value: string) {
  const date = parseISO(value.slice(0, 10));
  return isValid(date) ? date : null;
}

function getTrackedMonthCount(vehicle: VehicleWithLogs, now: Date) {
  const dates = [
    vehicle.created_at,
    ...(vehicle.fuel_logs ?? []).map((log) => log.date),
    ...(vehicle.maintenance_logs ?? []).map((log) => log.date),
    ...(vehicle.custom_logs ?? []).map((log) => log.date),
  ]
    .map(parseDate)
    .filter((date): date is Date => date !== null && date <= now)
    .sort((left, right) => left.getTime() - right.getTime());

  const first = dates[0];
  if (!first) return 1;

  return Math.min(
    12,
    Math.max(
      1,
      (now.getFullYear() - first.getFullYear()) * 12 +
        now.getMonth() -
        first.getMonth() +
        1,
    ),
  );
}

export function CostTrendsPanel({
  vehicle,
  currencySymbol,
  distanceUnit,
}: CostTrendsPanelProps) {
  const [preferredAnalysisMode, setPreferredAnalysisMode] =
    useState<FuelAnalyticsMode>("fuel");

  const now = useMemo(() => new Date(), []);
  const costSummary = useMemo(
    () => getOwnershipCostSummary(vehicle, now, 12),
    [now, vehicle],
  );
  const analytics = useMemo(
    () => buildFuelAnalytics(vehicle.fuel_logs ?? [], vehicle.baseline_odometer),
    [vehicle],
  );

  const canToggleAnalysisMode = canChooseEnergyType(vehicle.powertrain);
  const defaultAnalysisMode: FuelAnalyticsMode =
    vehicle.powertrain === "ev" ? "charge" : "fuel";
  const hasFuelLogs = analytics.fuel.logs.length > 0;
  const hasChargeLogs = analytics.charge.logs.length > 0;
  const activeAnalysisMode: FuelAnalyticsMode = canToggleAnalysisMode
    ? preferredAnalysisMode === "charge"
      ? hasChargeLogs || !hasFuelLogs
        ? "charge"
        : "fuel"
      : hasFuelLogs || !hasChargeLogs
        ? "fuel"
        : "charge"
    : defaultAnalysisMode;

  // Petrol efficiency closes on the full-tank method, which `fuel-analytics.ts`
  // already computes. A vehicle charged at home most nights rarely reaches a
  // "full charge" the same way, so `buildFuelAnalytics` deliberately never
  // closes a charge segment — see its `buildChargeStream` comment. Charging
  // cost per km instead comes from the SoC-corrected engine that segments
  // driving between charge sessions without needing a full charge at all;
  // see docs/ev-charging-redesign.md.
  const activeCostSegments = useMemo(() => {
    if (activeAnalysisMode === "fuel") {
      return analytics.fuel.closed_segments.map((segment) => ({
        date: segment.closing_log_date,
        distance: segment.distance,
        cost: segment.cost,
      }));
    }

    return buildChargeSegments(vehicle.fuel_logs ?? [])
      .filter((segment) => segment.usable)
      .map((segment) => ({
        date: segment.endDate,
        distance: segment.distance,
        cost: segment.cost,
      }));
  }, [activeAnalysisMode, analytics.fuel.closed_segments, vehicle.fuel_logs]);

  const recentSegments = activeCostSegments.slice(-4);
  const energyDistance = recentSegments.reduce(
    (total, segment) => total + segment.distance,
    0,
  );
  const energyCost = recentSegments.reduce(
    (total, segment) => total + segment.cost,
    0,
  );
  const energyCostPerDistance =
    energyDistance > 0 ? energyCost / energyDistance : null;

  const smartPrediction = calculateSmartNextRefillFromHistory(
    analytics[activeAnalysisMode].logs.map((log) => log.date),
  );
  const hasCadenceData = smartPrediction.status !== "insufficient-data";

  const trackedMonths = getTrackedMonthCount(vehicle, now);
  const recentSpend = costSummary.monthlyCosts.reduce(
    (total, month) => total + month.total,
    0,
  );
  const monthlyBaseline = recentSpend / trackedMonths;
  const firstCostMonthIndex = costSummary.monthlyCosts.findIndex(
    (month) => month.total > 0,
  );
  const visibleCostMonths =
    firstCostMonthIndex >= 0
      ? costSummary.monthlyCosts.slice(firstCostMonthIndex)
      : costSummary.monthlyCosts;
  const firstVisibleCostMonth = visibleCostMonths[0];

  const peakMonth = [...costSummary.monthlyCosts]
    .filter((month) => month.total > 0)
    .sort((left, right) => right.total - left.total)[0];
  const peakDriver = peakMonth
    ? [
        { label: ui.insights.costMix.fuel, value: peakMonth.fuel },
        {
          label: ui.insights.costMix.maintenance,
          value: peakMonth.maintenance,
        },
        { label: ui.insights.costMix.other, value: peakMonth.other },
      ].sort((left, right) => right.value - left.value)[0]
    : null;

  const energyTrendData = activeCostSegments.slice(-8).map((segment) => ({
    date: format(parseISO(segment.date.slice(0, 10)), "MMM d"),
    value: segment.distance > 0 ? segment.cost / segment.distance : null,
  }));

  const formatCurrency = (value: number) =>
    formatMoneyExact(value, currencySymbol);

  const chartConfig = {
    fuel: {
      label: ui.insights.costMix.fuel,
      color: "#f59e0b",
    },
    maintenance: {
      label: ui.insights.costMix.maintenance,
      color: "#38bdf8",
    },
    other: {
      label: ui.insights.costMix.other,
      color: "#8b5cf6",
    },
    total: {
      label: ui.insights.costMix.total,
      color: "var(--foreground)",
    },
  } satisfies ChartConfig;
  const energyTrendConfig = {
    value: {
      label: ui.insights.energyCostTrendSeries(distanceUnit),
      color: "#f59e0b",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-w-0 space-y-5">
      {canToggleAnalysisMode && (
        <Card className="rounded-3xl border-border/60 bg-card/70 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {ui.insights.analysisModeTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {ui.insights.analysisModeDescription}
              </p>
            </div>
            <Tabs
              value={activeAnalysisMode}
              onValueChange={(value) =>
                setPreferredAnalysisMode(value === "charge" ? "charge" : "fuel")
              }
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-2xl sm:w-[280px]">
                <TabsTrigger value="fuel" disabled={!hasFuelLogs}>
                  {ui.insights.analysisMode.fuel}
                </TabsTrigger>
                <TabsTrigger value="charge" disabled={!hasChargeLogs}>
                  {ui.insights.analysisMode.charge}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MotionWrapper delay={0.05} className="min-w-0">
          <MetricCard
            tone="blue"
            icon={<CircleDollarSign className="h-4 w-4" />}
            label={ui.insights.trackedSpend}
            value={formatCurrency(costSummary.totalCost)}
            hint={ui.insights.trackedSpendDescription}
          />
        </MotionWrapper>
        <MotionWrapper delay={0.1} className="min-w-0">
          <MetricCard
            tone="emerald"
            icon={<ReceiptText className="h-4 w-4" />}
            label={ui.insights.peakCostMonth}
            value={
              peakMonth
                ? formatCurrency(peakMonth.total)
                : ui.common.emptyValue
            }
            hint={
              peakMonth && peakDriver
                ? ui.insights.peakCostMonthDescription(
                    format(parseISO(`${peakMonth.key}-01`), "MMMM yyyy"),
                    peakDriver.label,
                  )
                : ui.insights.noCostDataDescription
            }
          />
        </MotionWrapper>
        <MotionWrapper delay={0.15} className="min-w-0">
          <MetricCard
            tone="violet"
            icon={<CalendarClock className="h-4 w-4" />}
            label={ui.insights.averageMonthlySpend}
            value={formatCurrency(monthlyBaseline)}
            hint={ui.insights.recentMonthlyBaselineDescription(trackedMonths)}
          />
        </MotionWrapper>
        <MotionWrapper delay={0.2} className="min-w-0">
          <MetricCard
            tone="amber"
            icon={
              activeAnalysisMode === "charge" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Fuel className="h-4 w-4" />
              )
            }
            label={ui.insights.energyCostPerDistance(activeAnalysisMode, distanceUnit)}
            value={
              energyCostPerDistance == null
                ? ui.common.emptyValue
                : formatCurrency(energyCostPerDistance)
            }
            hint={ui.insights.energyCostPerDistanceDescription(
              activeAnalysisMode,
              recentSegments.length,
            )}
          />
        </MotionWrapper>
      </div>

      <div className="min-w-0 space-y-5">
        <MotionWrapper delay={0.25} className="min-w-0">
          <Card className="min-w-0 overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>{ui.insights.expenseBreakdownTitle}</CardTitle>
                  <CardDescription className="mt-1">
                    {ui.insights.costTrendDescription}
                  </CardDescription>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {ui.insights.costHistoryRange(
                    visibleCostMonths.length,
                    firstVisibleCostMonth
                      ? format(
                          parseISO(`${firstVisibleCostMonth.key}-01`),
                          "MMM yyyy",
                        )
                      : "",
                  )}
                </p>
              </div>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden px-2 pb-3 pt-6 sm:px-6">
              {visibleCostMonths.some((month) => month.total > 0) ? (
                <>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 pb-2 text-xs text-muted-foreground sm:px-1">
                    {[
                      [ui.insights.costMix.fuel, "bg-amber-500"],
                      [ui.insights.costMix.maintenance, "bg-sky-500"],
                      [ui.insights.costMix.other, "bg-violet-500"],
                      [ui.insights.costMix.total, "bg-foreground"],
                    ].map(([label, color]) => (
                      <span key={label} className="inline-flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[270px] w-full min-w-0 max-w-full sm:h-[310px]"
                  >
                    <LineChart
                      data={visibleCostMonths}
                      margin={{ top: 16, right: 18, left: -12, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--border)"
                        strokeDasharray="3 5"
                        opacity={0.45}
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        minTickGap={18}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={54}
                        tickFormatter={(value) =>
                          formatMoneyCompact(Number(value), currencySymbol)
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: unknown) =>
                              formatCurrency(Number(value))
                            }
                          />
                        }
                      />
                      <Line
                        type="linear"
                        dataKey="fuel"
                        stroke="var(--color-fuel)"
                        strokeWidth={2.5}
                        dot={{
                          r: 3,
                          strokeWidth: 0,
                          fill: "var(--color-fuel)",
                        }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="linear"
                        dataKey="maintenance"
                        stroke="var(--color-maintenance)"
                        strokeWidth={2.5}
                        dot={{
                          r: 3,
                          strokeWidth: 0,
                          fill: "var(--color-maintenance)",
                        }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="linear"
                        dataKey="other"
                        stroke="var(--color-other)"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{
                          r: 2.5,
                          strokeWidth: 0,
                          fill: "var(--color-other)",
                        }}
                        activeDot={{ r: 4.5 }}
                      />
                      <Line
                        type="linear"
                        dataKey="total"
                        stroke="var(--color-total)"
                        strokeWidth={3}
                        dot={{
                          r: 3.5,
                          strokeWidth: 1.5,
                          fill: "var(--background)",
                          stroke: "var(--color-total)",
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </>
              ) : (
                <div className="grid min-h-[320px] place-items-center px-6 text-center">
                  <div>
                    <ReceiptText className="mx-auto h-7 w-7 text-muted-foreground" />
                    <p className="mt-3 font-medium">{ui.insights.noCostDataTitle}</p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      {ui.insights.noCostDataDescription}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <MotionWrapper delay={0.3} className="min-w-0">
            <Card className="min-w-0 overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Fuel className="h-4 w-4 text-amber-500" />
                  {ui.insights.energyCostTrendTitle(activeAnalysisMode)}
                </CardTitle>
                <CardDescription>
                  {ui.insights.energyCostTrendDescription(
                    activeAnalysisMode,
                    distanceUnit,
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="min-w-0 px-2 pb-2 sm:px-4">
                {energyTrendData.length >= 2 ? (
                  <ChartContainer
                    config={energyTrendConfig}
                    className="h-[190px] w-full min-w-0"
                  >
                    <AreaChart
                      data={energyTrendData}
                      margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="energy-cost-fill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-value)"
                            stopOpacity={0.32}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-value)"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--border)"
                        strokeDasharray="3 5"
                        opacity={0.35}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={18}
                        fontSize={11}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={50}
                        fontSize={11}
                        tickFormatter={(value) =>
                          `${currencySymbol}${Number(value).toFixed(1)}`
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: unknown) =>
                              `${formatCurrency(Number(value))} / ${distanceUnit}`
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2.5}
                        fill="url(#energy-cost-fill)"
                        dot={{ r: 3, fill: "var(--color-value)" }}
                        activeDot={{ r: 5 }}
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="grid min-h-[190px] place-items-center px-5 text-center text-sm text-muted-foreground">
                    {ui.insights.energyCostTrendEmpty(activeAnalysisMode)}
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper delay={0.35} className="min-w-0">
            <Card className="min-w-0 rounded-3xl border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4 text-amber-500" />
                  {ui.insights.cadencePredictionsTitle(activeAnalysisMode)}
                </CardTitle>
                <CardDescription>
                  {ui.insights.cadencePredictionsDescription(
                    activeAnalysisMode,
                    smartPrediction.sampleSize,
                    smartPrediction.confidence,
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasCadenceData ? (
                  <>
                    <div className="rounded-2xl bg-muted/45 p-4">
                      <p className="text-xs text-muted-foreground">
                        {ui.insights.refillFrequency(activeAnalysisMode)}
                      </p>
                      <p className="mt-1 text-lg font-semibold tabular-nums">
                        {ui.insights.everyDays(
                          Math.round(smartPrediction.intervalDays ?? 0),
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-muted/45 p-4">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {ui.insights.estimatedNextRefill(activeAnalysisMode)}
                      </p>
                      <p
                        className={`mt-1 text-lg font-semibold ${getStatusClassName(smartPrediction.status)}`}
                      >
                        {getRefillDisplayString(
                          smartPrediction,
                          activeAnalysisMode,
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    {ui.insights.insufficientDataDescription(activeAnalysisMode)}
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>
      </div>

      <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {ui.insights.costMethodNote(format(now, "MMM yyyy"))}
      </p>
    </div>
  );
}
