"use client";

import { useMemo, useState } from "react";
import { useVehicleStore } from "@/store/vehicle-store";
import { useUserStore } from "@/store/user-store";
import {
  buildFuelAnalytics,
  type FuelAnalyticsMode,
} from "@/utils/fuel-analytics";
import {
  createTrailingDayRange,
  createTrailingMonthRange,
  getVehicleDistanceSummary,
  getVehicleLifetimeDistanceSummary,
  getVehicleMonthlyDistanceRollups,
} from "@/utils/distance-analytics";
import {
  calculateSmartNextRefillFromHistory,
  getRefillDisplayString,
  getStatusClassName,
} from "@/utils/cadence-predictions";
import { getCurrencySymbol } from "@/utils/formatting";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Activity,
  BarChart2,
  CalendarClock,
  DollarSign,
  Gauge,
  Route,
  Zap,
} from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ui } from "@/content/en/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function TrendsPage() {
  const { vehicles, selectedVehicleId } = useVehicleStore();
  const { profile } = useUserStore();
  const [preferredAnalysisMode, setPreferredAnalysisMode] =
    useState<FuelAnalyticsMode>("fuel");

  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  const currencySymbol = getCurrencySymbol(profile.currency);
  const distanceUnit = profile.distanceUnit;

  const chartConfig = useMemo(
    () =>
      ({
        fuel: {
          label: `Fuel (${currencySymbol})`,
          color: "var(--chart-1)",
        },
        maintenance: {
          label: `Maintenance (${currencySymbol})`,
          color: "var(--chart-2)",
        },
        custom: {
          label: `Custom Tracker (${currencySymbol})`,
          color: "var(--chart-3)",
        },
      }) satisfies ChartConfig,
    [currencySymbol],
  );

  const distanceChartConfig = useMemo(
    () =>
      ({
        distance: {
          label: `Distance (${distanceUnit})`,
          color: "var(--chart-4)",
        },
      }) satisfies ChartConfig,
    [distanceUnit],
  );

  const {
    totalCost,
    trackedCalendarMonths,
    averageMonthlySpend,
    avgDistancePerDay,
    monthlyData,
    analytics,
    distanceLast30Days,
    distanceLast12Months,
    distanceMonthlyData,
  } = useMemo(() => {
    if (!selectedVehicle) {
      return {
        totalCost: 0,
        trackedCalendarMonths: 0,
        averageMonthlySpend: 0,
        avgDistancePerDay: 0,
        monthlyData: [] as Array<{
          month: string;
          fuel: number;
          maintenance: number;
          custom: number;
        }>,
        analytics: buildFuelAnalytics([], 0),
        distanceLast30Days: null,
        distanceLast12Months: null,
        distanceMonthlyData: [],
      };
    }

    const fuelLogs = selectedVehicle.fuel_logs ?? [];
    const maintenanceLogs = selectedVehicle.maintenance_logs ?? [];
    const customLogs = selectedVehicle.custom_logs ?? [];
    const odometerLogs = [...fuelLogs]
      .filter((log) => Number.isFinite(log.odometer))
      .sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      );
    const allLogs = [
      ...fuelLogs.map((log) => ({
        date: log.date,
        cost: log.total_cost,
        type: "fuel" as const,
      })),
      ...maintenanceLogs.map((log) => ({
        date: log.date,
        cost: log.cost || 0,
        type: "maintenance" as const,
      })),
      ...customLogs.map((log) => ({
        date: log.date,
        cost: log.cost || 0,
        type: "custom" as const,
      })),
    ].sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime(),
    );

    let cost = 0;
    const monthlyMap = new Map<
      string,
      { month: string; fuel: number; maintenance: number; custom: number }
    >();

    for (const log of allLogs) {
      cost += log.cost;

      const monthYear = new Date(log.date).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      });
      if (!monthlyMap.has(monthYear)) {
        monthlyMap.set(monthYear, {
          month: monthYear,
          fuel: 0,
          maintenance: 0,
          custom: 0,
        });
      }

      const monthBucket = monthlyMap.get(monthYear);
      if (monthBucket) {
        monthBucket[log.type] += log.cost;
      }
    }

    const firstLogDate = odometerLogs[0]
      ? new Date(odometerLogs[0].date)
      : null;
    const lastLogDate = odometerLogs[odometerLogs.length - 1]
      ? new Date(odometerLogs[odometerLogs.length - 1].date)
      : null;
    const trackingDays =
      firstLogDate && lastLogDate
        ? Math.max(
            1,
            Math.floor(
              (lastLogDate.getTime() - firstLogDate.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0;
    const firstCostLog =
      allLogs.find((log) => log.cost > 0) ?? allLogs[0] ?? null;
    const firstCostDate = firstCostLog ? new Date(firstCostLog.date) : null;
    const today = new Date();
    const calendarMonths =
      firstCostDate &&
      Number.isFinite(firstCostDate.getTime()) &&
      firstCostDate <= today
        ? Math.max(
            1,
            (today.getFullYear() - firstCostDate.getFullYear()) * 12 +
              today.getMonth() -
              firstCostDate.getMonth() +
              1,
          )
        : allLogs.length > 0
          ? 1
          : 0;
    const lifetimeDistance = getVehicleLifetimeDistanceSummary(selectedVehicle);
    const distance = lifetimeDistance.value ?? 0;
    const last30Days = getVehicleDistanceSummary(
      selectedVehicle,
      createTrailingDayRange(30),
    );
    const last12Months = getVehicleDistanceSummary(
      selectedVehicle,
      createTrailingMonthRange(12),
    );
    const monthlyDistance = getVehicleMonthlyDistanceRollups(
      selectedVehicle,
      12,
    );

    return {
      totalCost: cost,
      trackedCalendarMonths: calendarMonths,
      averageMonthlySpend: calendarMonths > 0 ? cost / calendarMonths : 0,
      avgDistancePerDay: trackingDays > 0 ? distance / trackingDays : 0,
      monthlyData: Array.from(monthlyMap.values()),
      analytics: buildFuelAnalytics(
        fuelLogs,
        selectedVehicle.baseline_odometer,
      ),
      distanceLast30Days: last30Days,
      distanceLast12Months: last12Months,
      distanceMonthlyData: monthlyDistance,
    };
  }, [selectedVehicle]);

  if (!selectedVehicle) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {ui.insights.noVehicleSelectedTitle}
          </h2>
          <p className="text-muted-foreground">
            {ui.insights.noVehicleSelectedDescription}
          </p>
        </div>
      </div>
    );
  }

  const canToggleAnalysisMode =
    selectedVehicle.powertrain === "phev" ||
    selectedVehicle.powertrain === "rex";
  const defaultAnalysisMode: FuelAnalyticsMode =
    selectedVehicle.powertrain === "ev" ? "charge" : "fuel";
  const hasFuelLogs = analytics.fuel.logs.length > 0;
  const hasChargeLogs = analytics.charge.logs.length > 0;

  const activeAnalysisMode: FuelAnalyticsMode = canToggleAnalysisMode
    ? preferredAnalysisMode === "fuel" &&
      (hasFuelLogs || !hasChargeLogs)
      ? "fuel"
      : "charge"
    : defaultAnalysisMode;

  const smartPrediction = calculateSmartNextRefillFromHistory(
    analytics[activeAnalysisMode].logs.map((log) => log.date),
  );
  const hasCadenceData = smartPrediction.status !== "insufficient-data";
  const daysBetweenRefills = smartPrediction.intervalDays ?? 0;

  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatCurrency = (value: number) =>
    `${currencySymbol}${numberFormat.format(value)}`;
  const formatDistance = (value: number) =>
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(value);
  const hasDistanceHistory = distanceMonthlyData.some(
    (item) => item.hasSufficientData,
  );

  return (
    <MotionWrapper className="mx-auto max-w-6xl space-y-8 px-0 pb-10 sm:px-4">
      <PageHeader
        title={ui.insights.pageTitle}
        description={ui.insights.pageDescription(
          `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        )}
        icon={BarChart2}
        className="mb-4"
      />

      <Tabs defaultValue="running-costs" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-full md:w-[360px]">
          <TabsTrigger value="running-costs" className="rounded-full">
            {ui.insights.tabs.runningCosts}
          </TabsTrigger>
          <TabsTrigger value="distance" className="rounded-full">
            {ui.insights.tabs.distance}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="running-costs" className="space-y-6">
          {canToggleAnalysisMode && (
            <Card className="border-white/10">
              <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {ui.insights.analysisModeTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ui.insights.analysisModeDescription}
                  </p>
                </div>
                <Tabs
                  value={activeAnalysisMode}
                  onValueChange={(value: string) =>
                    setPreferredAnalysisMode(
                      value === "charge" ? "charge" : "fuel",
                    )
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 rounded-xl md:w-[280px]">
                    <TabsTrigger
                      value="fuel"
                      disabled={!hasFuelLogs}
                    >
                      {ui.insights.analysisMode.fuel}
                    </TabsTrigger>
                    <TabsTrigger
                      value="charge"
                      disabled={!hasChargeLogs}
                    >
                      {ui.insights.analysisMode.charge}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 grid-auto-rows-[1fr] items-stretch">
            <MotionWrapper delay={0.1} className="h-full min-w-0">
              <Card className="relative h-full min-w-0 overflow-hidden rounded-3xl border-primary/20 bg-primary/10 shadow-sm">
                <div className="pointer-events-none absolute top-0 right-0 p-4 text-primary opacity-15">
                  <DollarSign className="h-24 w-24 translate-x-4 -translate-y-4" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    {ui.insights.trackedSpend}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 text-4xl font-semibold tracking-tight tabular-nums">
                    {formatCurrency(totalCost)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ui.insights.trackedSpendDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.2} className="h-full min-w-0">
              <Card className="relative h-full min-w-0 overflow-hidden rounded-3xl shadow-sm">
                <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.insights.averageMonthlySpend}
                  </CardTitle>
                  <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-baseline gap-x-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-3xl">
                    <span>{formatCurrency(averageMonthlySpend)}</span>
                    <span className="text-base font-medium text-muted-foreground">
                      / month
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ui.insights.averageMonthlySpendDescription(
                      trackedCalendarMonths,
                    )}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          </div>

          <div className="grid min-w-0 gap-6 md:grid-cols-3">
            <MotionWrapper delay={0.3} className="min-w-0 md:col-span-2">
              <Card className="h-full min-w-0 overflow-hidden rounded-3xl shadow-sm">
                <CardHeader className="border-b border-white/5">
                  <CardTitle>{ui.insights.expenseBreakdownTitle}</CardTitle>
                  <CardDescription>
                    {ui.insights.expenseBreakdownDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="min-w-0 overflow-hidden pt-6">
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[350px] w-full min-w-0 max-w-full"
                  >
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "var(--muted-foreground)" }}
                        tickFormatter={(value) => `${currencySymbol}${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        yAxisId="left"
                        dataKey="fuel"
                        stackId="a"
                        fill="var(--color-fuel)"
                        radius={[0, 0, 4, 4]}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="maintenance"
                        stackId="a"
                        fill="var(--color-maintenance)"
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="custom"
                        stackId="a"
                        fill="var(--color-custom)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.4} className="h-full min-w-0">
              <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl shadow-sm">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
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
                <CardContent className="flex-1 p-6 flex flex-col justify-center space-y-8">
                  {hasCadenceData ? (
                    <>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />{" "}
                          {ui.insights.refillFrequency(activeAnalysisMode)}
                        </div>
                        <div className="text-xl font-semibold">
                          Every {Math.round(daysBetweenRefills)} days
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {ui.insights.frequencySummary(
                            activeAnalysisMode,
                            Math.max(1, Math.round(daysBetweenRefills)),
                            Math.max(1, Math.round(daysBetweenRefills / 7)),
                          )}
                        </p>
                      </div>

                      <div className="h-px w-full bg-border/20" />

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Activity className="h-4 w-4" />{" "}
                          {ui.insights.estimatedNextRefill(activeAnalysisMode)}
                        </div>
                        <div
                          className={`text-xl font-semibold ${getStatusClassName(smartPrediction.status)}`}
                        >
                          {getRefillDisplayString(
                            smartPrediction,
                            activeAnalysisMode,
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {smartPrediction.status === "insufficient-data"
                            ? ui.insights.insufficientDataDescription(
                                activeAnalysisMode,
                              )
                            : ui.insights.nextRefillSummary(activeAnalysisMode)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-muted/10 p-6 text-center">
                      <h2 className="text-lg font-medium">
                        {ui.insights.insufficientDataTitle}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {ui.insights.insufficientDataDescription(
                          activeAnalysisMode,
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionWrapper>
          </div>
        </TabsContent>

        <TabsContent value="distance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 grid-auto-rows-[1fr] items-stretch">
            <MotionWrapper delay={0.1} className="h-full">
              <Card className="relative overflow-hidden border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-background to-background shadow-sm">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-sky-900 dark:text-sky-100">
                    {ui.insights.averageDailyDistance}
                  </CardTitle>
                  <div className="rounded-full bg-sky-500/15 p-2 text-sky-500 ring-1 ring-sky-500/20">
                    <Gauge className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-sky-950 dark:text-sky-50">
                    {Math.round(avgDistancePerDay)}{" "}
                    <span className="text-base font-medium text-sky-700/80 dark:text-sky-200/80">
                      {distanceUnit}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-sky-800/75 dark:text-sky-200/75">
                    {ui.insights.averageDailyDistanceDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.2} className="h-full">
              <Card className="relative overflow-hidden h-full border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-background to-background shadow-sm">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-teal-900 dark:text-teal-100">
                    {ui.insights.distanceLastThirtyDays}
                  </CardTitle>
                  <div className="rounded-full bg-teal-500/15 p-2 text-teal-500 ring-1 ring-teal-500/20">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-teal-950 dark:text-teal-50">
                    {distanceLast30Days?.hasSufficientData &&
                    distanceLast30Days.value != null
                      ? `${formatDistance(distanceLast30Days.value)} ${distanceUnit}`
                      : ui.common.emptyValue}
                  </div>
                  <p className="mt-1 text-xs text-teal-800/75 dark:text-teal-200/75">
                    {distanceLast30Days?.hasSufficientData
                      ? distanceLast30Days.coverage === "partial"
                        ? ui.insights.basedOnAvailableOdometerLogs
                        : ui.dashboard.distanceLastThirtyDaysDescription
                      : ui.insights.distanceInsufficientDataDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.3} className="h-full">
              <Card className="relative overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-background to-background shadow-sm h-full">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-violet-900 dark:text-violet-100">
                    {ui.insights.distanceLastTwelveMonths}
                  </CardTitle>
                  <div className="rounded-full bg-violet-500/15 p-2 text-violet-500 ring-1 ring-violet-500/20">
                    <Route className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-violet-950 dark:text-violet-50">
                    {distanceLast12Months?.hasSufficientData &&
                    distanceLast12Months.value != null
                      ? `${formatDistance(distanceLast12Months.value)} ${distanceUnit}`
                      : ui.common.emptyValue}
                  </div>
                  <p className="mt-1 text-xs text-violet-800/75 dark:text-violet-200/75">
                    {distanceLast12Months?.hasSufficientData
                      ? distanceLast12Months.coverage === "partial"
                        ? ui.insights.basedOnAvailableOdometerLogs
                        : ui.insights.monthlyDistanceHistoryDescription
                      : ui.insights.distanceInsufficientDataDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          </div>

          <MotionWrapper delay={0.4}>
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-white/5">
                <CardTitle>{ui.insights.monthlyDistanceHistoryTitle}</CardTitle>
                <CardDescription>
                  {ui.insights.monthlyDistanceHistoryDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {hasDistanceHistory ? (
                  <ChartContainer
                    config={distanceChartConfig}
                    className="min-h-[320px] w-full"
                  >
                    <BarChart
                      data={[...distanceMonthlyData].reverse()}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "var(--muted-foreground)" }}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: unknown) =>
                              `${formatDistance(Number(value))} ${distanceUnit}`
                            }
                          />
                        }
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--color-distance)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-muted/10 p-6 text-center">
                    <h2 className="text-lg font-medium">
                      {ui.insights.distanceInsufficientDataTitle}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {ui.insights.distanceInsufficientDataDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionWrapper>
        </TabsContent>
      </Tabs>
    </MotionWrapper>
  );
}
