"use client";

import { useMemo, useState, type ElementType } from "react";
import { format, parseISO } from "date-fns";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleGauge,
  DatabaseZap,
  MapPinned,
  Minus,
  MousePointerClick,
  Route,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { MotionWrapper } from "@/components/motion-wrapper";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ui } from "@/content/en/ui";
import type { VehicleWithLogs } from "@/types/database";
import {
  buildVehicleDistanceTrends,
  type DistanceTrendMonth,
} from "@/utils/distance-trends";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";

type DistanceTrendsPanelProps = {
  vehicle: VehicleWithLogs;
  distanceUnit: string;
};

type RangeMonths = 6 | 12 | 24;

type SummaryMetricProps = {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
};

const RANGE_OPTIONS = [6, 12, 24] as const;

function SummaryMetric({
  label,
  value,
  detail,
  icon: Icon,
}: SummaryMetricProps) {
  return (
    <div className="min-w-0 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-teal-500" />
        <span>{label}</span>
      </div>
      <p className="mt-3 break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function CoverageBadge({
  coverage,
  coverageRatio,
}: Pick<DistanceTrendMonth, "coverage" | "coverageRatio">) {
  const styles =
    coverage === "full"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : coverage === "partial"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "border-border bg-muted/60 text-muted-foreground";
  const label =
    coverage === "full"
      ? ui.insights.distanceTrends.coverage.full
      : coverage === "partial"
        ? ui.insights.distanceTrends.coverage.partial(
            Math.round(coverageRatio * 100),
          )
        : ui.insights.distanceTrends.coverage.none;

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function ComparisonDirectionIcon({
  direction,
}: {
  direction: "up" | "down" | "steady" | "unavailable";
}) {
  if (direction === "up") return <ArrowUpRight className="h-4 w-4" />;
  if (direction === "down") return <ArrowDownRight className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
}

export function DistanceTrendsPanel({
  vehicle,
  distanceUnit,
}: DistanceTrendsPanelProps) {
  const [rangeMonths, setRangeMonths] = useState<RangeMonths>(12);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  const overview = useMemo(
    () =>
      buildVehicleDistanceTrends(vehicle, {
        monthCount: rangeMonths,
        endDate: now,
      }),
    [now, rangeMonths, vehicle],
  );

  const defaultMonthKey =
    [...overview.months].reverse().find((month) => month.hasData)?.key ??
    overview.months.at(-1)?.key ??
    format(now, "yyyy-MM");
  const effectiveMonthKey = overview.months.some(
    (month) => month.key === selectedMonthKey,
  )
    ? (selectedMonthKey as string)
    : defaultMonthKey;

  const trends = useMemo(
    () =>
      buildVehicleDistanceTrends(vehicle, {
        monthCount: rangeMonths,
        endDate: now,
        selectedMonthKey: effectiveMonthKey,
      }),
    [effectiveMonthKey, now, rangeMonths, vehicle],
  );

  const completedMonths = trends.months.filter(
    (month) => month.hasData && month.key !== format(now, "yyyy-MM"),
  );
  const monthsWithData = trends.months.filter((month) => month.hasData);
  const currentMonth = trends.months.at(-1);
  const typicalMonth = median(
    completedMonths.map((month) => month.totalDistance ?? 0),
  );
  const trailingDistance = monthsWithData.reduce(
    (total, month) => total + (month.totalDistance ?? 0),
    0,
  );
  const peakMonth = [...monthsWithData].sort(
    (left, right) => (right.totalDistance ?? 0) - (left.totalDistance ?? 0),
  )[0];
  const coveredDays = trends.months.reduce(
    (total, month) => total + month.coveredDays,
    0,
  );
  const availableDays = trends.months.reduce(
    (total, month) => total + month.totalDays,
    0,
  );
  const overallCoverage = availableDays > 0 ? coveredDays / availableDays : 0;

  const chartData = trends.months.map((month, index, months) => {
    const isCurrentMonth = month.key === format(now, "yyyy-MM");
    const rollingWindow = months
      .slice(Math.max(0, index - 2), index + 1)
      .filter(
        (candidate) =>
          candidate.hasData && candidate.key !== format(now, "yyyy-MM"),
      );
    const rollingAverage =
      !isCurrentMonth && rollingWindow.length >= 2
        ? rollingWindow.reduce(
            (total, candidate) => total + (candidate.totalDistance ?? 0),
            0,
          ) / rollingWindow.length
        : null;

    return {
      ...month,
      distance: month.totalDistance,
      rollingAverage,
    };
  });

  const selected = trends.selectedMonth;
  const selectedIndex = trends.months.findIndex(
    (month) => month.key === effectiveMonthKey,
  );

  const numberFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });
  const decimalFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  });
  const formatDistance = (value: number | null, decimals = false) =>
    value == null
      ? ui.common.emptyValue
      : `${decimals ? decimalFormat.format(value) : numberFormat.format(value)} ${distanceUnit}`;

  const comparisonText =
    trends.comparison.percentageChange == null
      ? ui.insights.distanceTrends.comparisonUnavailable
      : ui.insights.distanceTrends.comparison(
          Math.abs(Math.round(trends.comparison.percentageChange)),
          trends.comparison.direction,
          trends.comparison.basis,
        );

  const chartConfig = {
    distance: {
      label: ui.insights.distanceTrends.estimatedDistance,
      color: "#14b8a6",
    },
    rollingAverage: {
      label: ui.insights.distanceTrends.rollingAverage,
      color: "#a78bfa",
    },
  } satisfies ChartConfig;
  const dailyChartConfig = {
    distance: {
      label: ui.insights.distanceTrends.estimatedDailyDistance,
      color: "#14b8a6",
    },
  } satisfies ChartConfig;

  const openMonth = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    setDialogOpen(true);
  };

  const moveMonth = (offset: -1 | 1) => {
    const next = trends.months[selectedIndex + offset];
    if (next) setSelectedMonthKey(next.key);
  };

  return (
    <div className="min-w-0 space-y-5">
      <MotionWrapper delay={0.05}>
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
          <div className="grid divide-y divide-border/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
            <SummaryMetric
              label={ui.insights.distanceTrends.currentMonth}
              value={formatDistance(currentMonth?.totalDistance ?? null)}
              detail={
                currentMonth?.hasData
                  ? ui.insights.distanceTrends.estimatedThrough(
                      format(now, "d MMM"),
                    )
                  : ui.insights.distanceTrends.noCurrentCoverage
              }
              icon={CalendarDays}
            />
            <SummaryMetric
              label={ui.insights.distanceTrends.typicalMonth}
              value={formatDistance(typicalMonth)}
              detail={ui.insights.distanceTrends.medianAcross(
                completedMonths.length,
              )}
              icon={CircleGauge}
            />
            <SummaryMetric
              label={ui.insights.distanceTrends.trailingTotal(rangeMonths)}
              value={formatDistance(
                monthsWithData.length > 0 ? trailingDistance : null,
              )}
              detail={ui.insights.distanceTrends.basedOnCoveredMonths(
                monthsWithData.length,
              )}
              icon={Route}
            />
            <SummaryMetric
              label={ui.insights.distanceTrends.busiestMonth}
              value={formatDistance(peakMonth?.totalDistance ?? null)}
              detail={
                peakMonth
                  ? ui.insights.distanceTrends.busiestMonthDescription(
                      format(parseISO(`${peakMonth.key}-01`), "MMMM yyyy"),
                    )
                  : ui.insights.distanceTrends.notEnoughEvidence
              }
              icon={MapPinned}
            />
          </div>
        </Card>
      </MotionWrapper>

      <MotionWrapper delay={0.1} className="min-w-0">
        <Card className="min-w-0 overflow-hidden rounded-3xl border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="border-b border-border/50 pb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{ui.insights.distanceTrends.chartTitle}</CardTitle>
                  <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                    {ui.insights.distanceTrends.estimatedBadge}
                  </span>
                </div>
                <CardDescription className="mt-1 max-w-2xl">
                  {ui.insights.distanceTrends.chartDescription}
                </CardDescription>
              </div>
              <div
                className="grid w-full grid-cols-3 rounded-2xl border border-border/60 bg-muted/45 p-1 sm:w-[230px]"
                aria-label={ui.insights.distanceTrends.rangeLabel}
              >
                {RANGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      rangeMonths === option
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-pressed={rangeMonths === option}
                    onClick={() => setRangeMonths(option)}
                  >
                    {option}M
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden px-2 pb-5 pt-6 sm:px-6">
            {monthsWithData.length > 0 ? (
              <>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full min-w-0 max-w-full sm:h-[360px]"
                >
                  <AreaChart
                    data={chartData}
                    margin={{ top: 16, right: 12, left: -12, bottom: 0 }}
                    onClick={(state) => {
                      const month = state?.activePayload?.[0]?.payload as
                        | DistanceTrendMonth
                        | undefined;
                      if (month?.key) openMonth(month.key);
                    }}
                    className="cursor-pointer"
                  >
                    <defs>
                      <linearGradient
                        id="monthly-distance-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-distance)"
                          stopOpacity={0.36}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-distance)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="3 5"
                      opacity={0.4}
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      minTickGap={20}
                      fontSize={11}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={52}
                      fontSize={11}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat(undefined, {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(Number(value))
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value: unknown, name: unknown) => [
                            formatDistance(Number(value)),
                            name === "rollingAverage"
                              ? ui.insights.distanceTrends.rollingAverage
                              : ui.insights.distanceTrends.estimatedDistance,
                          ]}
                        />
                      }
                    />
                    <ReferenceLine
                      x={
                        trends.months.find(
                          (month) => month.key === effectiveMonthKey,
                        )?.label
                      }
                      stroke="var(--foreground)"
                      strokeDasharray="3 4"
                      strokeOpacity={0.28}
                    />
                    <Area
                      type="monotone"
                      dataKey="distance"
                      stroke="var(--color-distance)"
                      strokeWidth={3}
                      fill="url(#monthly-distance-fill)"
                      connectNulls={false}
                      dot={{
                        r: 3.5,
                        fill: "var(--background)",
                        stroke: "var(--color-distance)",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rollingAverage"
                      stroke="var(--color-rollingAverage)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ChartContainer>

                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1" aria-label={ui.insights.distanceTrends.monthPickerLabel}>
                  {trends.months.map((month) => (
                    <button
                      key={month.key}
                      type="button"
                      aria-pressed={month.key === effectiveMonthKey}
                      className={`min-h-11 shrink-0 rounded-xl border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        month.key === effectiveMonthKey
                          ? "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                          : "border-border/60 bg-background/50 text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => openMonth(month.key)}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
                  <MousePointerClick className="h-3.5 w-3.5 text-teal-500" />
                  {ui.insights.distanceTrends.clickHint}
                </p>
              </>
            ) : (
              <div className="grid min-h-[360px] place-items-center px-6 text-center">
                <div>
                  <Route className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-4 text-lg font-semibold">
                    {ui.insights.distanceInsufficientDataTitle}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {ui.insights.distanceTrends.noChartDescription}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </MotionWrapper>

      <div className="grid gap-4 md:grid-cols-3">
        <MotionWrapper delay={0.15} className="min-w-0">
          <Card className="h-full rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {ui.insights.distanceTrends.paceTitle}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {format(parseISO(`${selected.key}-01`), "MMMM yyyy")}
                  </p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-teal-500/10 text-teal-500">
                  <ComparisonDirectionIcon
                    direction={trends.comparison.direction}
                  />
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {comparisonText}
              </p>
              <button
                type="button"
                className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400"
                onClick={() => setDialogOpen(true)}
              >
                {ui.insights.distanceTrends.openDailyView} →
              </button>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.2} className="min-w-0">
          <Card className="h-full rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {ui.insights.distanceTrends.coverageTitle}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">
                    {Math.round(overallCoverage * 100)}%
                  </p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-violet-500/10 text-violet-500">
                  <DatabaseZap className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {ui.insights.distanceTrends.coverageDescription(
                  coveredDays,
                  availableDays,
                )}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.25} className="min-w-0">
          <Card className="h-full rounded-3xl border-border/60 bg-card/80 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {ui.insights.distanceTrends.evidenceTitle}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">
                    {trends.dataQuality.usableReadingDays}
                  </p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sky-500/10 text-sky-500">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {ui.insights.distanceTrends.evidenceDescription(
                  trends.dataQuality.fuelObservations,
                  trends.dataQuality.maintenanceObservations,
                )}
              </p>
              {trends.dataQuality.discardedDecreasingReadings > 0 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {ui.insights.distanceTrends.decreasingReadings(
                    trends.dataQuality.discardedDecreasingReadings,
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="min-w-0 gap-5 sm:max-w-4xl">
          <DialogHeader className="pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl sm:text-2xl">
                {ui.insights.distanceTrends.detailTitle(
                  format(parseISO(`${selected.key}-01`), "MMMM yyyy"),
                )}
              </DialogTitle>
              <CoverageBadge
                coverage={selected.coverage}
                coverageRatio={selected.coverageRatio}
              />
            </div>
            <DialogDescription className="max-w-2xl leading-relaxed">
              {ui.insights.distanceTrends.detailDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui.insights.distanceTrends.previousMonth}
              disabled={selectedIndex <= 0}
              onClick={() => moveMonth(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {ui.insights.distanceTrends.previousMonth}
              </span>
            </Button>
            <p className="text-xs font-medium text-muted-foreground">
              {selected.label}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={ui.insights.distanceTrends.nextMonth}
              disabled={selectedIndex < 0 || selectedIndex >= trends.months.length - 1}
              onClick={() => moveMonth(1)}
            >
              <span className="hidden sm:inline">
                {ui.insights.distanceTrends.nextMonth}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl bg-muted/45 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.totalDistance}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatDistance(selected.totalDistance)}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/45 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.previousPeriod}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatDistance(trends.comparison.previousDistance)}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/45 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.dailyAverage}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatDistance(
                  selected.kpis.averageCoveredDayDistance,
                  true,
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/45 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.evidenceCoverage}
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {Math.round(selected.coverageRatio * 100)}%
              </p>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-3 sm:p-5">
            <div className="mb-4">
              <p className="font-semibold">
                {ui.insights.distanceTrends.dailyTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {ui.insights.distanceTrends.dailyDescription}
              </p>
            </div>
            {selected.hasData ? (
              <ChartContainer
                config={dailyChartConfig}
                className="h-[260px] w-full min-w-0 sm:h-[300px]"
              >
                <AreaChart
                  data={selected.dailyPoints}
                  margin={{ top: 12, right: 10, left: -14, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="daily-distance-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-distance)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-distance)"
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
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={18}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={46}
                    fontSize={11}
                    tickFormatter={(value) => decimalFormat.format(Number(value))}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) => {
                          const point = payload?.[0]?.payload as
                            | { label?: string; interpolationSpanDays?: number }
                            | undefined;
                          return point?.label ?? "";
                        }}
                        formatter={(value: unknown) =>
                          formatDistance(Number(value), true)
                        }
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="distance"
                    stroke="var(--color-distance)"
                    strokeWidth={2.5}
                    fill="url(#daily-distance-fill)"
                    connectNulls={false}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="grid min-h-[260px] place-items-center px-5 text-center">
                <div>
                  <CalendarDays className="mx-auto h-7 w-7 text-muted-foreground" />
                  <p className="mt-3 font-medium">
                    {ui.insights.distanceTrends.noDailyTitle}
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {ui.insights.distanceTrends.noDailyDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.peakEstimatedDay}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selected.kpis.peakDay
                  ? `${selected.kpis.peakDay.label} · ${formatDistance(selected.kpis.peakDay.distance, true)}`
                  : ui.common.emptyValue}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.readingDays}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selected.readingCount}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">
                {ui.insights.distanceTrends.interpolationSpan}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {selected.kpis.largestInterpolationSpanDays == null
                  ? ui.common.emptyValue
                  : ui.insights.distanceTrends.days(
                      selected.kpis.largestInterpolationSpanDays,
                    )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-500/15 bg-teal-500/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-teal-500" />
              {ui.insights.distanceTrends.methodTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {ui.insights.distanceTrends.methodDescription}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
