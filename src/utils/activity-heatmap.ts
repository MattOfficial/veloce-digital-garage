import type { VehicleWithLogs } from "@/types/database";

export const ACTIVITY_HEATMAP_DAYS = 365;

export type ActivityHeatmapDay = {
  date: string;
  fuelCount: number;
  /** Charge sessions, split out from `fuelCount` by the log's energy type. */
  chargeCount: number;
  maintenanceCount: number;
  totalCount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  isInRange: boolean;
};

export type ActivityHeatmapWeek = {
  days: ActivityHeatmapDay[];
  monthLabel: string | null;
};

export type ActivityHeatmapData = {
  startDate: string;
  endDate: string;
  weeks: ActivityHeatmapWeek[];
  activeDays: number;
  totalActivities: number;
};

type ActivityVehicle = Pick<
  VehicleWithLogs,
  "fuel_logs" | "maintenance_logs"
>;

type ActivityCounts = {
  fuelCount: number;
  chargeCount: number;
  maintenanceCount: number;
};

const EMPTY_COUNTS: ActivityCounts = {
  fuelCount: 0,
  chargeCount: 0,
  maintenanceCount: 0,
};

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeActivityDate(value: string) {
  const calendarDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (calendarDate) {
    const [, year, month, day] = calendarDate;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      parsed.getFullYear() === Number(year) &&
      parsed.getMonth() === Number(month) - 1 &&
      parsed.getDate() === Number(day)
    ) {
      return `${year}-${month}-${day}`;
    }

    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : toLocalDateKey(parsed);
}

function getIntensity(totalCount: number): 0 | 1 | 2 | 3 | 4 {
  if (totalCount <= 0) return 0;
  if (totalCount === 1) return 1;
  if (totalCount === 2) return 2;
  if (totalCount === 3) return 3;
  return 4;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

export function buildActivityHeatmap(
  vehicles: readonly ActivityVehicle[],
  endDate: Date = new Date(),
  dayCount = ACTIVITY_HEATMAP_DAYS,
): ActivityHeatmapData {
  const safeDayCount = Math.max(1, Math.floor(dayCount));
  const rangeEnd = startOfLocalDay(endDate);
  const rangeStart = addDays(rangeEnd, -(safeDayCount - 1));
  const rangeStartKey = toLocalDateKey(rangeStart);
  const rangeEndKey = toLocalDateKey(rangeEnd);
  const countsByDate = new Map<string, ActivityCounts>();

  const increment = (value: string, type: keyof ActivityCounts) => {
    const date = normalizeActivityDate(value);
    if (!date || date < rangeStartKey || date > rangeEndKey) return;

    const current = countsByDate.get(date) ?? { ...EMPTY_COUNTS };
    current[type] += 1;
    countsByDate.set(date, current);
  };

  vehicles.forEach((vehicle) => {
    // Split on the log, not the vehicle: a plug-in hybrid produces both kinds
    // and belongs under both.
    (vehicle.fuel_logs ?? []).forEach((log) =>
      increment(
        log.date,
        log.energy_type === "charge" ? "chargeCount" : "fuelCount",
      ),
    );
    (vehicle.maintenance_logs ?? []).forEach((log) =>
      increment(log.date, "maintenanceCount"),
    );
  });

  const gridStart = addDays(rangeStart, -rangeStart.getDay());
  const gridEnd = addDays(rangeEnd, 6 - rangeEnd.getDay());
  const weeks: ActivityHeatmapWeek[] = [];
  let previousMonth: number | null = null;

  for (let weekStart = gridStart; weekStart <= gridEnd; weekStart = addDays(weekStart, 7)) {
    const days: ActivityHeatmapDay[] = [];

    for (let offset = 0; offset < 7; offset += 1) {
      const date = addDays(weekStart, offset);
      const dateKey = toLocalDateKey(date);
      const isInRange = dateKey >= rangeStartKey && dateKey <= rangeEndKey;
      const counts = isInRange
        ? countsByDate.get(dateKey) ?? EMPTY_COUNTS
        : EMPTY_COUNTS;
      const totalCount =
        counts.fuelCount + counts.chargeCount + counts.maintenanceCount;

      days.push({
        date: dateKey,
        ...counts,
        totalCount,
        intensity: getIntensity(totalCount),
        isInRange,
      });
    }

    const firstVisibleDay = days.find((day) => day.isInRange);
    const visibleDate = firstVisibleDay
      ? new Date(`${firstVisibleDay.date}T12:00:00`)
      : null;
    const currentMonth: number | null =
      visibleDate?.getMonth() ?? previousMonth;
    const monthLabel =
      visibleDate != null && currentMonth !== previousMonth
        ? getMonthLabel(visibleDate)
        : null;

    weeks.push({ days, monthLabel });
    previousMonth = currentMonth;
  }

  return {
    startDate: rangeStartKey,
    endDate: rangeEndKey,
    weeks,
    activeDays: countsByDate.size,
    totalActivities: Array.from(countsByDate.values()).reduce(
      (sum, counts) =>
        sum + counts.fuelCount + counts.chargeCount + counts.maintenanceCount,
      0,
    ),
  };
}
