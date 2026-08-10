"use client";

import { CalendarDays, Download, FileSpreadsheet, FileText, Table2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MotionWrapper } from "@/components/motion-wrapper";
import { PageHeader } from "@/components/page-header";
import { ui } from "@/content/en/ui";
import { useUserStore } from "@/store/user-store";
import { useVehicleStore } from "@/store/vehicle-store";
import { formatMoney, formatTableDate } from "@/utils/formatting";
import {
  buildReportDataset,
  getEarliestRecordDate,
  getReportVehicleLabel,
  type ReportSection,
  type ReportScope,
  type ReportUnits,
} from "@/utils/reports/report-dataset";
import {
  getReportRangeLabel,
  REPORT_FORMATS,
  type ReportFormat,
} from "@/utils/reports/report-format";
import {
  REPORT_RANGE_PRESETS,
  resolveReportRange,
  type ReportRangePreset,
} from "@/utils/reports/report-range";
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@mattofficial/veloce-ui";

const FORMAT_ICONS = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  csv: Table2,
} as const;

const DEFAULT_SECTIONS: ReportSection[] = ["energy", "maintenance", "vehicle-profile"];

function filenameFromResponse(response: Response, fallback: string): string {
  const header = response.headers.get("Content-Disposition") ?? "";
  return /filename="([^"]+)"/.exec(header)?.[1] ?? fallback;
}

export default function ReportsPage() {
  const { vehicles, selectedVehicleId } = useVehicleStore();
  const { profile, getVolumeUnit, getFuelEconomyUnit, getEvEfficiencyUnit } = useUserStore();
  const copy = ui.reports.page;

  const [scope, setScope] = useState<ReportScope>("vehicle");
  const [garageVehicleIds, setGarageVehicleIds] = useState<string[] | null>(null);
  const [preset, setPreset] = useState<ReportRangePreset>("last-6-months");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [sections, setSections] = useState<ReportSection[]>(DEFAULT_SECTIONS);
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  // Null means "everything", so a vehicle added later is included by default
  // rather than silently missing from the next report.
  const selectedGarageIds = garageVehicleIds ?? vehicles.map((vehicle) => vehicle.id);

  const scopedVehicles = useMemo(
    () =>
      scope === "vehicle"
        ? vehicles.filter((vehicle) => vehicle.id === selectedVehicleId)
        : vehicles.filter((vehicle) => selectedGarageIds.includes(vehicle.id)),
    [scope, vehicles, selectedVehicleId, selectedGarageIds],
  );

  const units: ReportUnits = useMemo(
    () => ({
      currency: profile.currency,
      distanceUnit: profile.distanceUnit,
      volumeUnit: getVolumeUnit(),
      fuelEfficiencyUnit: getFuelEconomyUnit(),
      evEfficiencyUnit: getEvEfficiencyUnit(),
    }),
    [profile.currency, profile.distanceUnit, getVolumeUnit, getFuelEconomyUnit, getEvEfficiencyUnit],
  );

  const range = useMemo(
    () =>
      resolveReportRange(preset, {
        from: customFrom ? formatIsoDate(customFrom) : null,
        to: customTo ? formatIsoDate(customTo) : null,
        earliest: getEarliestRecordDate(scopedVehicles),
      }),
    [preset, customFrom, customTo, scopedVehicles],
  );

  /**
   * The same builder the server runs, over the store's copy of the data. The
   * point is that the counts shown here are the ones the file will contain,
   * rather than an estimate that can disagree with it.
   */
  const preview = useMemo(
    () =>
      buildReportDataset(scopedVehicles, {
        scope,
        range,
        rangeLabel: getReportRangeLabel(range),
        title: scope === "vehicle" ? "" : ui.profile.garageTitle,
        sections,
        units,
      }),
    [scopedVehicles, scope, range, sections, units],
  );

  const recordCount =
    preview.energyRows.length + preview.maintenanceRows.length + preview.snapshotRows.length;
  const hasVehicles = scopedVehicles.length > 0;
  const canDownload = hasVehicles && sections.length > 0 && !isGenerating;

  const toggleSection = (section: ReportSection) => {
    setSections((current) =>
      current.includes(section)
        ? current.filter((value) => value !== section)
        : [...current, section],
    );
  };

  const toggleVehicle = (vehicleId: string) => {
    setGarageVehicleIds(
      selectedGarageIds.includes(vehicleId)
        ? selectedGarageIds.filter((id) => id !== vehicleId)
        : [...selectedGarageIds, vehicleId],
    );
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          scope,
          vehicleIds: scopedVehicles.map((vehicle) => vehicle.id),
          preset,
          from: customFrom ? formatIsoDate(customFrom) : null,
          to: customTo ? formatIsoDate(customTo) : null,
          sections,
        }),
      });

      if (!response.ok) {
        throw new Error(String(response.status));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filenameFromResponse(response, `veloce-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(copy.error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">{copy.noVehiclesTitle}</h2>
          <p className="mt-2 text-muted-foreground">{copy.noVehiclesDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <MotionWrapper className="mx-auto w-full max-w-7xl min-w-0 space-y-6 px-0 pb-12 sm:px-4">
      <PageHeader
        title={copy.title}
        description={copy.description}
        icon={FileText}
        className="mb-2"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.scope.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={scope === "vehicle" ? "default" : "outline"}
                  onClick={() => setScope("vehicle")}
                  className="rounded-xl"
                >
                  {copy.scope.vehicle}
                </Button>
                <Button
                  type="button"
                  variant={scope === "garage" ? "default" : "outline"}
                  onClick={() => setScope("garage")}
                  className="rounded-xl"
                >
                  {copy.scope.garage}
                </Button>
              </div>

              {scope === "garage" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {copy.scope.vehiclesLabel}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGarageVehicleIds(null)}
                    >
                      {copy.scope.selectAll}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {vehicles.map((vehicle) => (
                      <label
                        key={vehicle.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5"
                      >
                        <span className="truncate text-sm">
                          {getReportVehicleLabel(vehicle)}
                        </span>
                        <Switch
                          checked={selectedGarageIds.includes(vehicle.id)}
                          onCheckedChange={() => toggleVehicle(vehicle.id)}
                        />
                      </label>
                    ))}
                  </div>
                  {scopedVehicles.length === 0 ? (
                    <p className="text-sm text-destructive">{copy.scope.noneSelected}</p>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.range.label}</CardTitle>
              <CardDescription>{getReportRangeLabel(range)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={preset}
                onValueChange={(value) => setPreset(value as ReportRangePreset)}
              >
                <SelectTrigger className="w-full rounded-xl sm:w-[260px]">
                  <SelectValue placeholder={copy.range.preset} />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_RANGE_PRESETS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {ui.reports.rangeLabels[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {preset === "custom" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="rounded-xl">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {customFrom && customTo
                          ? ui.reports.customRangeLabel(
                              formatTableDate(customFrom),
                              formatTableDate(customTo),
                            )
                          : copy.range.pickDates}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={customFrom}
                        selected={{ from: customFrom, to: customTo }}
                        onSelect={(value) => {
                          setCustomFrom(value?.from);
                          setCustomTo(value?.to);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  {customFrom || customTo ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCustomFrom(undefined);
                        setCustomTo(undefined);
                      }}
                    >
                      {copy.range.clearDates}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.sections.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(
                [
                  ["energy", copy.sections.energy, copy.sections.energyDescription],
                  ["maintenance", copy.sections.maintenance, copy.sections.maintenanceDescription],
                  [
                    "vehicle-profile",
                    copy.sections.vehicleProfile,
                    copy.sections.vehicleProfileDescription,
                  ],
                ] as Array<[ReportSection, string, string]>
              ).map(([section, label, description]) => (
                <label
                  key={section}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-3 py-3"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{description}</span>
                  </span>
                  <Switch
                    checked={sections.includes(section)}
                    onCheckedChange={() => toggleSection(section)}
                  />
                </label>
              ))}
              {sections.length === 0 ? (
                <p className="text-sm text-destructive">{copy.sections.noneSelected}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{copy.format.label}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3">
              {REPORT_FORMATS.map((option) => {
                const Icon = FORMAT_ICONS[option];
                const isActive = format === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormat(option)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border/60 bg-muted/30 hover:bg-muted/60"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="mt-2 block text-sm font-semibold">
                      {copy.format[option]}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {copy.format[`${option}Description`]}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="text-base">{copy.preview.label}</CardTitle>
              <CardDescription>{getReportRangeLabel(range)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recordCount === 0 ? (
                <div>
                  <p className="text-sm font-medium">{copy.preview.empty}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{copy.preview.emptyHint}</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <PreviewRow
                    label={ui.reports.summary.fuelLogs}
                    value={preview.summary.counts.fuelLogs}
                  />
                  <PreviewRow
                    label={ui.reports.summary.chargeLogs}
                    value={preview.summary.counts.chargeLogs}
                  />
                  <PreviewRow
                    label={ui.reports.summary.maintenanceLogs}
                    value={preview.summary.counts.maintenanceLogs}
                  />
                  <PreviewRow
                    label={ui.reports.summary.snapshots}
                    value={preview.summary.counts.snapshots}
                  />
                  <Separator className="my-3" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">
                      {ui.reports.summary.totalSpent}
                    </span>
                    <span className="text-lg font-semibold">
                      {formatMoney(preview.summary.totalCost, units.currency)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ui.reports.summary.totalSpentNote}
                  </p>
                </div>
              )}

              <Button
                type="button"
                className="w-full rounded-xl"
                disabled={!canDownload}
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? copy.generating : copy.download}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MotionWrapper>
  );
}

function PreviewRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

/** Local calendar day, not the UTC day `toISOString` would give. */
function formatIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}
