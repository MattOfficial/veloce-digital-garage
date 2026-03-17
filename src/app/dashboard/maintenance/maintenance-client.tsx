"use client";

import { useVehicleStore } from "@/store/vehicle-store";
import { useUserStore } from "@/store/user-store";
import { CustomLogCategory } from "@/types/database";
import {
  Wrench,
  DollarSign,
  Activity,
  FileText,
  Sparkles,
  BellRing,
  Gauge,
  CalendarDays,
} from "lucide-react";
import { MotionWrapper } from "@/components/motion-wrapper";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AddMaintenanceModal } from "@/components/add-maintenance-modal";
import { AddTrackerModal } from "@/components/add-tracker-modal";
import { CustomTrackerWidget } from "@/components/custom-tracker-widget";
import { TyreTrackerWidget } from "@/components/tyre-tracker-widget";
import { MaintenanceLogActions } from "@/components/maintenance-log-actions";
import { PageHeader } from "@/components/page-header";
import { DocumentUploader } from "@/components/document-uploader";
import { OcrReviewModal } from "@/components/ocr-review-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ui } from "@/content/en/ui";
import {
  getServiceReminderStatus,
  getVehicleCurrentOdometer,
  getVehicleServiceInterval,
} from "@/utils/vehicle-metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@veloce/ui";

const COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
  "#64748b",
];

export default function MaintenanceClient({
  categories,
}: {
  categories: CustomLogCategory[];
}) {
  const { vehicles, selectedVehicleId, fetchVehicles } = useVehicleStore();
  const { profile } = useUserStore();
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const router = useRouter();

  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);

  const handleUploadSuccess = (url: string, path: string) => {
    setUploadedFileUrl(url);
    setUploadedFilePath(path);
    setOcrModalOpen(true);
  };

  const handleOcrSuccess = async () => {
    await fetchVehicles();
    router.refresh();
  };

  if (!selectedVehicle) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {ui.maintenance.noVehicleSelectedTitle}
          </h2>
          <p className="text-muted-foreground">
            {ui.maintenance.noVehicleSelectedDescription}
          </p>
        </div>
      </div>
    );
  }

  const vehicleCategories = categories.filter(
    (c) => c.vehicle_id === selectedVehicle.id,
  );

  const { distanceUnit, currency } = profile;
  const currencySymbol = currency || "$";
  const numberFormat = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatCurrency = (val: number) =>
    `${currencySymbol}${numberFormat.format(val)}`;
  const formatDistance = (val: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(val);

  const logs = [...(selectedVehicle.maintenance_logs || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const hasLogs = logs.length > 0;

  // --- Analytics Calculations ---
  let totalSpend = 0;
  let thirtyDaySpend = 0;

  // Categorize spend for donut chart
  const spendByCategory: Record<string, number> = {};

  // Aggregate by month for the bar chart
  const spendByMonth: Record<string, number> = {};

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  logs.forEach((log) => {
    totalSpend += log.cost;

    // Calculate 30-day spend
    const logDate = new Date(log.date);
    if (logDate >= thirtyDaysAgo) {
      thirtyDaySpend += log.cost;
    }

    // Extract a simplified category name (e.g., "Engine Oil Change" -> "Engine Oil")
    const catName = log.service_type.split(" - ")[0] || log.service_type;
    spendByCategory[catName] = (spendByCategory[catName] || 0) + log.cost;

    const monthKey = new Date(log.date).toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
    spendByMonth[monthKey] = (spendByMonth[monthKey] || 0) + log.cost;
  });

  const categoryData = Object.entries(spendByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // sort largest to smallest

  const barChartData = Object.entries(spendByMonth).map(([date, cost]) => ({
    date,
    cost,
  }));

  // --- Distance & Cost Metrics ---
  const currentOdometer = getVehicleCurrentOdometer(selectedVehicle);
  const distanceTracked =
    currentOdometer - (selectedVehicle.baseline_odometer || 0);
  const costPerDistance =
    distanceTracked > 0 ? totalSpend / distanceTracked : 0;
  const serviceInterval = getVehicleServiceInterval(
    selectedVehicle.service_reminders || [],
  );
  const serviceIntervalStatus = serviceInterval
    ? getServiceReminderStatus(serviceInterval, currentOdometer)
    : null;

  const tableLogs = [...logs].reverse();

  const nextServicePill = (() => {
    if (!serviceInterval || !serviceIntervalStatus) {
      return {
        className: "border-white/10 bg-white/5 text-muted-foreground",
        label: ui.maintenance.reminders.emptyTitle,
      };
    }

    if (serviceIntervalStatus.status === "overdue") {
      return {
        className: "border-red-500/25 bg-red-500/15 text-red-200",
        label: `${ui.maintenance.reminders.titleList}: ${ui.maintenance.reminders.statusOverdue}`,
      };
    }

    if (serviceIntervalStatus.status === "due-soon") {
      return {
        className: "border-amber-500/25 bg-amber-500/15 text-amber-100",
        label: `${ui.maintenance.reminders.titleList}: ${ui.maintenance.reminders.statusDueSoon}`,
      };
    }

    if (serviceIntervalStatus.status === "needs-baseline") {
      return {
        className: "border-white/10 bg-white/5 text-muted-foreground",
        label: ui.maintenance.reminders.statusNeedsBaseline,
      };
    }

    return {
      className: "border-emerald-500/25 bg-emerald-500/15 text-emerald-100",
      label: `${ui.maintenance.reminders.titleList}: ${ui.maintenance.reminders.statusHealthy}`,
    };
  })();

  return (
    <MotionWrapper className="max-w-6xl mx-auto space-y-6 pb-10">
      <PageHeader
        title={ui.maintenance.pageTitle}
        description={ui.maintenance.pageDescription(
          `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
        )}
        icon={Wrench}
      >
        <div className="flex flex-wrap gap-2">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${nextServicePill.className}`}
          >
            <BellRing className="h-4 w-4" />
            <span>{nextServicePill.label}</span>
          </div>
          <AddMaintenanceModal vehicleId={selectedVehicle.id} />
        </div>
      </PageHeader>

      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="grid w-[400px] grid-cols-3 rounded-full">
          <TabsTrigger value="overview" className="rounded-full">
            {ui.maintenance.tabs.overview}
          </TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-full">
            {ui.maintenance.tabs.invoices}
          </TabsTrigger>
          <TabsTrigger value="trackers" className="rounded-full">
            {ui.maintenance.tabs.trackers}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Vitals Row */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 grid-auto-rows-[1fr] items-stretch">
            <MotionWrapper delay={0.1} className="h-full">
              <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.maintenance.lifetimeMaintenanceCost}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-rose-500 shadow-rose-500/20 drop-shadow-md">
                    {formatCurrency(totalSpend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.maintenance.lifetimeMaintenanceCostDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.2} className="h-full">
              <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.maintenance.thirtyDayMaintenanceSpend}
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-violet-500 shadow-violet-500/20 drop-shadow-md">
                    {formatCurrency(thirtyDaySpend)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.maintenance.thirtyDayMaintenanceSpendDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.3} className="h-full">
              <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.maintenance.maintenanceCostPerDistance(distanceUnit)}
                  </CardTitle>
                  <Activity className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-amber-500 shadow-amber-500/20 drop-shadow-md">
                    {costPerDistance > 0
                      ? formatCurrency(costPerDistance)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.maintenance.maintenanceCostPerDistanceDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper delay={0.4} className="h-full">
              <Card className="relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {ui.maintenance.servicesLogged}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-primary shadow-primary/20 drop-shadow-md">
                    {logs.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {ui.maintenance.totalServiceRecords}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          </div>

          {!hasLogs ? (
            <MotionWrapper delay={0.5}>
              <Card className="bg-white/5 border-dashed border-2 border-white/10">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold tracking-tight">
                    {ui.maintenance.noMaintenanceLoggedTitle}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">
                    {ui.maintenance.noMaintenanceLoggedDescription}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          ) : (
            <>
              {/* Analytics Charts */}
              <div className="grid gap-6 md:grid-cols-5">
                <MotionWrapper delay={0.6} className="md:col-span-2">
                  <Card className="h-full overflow-hidden">
                    <CardHeader className="border-b border-white/5">
                      <CardTitle>{ui.maintenance.spendByCategory}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full pb-4 pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                              borderRadius: "1rem",
                              border: "1px solid rgba(255,255,255,0.1)",
                              background: "rgba(17, 24, 39, 0.8)",
                              backdropFilter: "blur(10px)",
                            }}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: "12px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </MotionWrapper>

                <MotionWrapper delay={0.7} className="md:col-span-3">
                  <Card className="h-full overflow-hidden">
                    <CardHeader className="border-b border-white/5">
                      <CardTitle>
                        {ui.maintenance.maintenanceTimeline}
                      </CardTitle>
                      <CardDescription>
                        {ui.maintenance.maintenanceTimelineDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] w-full pt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barChartData}
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
                            tick={{ fill: "#e2e8f0", fontSize: 12 }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#e2e8f0", fontSize: 12 }}
                          />
                          <RechartsTooltip
                            formatter={(value: number) => formatCurrency(value)}
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            contentStyle={{
                              borderRadius: "1rem",
                              border: "1px solid rgba(255,255,255,0.1)",
                              background: "rgba(17, 24, 39, 0.8)",
                              backdropFilter: "blur(10px)",
                            }}
                          />
                          <Bar
                            dataKey="cost"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                            name={ui.maintenance.addMaintenance.labels.totalCost(
                              currencySymbol,
                            )}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6 mt-6">
          {/* Document Upload Widget */}
          <DocumentUploader
            vehicleId={selectedVehicle.id}
            onUploadSuccess={handleUploadSuccess}
          />

          {/* Service History Table */}
          <MotionWrapper delay={0.1}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
                <CardTitle>{ui.maintenance.serviceLogTitle}</CardTitle>
                <CardDescription>
                  {ui.maintenance.serviceLogDescription}
                </CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                {tableLogs.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                    <FileText className="h-10 w-10 mb-4 opacity-20" />
                    <p className="font-medium text-foreground">
                      {ui.maintenance.noServiceRecordsTitle}
                    </p>
                    <p className="text-sm mt-1">
                      {ui.maintenance.noServiceRecordsDescription}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-black/20 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium">
                          {ui.maintenance.columns.date}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {ui.maintenance.columns.servicePerformed}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {ui.vehicle.columns.odometer}
                        </th>
                        <th className="px-6 py-4 font-medium">
                          {ui.maintenance.columns.additionalNotes}
                        </th>
                        <th className="px-6 py-4 font-medium text-right">
                          {ui.maintenance.columns.invoiceCost}
                        </th>
                        <th className="px-6 py-4 font-medium text-right">
                          {ui.maintenance.columns.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      {tableLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            {new Date(log.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary">
                            {log.service_type}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                            {log.odometer != null
                              ? `${formatDistance(log.odometer)} ${distanceUnit}`
                              : ui.common.emptyValue}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground max-w-md truncate">
                            {log.notes || "--"}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-foreground">
                            {formatCurrency(log.cost)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <MaintenanceLogActions
                              log={log}
                              vehicleId={selectedVehicle.id}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </MotionWrapper>
        </TabsContent>

        <TabsContent value="trackers" className="space-y-8 mt-6">
          {/* The Permanent Tyre Tracker Block */}
          <MotionWrapper delay={0.1} className="relative z-20 mt-8 mb-6">
            <TyreTrackerWidget
              vehicle={selectedVehicle}
              latestOdometer={currentOdometer}
            />
          </MotionWrapper>

          {/* Custom Time-Series Trackers Section */}
          <MotionWrapper
            delay={0.2}
            className="relative z-20 space-y-4 pt-6 mt-6 border-t border-border/10"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center drop-shadow-md">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                {ui.maintenance.trackersTitle}
              </h2>
              <p className="text-sm text-muted-foreground mr-auto ml-4">
                {ui.maintenance.trackersDescription}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicleCategories.map((category, i) => (
                <MotionWrapper
                  key={category.id}
                  delay={0.3 + i * 0.1}
                  className="min-h-[300px]"
                >
                  <CustomTrackerWidget
                    category={category}
                    logs={
                      selectedVehicle.custom_logs
                        ? selectedVehicle.custom_logs.filter(
                            (l) => l.category_id === category.id,
                          )
                        : []
                    }
                    vehicleId={selectedVehicle.id}
                  />
                </MotionWrapper>
              ))}
              <MotionWrapper
                delay={0.3 + vehicleCategories.length * 0.1}
                className="min-h-[300px]"
              >
                <AddTrackerModal />
              </MotionWrapper>
            </div>
          </MotionWrapper>
        </TabsContent>
      </Tabs>

      <OcrReviewModal
        vehicleId={selectedVehicle.id}
        fileUrl={uploadedFileUrl}
        filePath={uploadedFilePath}
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        onSuccess={handleOcrSuccess}
      />
    </MotionWrapper>
  );
}
