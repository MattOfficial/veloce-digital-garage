"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";
import {
  ArrowRight,
  Droplet,
  Wrench,
  Activity,
  CalendarDays,
  TrendingUp,
  Sparkles,
  Droplets,
  PaintBucket,
  Receipt,
  Map as MapIcon,
  Zap,
  Battery,
  Car,
  Umbrella,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useUserStore } from "@/store/user-store";

import { CustomLogCategory } from "@/types/database";
import {
  createTrailingDayRange,
  getVehicleDistanceSummary,
} from "@/utils/distance-analytics";
import { ui } from "@/content/en/ui";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@veloce/ui";

const EXPENSE_COLORS = {
  fuel: "#f59e0b",
  maintenance: "#3b82f6",
  other: "#10b981",
} as const;
type ExpenseCategoryName =
  (typeof ui.dashboard.expenseCategories)[keyof typeof ui.dashboard.expenseCategories];
type ExpenseDatum = { name: ExpenseCategoryName; value: number };

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Droplets,
  PaintBucket,
  Receipt,
  Wrench,
  Map: MapIcon,
  Zap,
  Battery,
  Car,
  Umbrella,
};

function getColorHex(color: string) {
  const map: Record<string, string> = {
    blue: "#3b82f6",
    emerald: "#10b981",
    violet: "#8b5cf6",
    rose: "#f43f5e",
    amber: "#f59e0b",
    slate: "#64748b",
  };
  return map[color] || "#64748b";
}

export default function DashboardClient({
  categories = [],
}: {
  categories?: CustomLogCategory[];
}) {
  const { vehicles, isLoading } = useVehicleStore();
  const { profile } = useUserStore();
  const selectedVehicle = useVehicleStore((state) =>
    state.getSelectedVehicle(),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">
            {ui.dashboard.loading}
          </p>
        </div>
      </div>
    );
  }

  if (!selectedVehicle || vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold mb-2">
            {ui.dashboard.noVehiclesFoundTitle}
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {ui.dashboard.noVehiclesFoundDescription}
          </p>
          <Link href="/dashboard/profile">
            <Button className="rounded-full">{ui.dashboard.goToProfile}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const vehicleCategories = categories.filter(
    (c) => c.vehicle_id === selectedVehicle.id,
  );

  const currencySymbol =
    profile?.currency === "USD"
      ? "$"
      : profile?.currency === "EUR"
        ? "€"
        : profile?.currency === "GBP"
          ? "£"
          : "₹";
  const distanceUnit = profile?.distanceUnit || "km";
  const formatDistance = (value: number) =>
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0,
    }).format(value);

  // 1. Calculate Vitals
  const totalFuelCost =
    selectedVehicle.fuel_logs?.reduce((sum, log) => sum + log.total_cost, 0) ||
    0;
  const totalMaintenanceCost =
    selectedVehicle.maintenance_logs?.reduce((sum, log) => sum + log.cost, 0) ||
    0;
  const totalCustomCost =
    selectedVehicle.custom_logs?.reduce(
      (sum, log) => sum + (log.cost || 0),
      0,
    ) || 0;
  const totalSpend = totalFuelCost + totalMaintenanceCost + totalCustomCost;

  const latestOdometer = getVehicleCurrentOdometer(selectedVehicle);

  // Last 30 days spend vs previous 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const getCostInPeriod = (startDate: Date, endDate: Date) => {
    const fCost =
      selectedVehicle.fuel_logs
        ?.filter(
          (l) => new Date(l.date) >= startDate && new Date(l.date) < endDate,
        )
        .reduce((sum, l) => sum + l.total_cost, 0) || 0;
    const mCost =
      selectedVehicle.maintenance_logs
        ?.filter(
          (l) => new Date(l.date) >= startDate && new Date(l.date) < endDate,
        )
        .reduce((sum, l) => sum + l.cost, 0) || 0;
    const cCost =
      selectedVehicle.custom_logs
        ?.filter(
          (l) => new Date(l.date) >= startDate && new Date(l.date) < endDate,
        )
        .reduce((sum, l) => sum + (l.cost || 0), 0) || 0;
    return fCost + mCost + cCost;
  };

  const costLast30Days = getCostInPeriod(thirtyDaysAgo, now);
  const costPrev30Days = getCostInPeriod(sixtyDaysAgo, thirtyDaysAgo);
  const distanceLast30Days = getVehicleDistanceSummary(
    selectedVehicle,
    createTrailingDayRange(30, now),
  );

  let spendTrend = 0;
  if (costPrev30Days > 0) {
    spendTrend = ((costLast30Days - costPrev30Days) / costPrev30Days) * 100;
  }

  // 2. Prepare Data for Charts
  const expenseData: ExpenseDatum[] = [
    { name: ui.dashboard.expenseCategories.fuel, value: totalFuelCost },
    {
      name: ui.dashboard.expenseCategories.maintenance,
      value: totalMaintenanceCost,
    },
  ];
  if (totalCustomCost > 0)
    expenseData.push({
      name: ui.dashboard.expenseCategories.other,
      value: totalCustomCost,
    });

  // Aggregate cost data by month for the bar chart (last 6 months)
  const costOverTimeMap = new Map<
    string,
    { month: string; Fuel: number; Maintenance: number }
  >();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthYear = d.toLocaleDateString("default", {
      month: "short",
      year: "2-digit",
    });
    costOverTimeMap.set(monthYear, {
      month: monthYear,
      Fuel: 0,
      Maintenance: 0,
    });
  }

  selectedVehicle.fuel_logs?.forEach((log) => {
    const d = new Date(log.date);
    const monthYear = d.toLocaleDateString("default", {
      month: "short",
      year: "2-digit",
    });
    if (costOverTimeMap.has(monthYear)) {
      costOverTimeMap.get(monthYear)!.Fuel += log.total_cost;
    }
  });

  selectedVehicle.maintenance_logs?.forEach((log) => {
    const d = new Date(log.date);
    const monthYear = d.toLocaleDateString("default", {
      month: "short",
      year: "2-digit",
    });
    if (costOverTimeMap.has(monthYear)) {
      costOverTimeMap.get(monthYear)!.Maintenance += log.cost;
    }
  });

  const costOverTimeData = Array.from(costOverTimeMap.values());

  // 3. Recent Activity (Latest 5 logs combined)
  const allLogs = [
    ...(selectedVehicle.fuel_logs?.map((l) => ({
      ...l,
      type: "Fuel",
      sortDate: new Date(l.date).getTime(),
    })) || []),
    ...(selectedVehicle.maintenance_logs?.map((l) => ({
      ...l,
      type: "Maintenance",
      sortDate: new Date(l.date).getTime(),
    })) || []),
    ...(selectedVehicle.custom_logs?.map((l) => ({
      ...l,
      type: `Other`,
      sortDate: new Date(l.date).getTime(),
    })) || []),
  ]
    .sort((a, b) => b.sortDate - a.sortDate)
    .slice(0, 5);

  return (
    <MotionWrapper className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Area with Profile Link */}
      <PageHeader
        title={ui.dashboard.overviewTitle}
        description={ui.dashboard.overviewDescription(
          `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        )}
        icon={LayoutDashboard}
      >
        <Link href={`/dashboard/vehicles/${selectedVehicle.id}`}>
          <Button
            variant="outline"
            className="rounded-full shadow-sm hover:bg-primary/5 hover:text-primary transition-colors border-primary/20"
          >
            {ui.dashboard.viewFullVehicleProfile}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </PageHeader>

      {/* Top Vitals Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MotionWrapper delay={0.1}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {ui.dashboard.currentOdometer}
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary shadow-primary/20 drop-shadow-md">
                {latestOdometer.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {ui.dashboard.odometerSuffix(distanceUnit)}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.2}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {ui.dashboard.thirtyDaySpend}
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-500 shadow-emerald-500/20 drop-shadow-md">
                {currencySymbol}
                {costLast30Days.toFixed(2)}
              </div>
              <p
                className={`text-xs mt-1 font-medium flex items-center ${spendTrend > 0 ? "text-destructive" : spendTrend < 0 ? "text-emerald-500" : "text-muted-foreground"}`}
              >
                {ui.dashboard.previousThirtyDaysComparison(spendTrend)}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.3}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {ui.dashboard.distanceLastThirtyDays}
              </CardTitle>
              <MapIcon className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-500 shadow-amber-500/20 drop-shadow-md">
                {distanceLast30Days.hasSufficientData &&
                distanceLast30Days.value != null
                  ? `${formatDistance(distanceLast30Days.value)} ${distanceUnit}`
                  : ui.common.emptyValue}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {distanceLast30Days.hasSufficientData
                  ? distanceLast30Days.coverage === "partial"
                    ? ui.dashboard.basedOnAvailableOdometerLogs
                    : ui.dashboard.distanceLastThirtyDaysDescription
                  : ui.dashboard.distanceNeedsOdometerLogs}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper delay={0.4}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {ui.dashboard.lifetimeMaintenance}
              </CardTitle>
              <Wrench className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-500 shadow-blue-500/20 drop-shadow-md">
                {currencySymbol}
                {totalMaintenanceCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {ui.dashboard.allTimeRepairCost}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* 6-Month Expense History Chart */}
        <MotionWrapper delay={0.5} className="lg:col-span-4">
          <Card className="overflow-hidden h-full">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {ui.dashboard.expenseHistoryTitle}
              </CardTitle>
              <CardDescription>
                {ui.dashboard.expenseHistoryDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={costOverTimeData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="month"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${currencySymbol}${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-veloce-glass)" }}
                      contentStyle={{
                        borderRadius: "1rem",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(17, 24, 39, 0.8)",
                        backdropFilter: "blur(10px)",
                      }}
                      formatter={(value: number) => [
                        `${currencySymbol}${value.toFixed(2)}`,
                        undefined,
                      ]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                    <Bar
                      dataKey="Fuel"
                      stackId="a"
                      fill={EXPENSE_COLORS.fuel}
                      radius={[0, 0, 4, 4]}
                    />
                    <Bar
                      dataKey="Maintenance"
                      stackId="a"
                      fill={EXPENSE_COLORS.maintenance}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Expense Distribution Pie Chart */}
        <MotionWrapper delay={0.6} className="lg:col-span-3">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle>{ui.dashboard.expenseDistributionTitle}</CardTitle>
              <CardDescription>
                {ui.dashboard.expenseDistributionDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {totalSpend > 0 ? (
                <div className="h-[300px] w-full pt-4 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === ui.dashboard.expenseCategories.fuel
                                ? EXPENSE_COLORS.fuel
                                : entry.name ===
                                    ui.dashboard.expenseCategories.maintenance
                                  ? EXPENSE_COLORS.maintenance
                                  : EXPENSE_COLORS.other
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `${currencySymbol}${value.toFixed(2)}`,
                          undefined,
                        ]}
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold block mb-1">
                      {ui.dashboard.totalLabel}
                    </span>
                    <span className="text-xl font-bold">
                      {currencySymbol}
                      {(totalSpend / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    {ui.dashboard.noExpensesLoggedYet}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>

      {/* Bottom Row - Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <MotionWrapper delay={0.7} className="md:col-span-2 lg:col-span-1">
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle>{ui.dashboard.recentActivityTitle}</CardTitle>
              <CardDescription>
                {ui.dashboard.recentActivityDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {allLogs.length > 0 ? (
                <div className="divide-y max-h-[350px] overflow-y-auto">
                  {allLogs.map((log, i) => {
                    type LogUnion = typeof log & {
                      category_id?: string;
                      service_type?: string;
                      fuel_volume?: number;
                      gallons?: number;
                      odometer?: number;
                      notes?: string;
                      cost?: number;
                      total_cost?: number;
                    };

                    const ulog = log as LogUnion;

                    const cat =
                      ulog.type === "Other"
                        ? vehicleCategories.find(
                            (c) => c.id === ulog.category_id,
                          )
                        : null;
                    const IconComponent =
                      ulog.type === "Fuel"
                        ? Droplet
                        : ulog.type === "Maintenance"
                          ? Wrench
                          : cat && ICON_MAP[cat.icon]
                            ? ICON_MAP[cat.icon]
                            : Activity;

                    const themeColor =
                      ulog.type === "Other" && cat
                        ? getColorHex(cat.color_theme)
                        : null;

                    return (
                      <div
                        key={`${ulog.type}-${i}`}
                        className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-full mt-0.5 shrink-0 ${
                            ulog.type === "Fuel"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                              : ulog.type === "Maintenance"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                                : !themeColor
                                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                                  : ""
                          }`}
                          style={
                            themeColor
                              ? {
                                  backgroundColor: `${themeColor}20`,
                                  color: themeColor,
                                }
                              : undefined
                          }
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1 w-full overflow-hidden">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium leading-none">
                              {ulog.type === "Fuel"
                                ? ui.dashboard.fuelActivityLabel
                                : ulog.type === "Maintenance"
                                  ? ulog.service_type
                                  : cat
                                    ? cat.name
                                    : ui.dashboard.customEntryLabel}
                            </p>
                            <div className="text-sm font-semibold text-right shrink-0 ml-2">
                              {ulog.type === "Other" && cat && !cat.track_cost
                                ? null
                                : ulog.cost != null
                                  ? `${currencySymbol}${Number(ulog.cost).toFixed(2)}`
                                  : ulog.total_cost != null
                                    ? `${currencySymbol}${Number(ulog.total_cost).toFixed(2)}`
                                    : ""}
                            </div>
                          </div>
                          <div className="flex justify-between items-start mt-0.5">
                            <p className="text-xs text-muted-foreground line-clamp-1 pr-2">
                              {ulog.type === "Fuel"
                                ? `${ulog.fuel_volume || ulog.gallons || ""} units added at ${ulog.odometer} ${distanceUnit}`
                                : ulog.type === "Maintenance"
                                  ? ulog.notes || ui.dashboard.maintenanceLogged
                                  : ulog.notes || ui.dashboard.entryLogged}
                            </p>
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0">
                              {new Date(ulog.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-muted/5 min-h-[250px] flex flex-col items-center justify-center">
                  <Activity className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {ui.dashboard.noRecentActivity}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Quick Actions Card */}
        <MotionWrapper delay={0.8} className="md:col-span-2 lg:col-span-1">
          <Card className="h-full overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle>{ui.dashboard.quickActionsTitle}</CardTitle>
              <CardDescription>
                {ui.dashboard.quickActionsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <Link href="/dashboard/fuel" className="block w-full">
                <Button
                  className="w-full justify-start h-14 rounded-xl text-md"
                  variant="default"
                >
                  <div className="bg-primary-foreground/20 p-2 rounded-lg mr-3">
                    <Droplet className="h-5 w-5" />
                  </div>
                  {ui.dashboard.logFillUp}
                </Button>
              </Link>
              {/* We will add a wrapper to open the maintenance modal from here later if needed, for now we will link to the maintenance tab or the vehicle view */}
              <Link
                href={`/dashboard/vehicles/${selectedVehicle.id}`}
                className="block w-full"
              >
                <Button
                  className="w-full justify-start h-14 rounded-xl text-md"
                  variant="outline"
                >
                  <div className="bg-muted p-2 rounded-lg mr-3">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {ui.dashboard.addMaintenanceRecord}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  );
}
