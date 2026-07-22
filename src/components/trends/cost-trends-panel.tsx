"use client";

import { useMemo, useState, type ElementType } from "react";
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
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { MotionWrapper } from "@/components/motion-wrapper";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { getOwnershipCostSummary } from "@/utils/ownership-analytics";
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

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
  accent?: "primary" | "emerald" | "amber" | "violet";
};

const accentStyles = {
  primary: "bg-primary/10 text-primary ring-primary/15",
  emerald: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/15",
  amber: "bg-amber-500/10 text-amber-500 ring-amber-500/15",
  violet: "bg-violet-500/10 text-violet-500 ring-violet-500/15",
};

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "primary",
}: MetricCardProps) {
  return (
    <Card className="h-full min-w-0 rounded-3xl border-border/60 bg-card/80 shadow-sm">
      <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl ring-1 ${accentStyles[accent]}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {detail}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

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

  const canToggleAnalysisMode =
    vehicle.powertrain === "phev" || vehicle.powertrain === "rex";
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

  const activeSegments = analytics[activeAnalysisMode].closed_segments;
  const recentSegments = activeSegments.slice(-4);
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

  const energyTrendData = activeSegments.slice(-8).map((segment) => ({
    date: format(parseISO(segment.closing_log_date.slice(0, 10)), "MMM d"),
    value: segment.distance > 0 ? segment.cost / segment.distance : null,
  }));

  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const compactCurrency = new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const formatCurrency = (value: number) =>
    `${currencySymbol}${numberFormat.format(value)}`;

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
      color: "#e2e8f0",
    },
  } satisfies ChartConfig;
  const energyTrendConfig = {
    value: {
      label: ui.insights.energyCostTrendSeries,
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
            label={ui.insights.trackedSpend}
            value={formatCurrency(costSummary.totalCost)}
            detail={ui.insights.trackedSpendDescription}
            icon={CircleDollarSign}
          />
        </MotionWrapper>
        <MotionWrapper delay={0.1} className="min-w-0">
          <MetricCard
            label={ui.insights.peakCostMonth}
            value={
              peakMonth
                ? formatCurrency(peakMonth.total)
                : ui.common.emptyValue
            }
            detail={
              peakMonth && peakDriver
                ? ui.insights.peakCostMonthDescription(
                    format(parseISO(`${peakMonth.key}-01`), "MMMM yyyy"),
                    peakDriver.label,
                  )
                : ui.insights.noCostDataDescription
            }
            icon={ReceiptText}
            accent="emerald"
          />
        </MotionWrapper>
        <MotionWrapper delay={0.15} className="min-w-0">
          <MetricCard
            label={ui.insights.averageMonthlySpend}
            value={formatCurrency(monthlyBaseline)}
            detail={ui.insights.recentMonthlyBaselineDescription(trackedMonths)}
            icon={CalendarClock}
            accent="violet"
          />
        </MotionWrapper>
        <MotionWrapper delay={0.2} className="min-w-0">
          <MetricCard
            label={ui.insights.energyCostPerDistance(activeAnalysisMode, distanceUnit)}
            value={
              energyCostPerDistance == null
                ? ui.common.emptyValue
                : formatCurrency(energyCostPerDistance)
            }
            detail={ui.insights.energyCostPerDistanceDescription(
              activeAnalysisMode,
              recentSegments.length,
            )}
            icon={activeAnalysisMode === "charge" ? Sparkles : Fuel}
            accent="amber"
          />
        </MotionWrapper>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-12">
        <MotionWrapper delay={0.25} className="min-w-0 xl:col-span-8">
          <Card className="h-full min-w-0 overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardHeader className="border-b border-border/50 pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>{ui.insights.expenseBreakdownTitle}</CardTitle>
                  <CardDescription className="mt-1">
                    {ui.insights.costTrendDescription}
                  </CardDescription>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {ui.insights.trailingTwelveMonths}
                </p>
              </div>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden px-2 pb-3 pt-6 sm:px-6">
              {costSummary.monthlyCosts.some((month) => month.total > 0) ? (
                <ChartContainer
                  config={chartConfig}
                  className="h-[320px] w-full min-w-0 max-w-full"
                >
                  <ComposedChart
                    data={costSummary.monthlyCosts}
                    margin={{ top: 16, right: 12, left: -12, bottom: 0 }}
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
                        `${currencySymbol}${compactCurrency.format(Number(value))}`
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
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="fuel"
                      stackId="cost"
                      fill="var(--color-fuel)"
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="maintenance"
                      stackId="cost"
                      fill="var(--color-maintenance)"
                    />
                    <Bar
                      dataKey="other"
                      stackId="cost"
                      fill="var(--color-other)"
                      radius={[5, 5, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="var(--color-total)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ChartContainer>
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

        <div className="grid min-w-0 gap-5 xl:col-span-4">
          <MotionWrapper delay={0.3} className="min-w-0">
            <Card className="min-w-0 overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Fuel className="h-4 w-4 text-amber-500" />
                  {ui.insights.energyCostTrendTitle(activeAnalysisMode)}
                </CardTitle>
                <CardDescription>
                  {ui.insights.energyCostTrendDescription(distanceUnit)}
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
                  {ui.insights.cadencePredictionsTitle}
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
