"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Droplet, Wrench } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mattofficial/veloce-ui";
import type { VehicleWithLogs } from "@/types/database";
import { ui } from "@/content/en/ui";
import {
  buildActivityHeatmap,
  type ActivityHeatmapDay,
} from "@/utils/activity-heatmap";

type ActivityHeatmapProps = {
  vehicles: readonly VehicleWithLogs[];
  title: string;
  description: string;
  isLoading?: boolean;
  scale?: "compact" | "fill";
};

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL_STYLES = {
  fuel: [
    "bg-amber-500/30",
    "bg-amber-500/45",
    "bg-amber-500/65",
    "bg-amber-500/85",
  ],
  maintenance: [
    "bg-sky-500/30",
    "bg-sky-500/45",
    "bg-sky-500/65",
    "bg-sky-500/85",
  ],
  mixed: [
    "bg-gradient-to-br from-amber-500/40 to-sky-500/40",
    "bg-gradient-to-br from-amber-500/55 to-sky-500/55",
    "bg-gradient-to-br from-amber-500/75 to-sky-500/75",
    "bg-gradient-to-br from-amber-500 to-sky-500",
  ],
} as const;

function getCellStyle(day: ActivityHeatmapDay) {
  if (!day.isInRange) return "bg-transparent";
  if (day.totalCount === 0) return "bg-muted/70 dark:bg-white/5";

  const index = day.intensity - 1;
  if (day.fuelCount > 0 && day.maintenanceCount > 0) {
    return CELL_STYLES.mixed[index];
  }
  if (day.fuelCount > 0) return CELL_STYLES.fuel[index];
  return CELL_STYLES.maintenance[index];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getDaySummary(day: ActivityHeatmapDay) {
  const activity = pluralize(day.totalCount, "activity", "activities");
  const fuel = pluralize(day.fuelCount, "fuel stop");
  const maintenance = pluralize(day.maintenanceCount, "maintenance payment");
  return `${formatDate(day.date)}: ${activity}, ${fuel}, ${maintenance}`;
}

export function ActivityHeatmap({
  vehicles,
  title,
  description,
  isLoading = false,
  scale = "compact",
}: ActivityHeatmapProps) {
  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const data = useMemo(
    () => buildActivityHeatmap(vehicles, today),
    [today, vehicles],
  );
  const activeDays = useMemo(
    () =>
      data.weeks
        .flatMap((week) => week.days)
        .filter((day) => day.totalCount > 0),
    [data.weeks],
  );
  const selectedDay =
    activeDays.find((day) => day.date === selectedDate) ??
    activeDays.at(-1) ??
    null;
  const isFillScale = scale === "fill";

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollLeft = scrollContainer.scrollWidth;
  }, []);

  return (
    <Card className="rounded-[2rem] border-none shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-400 via-primary to-sky-500" />
      <CardHeader className="gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {description}
          </CardDescription>
        </div>
        <div className="flex shrink-0 gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5">
            {isLoading ? "—" : ui.activityHeatmap.activeDays(data.activeDays)}
          </span>
          <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5">
            {isLoading
              ? "—"
              : ui.activityHeatmap.activities(data.totalActivities)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2"
          role="group"
          data-scale={scale}
          aria-label={`${title}. ${data.activeDays} active days and ${data.totalActivities} activities in the last 12 months.`}
        >
          <div
            className={
              isFillScale
                ? "w-full min-w-[900px] pr-4"
                : "w-max min-w-full pr-4"
            }
          >
            <div className="mb-2 ml-9 flex gap-1" aria-hidden="true">
              {data.weeks.map((week) => (
                <div
                  key={`${week.days[0]?.date}-month`}
                  className={isFillScale ? "min-w-0 flex-1" : "w-3 shrink-0"}
                >
                  {week.monthLabel ? (
                    <span className="text-[10px] text-muted-foreground">
                      {week.monthLabel}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <div
                className="grid w-8 shrink-0 grid-rows-7 gap-1 text-[10px] leading-3 text-muted-foreground"
                aria-hidden="true"
              >
                {DAY_LABELS.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    className={isFillScale ? "flex items-center" : "h-3"}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div
                className={isFillScale ? "flex min-w-0 flex-1 gap-1" : "flex gap-1"}
              >
                {data.weeks.map((week) => (
                  <div
                    key={week.days[0]?.date}
                    className={
                      isFillScale
                        ? "grid min-w-0 flex-1 grid-rows-7 gap-1"
                        : "grid shrink-0 grid-rows-7 gap-1"
                    }
                  >
                    {week.days.map((day) => {
                      const className = `${isFillScale ? "aspect-square w-full" : "h-3 w-3"} rounded-[3px] border border-foreground/5 transition-all ${getCellStyle(day)}`;

                      if (!day.isInRange || day.totalCount === 0) {
                        return (
                          <span
                            key={day.date}
                            className={className}
                            aria-hidden="true"
                          />
                        );
                      }

                      const summary = getDaySummary(day);
                      return (
                        <button
                          key={day.date}
                          type="button"
                          aria-label={summary}
                          aria-pressed={selectedDay?.date === day.date}
                          title={summary}
                          onClick={() => setSelectedDate(day.date)}
                          className={`${className} cursor-pointer outline-none hover:scale-125 hover:ring-2 hover:ring-ring/40 focus-visible:scale-125 focus-visible:ring-2 focus-visible:ring-ring ${selectedDay?.date === day.date ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-10 text-sm">
            {isLoading ? (
              <p className="text-muted-foreground">
                {ui.activityHeatmap.loading}
              </p>
            ) : selectedDay ? (
              <div>
                <p className="font-semibold text-foreground">
                  {formatDate(selectedDay.date)}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {ui.activityHeatmap.fuelStops(selectedDay.fuelCount)} ·{" "}
                  {ui.activityHeatmap.maintenancePayments(
                    selectedDay.maintenanceCount,
                  )}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-foreground">
                  {ui.activityHeatmap.emptyTitle}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {ui.activityHeatmap.emptyDescription}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5 text-amber-500" />{" "}
              {ui.activityHeatmap.fuelLegend}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-sky-500" />{" "}
              {ui.activityHeatmap.maintenanceLegend}
            </span>
            <span>{ui.activityHeatmap.intensityLegend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
