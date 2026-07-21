import {
  addDays,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

import type { VehicleWithLogs } from "@/types/database";
import { getVehicleCurrentOdometer } from "@/utils/vehicle-metrics";

export type OwnershipCostCategory = "fuel" | "maintenance" | "other";

export type OwnershipMonthlyCost = {
  key: string;
  label: string;
  fuel: number;
  maintenance: number;
  other: number;
  total: number;
};

export type OwnershipCostSummary = {
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOtherCost: number;
  totalCost: number;
  trackedDistance: number;
  costPerDistance: number | null;
  currentPeriodCost: number;
  previousPeriodCost: number;
  periodTrendPercent: number | null;
  monthlyCosts: OwnershipMonthlyCost[];
};

type CostEvent = {
  date: string;
  category: OwnershipCostCategory;
  cost: number;
};

function parseLogDate(value: string) {
  const parsed = parseISO(value.slice(0, 10));
  return isValid(parsed) ? parsed : null;
}

function getCostEvents(vehicle: VehicleWithLogs): CostEvent[] {
  return [
    ...(vehicle.fuel_logs ?? []).map((log) => ({
      date: log.date,
      category: "fuel" as const,
      cost: Number.isFinite(log.total_cost) ? log.total_cost : 0,
    })),
    ...(vehicle.maintenance_logs ?? []).map((log) => ({
      date: log.date,
      category: "maintenance" as const,
      cost: Number.isFinite(log.cost) ? log.cost : 0,
    })),
    ...(vehicle.custom_logs ?? []).map((log) => ({
      date: log.date,
      category: "other" as const,
      cost: Number.isFinite(log.cost) ? (log.cost ?? 0) : 0,
    })),
  ];
}

function sumEventsInRange(events: CostEvent[], start: Date, endExclusive: Date) {
  return events.reduce((total, event) => {
    const date = parseLogDate(event.date);
    if (!date || date < start || date >= endExclusive) return total;
    return total + event.cost;
  }, 0);
}

export function getOwnershipCostSummary(
  vehicle: VehicleWithLogs,
  currentDate: Date = new Date(),
  monthCount = 6,
): OwnershipCostSummary {
  const events = getCostEvents(vehicle);
  const totalFuelCost = events
    .filter((event) => event.category === "fuel")
    .reduce((total, event) => total + event.cost, 0);
  const totalMaintenanceCost = events
    .filter((event) => event.category === "maintenance")
    .reduce((total, event) => total + event.cost, 0);
  const totalOtherCost = events
    .filter((event) => event.category === "other")
    .reduce((total, event) => total + event.cost, 0);
  const totalCost = totalFuelCost + totalMaintenanceCost + totalOtherCost;

  const trackedDistance = Math.max(
    0,
    getVehicleCurrentOdometer(vehicle) - vehicle.baseline_odometer,
  );

  const today = startOfDay(currentDate);
  const currentPeriodStart = subDays(today, 29);
  const currentPeriodEnd = addDays(today, 1);
  const previousPeriodStart = subDays(currentPeriodStart, 30);
  const currentPeriodCost = sumEventsInRange(
    events,
    currentPeriodStart,
    currentPeriodEnd,
  );
  const previousPeriodCost = sumEventsInRange(
    events,
    previousPeriodStart,
    currentPeriodStart,
  );

  const normalizedMonthCount = Math.max(1, Math.floor(monthCount));
  const monthlyCosts = Array.from(
    { length: normalizedMonthCount },
    (_, index): OwnershipMonthlyCost => {
      const monthDate = startOfMonth(
        subMonths(currentDate, normalizedMonthCount - index - 1),
      );
      return {
        key: format(monthDate, "yyyy-MM"),
        label: format(monthDate, "MMM"),
        fuel: 0,
        maintenance: 0,
        other: 0,
        total: 0,
      };
    },
  );
  const monthMap = new Map(monthlyCosts.map((month) => [month.key, month]));

  for (const event of events) {
    const date = parseLogDate(event.date);
    if (!date) continue;
    const month = monthMap.get(format(date, "yyyy-MM"));
    if (!month) continue;
    month[event.category] += event.cost;
    month.total += event.cost;
  }

  return {
    totalFuelCost,
    totalMaintenanceCost,
    totalOtherCost,
    totalCost,
    trackedDistance,
    costPerDistance: trackedDistance > 0 ? totalCost / trackedDistance : null,
    currentPeriodCost,
    previousPeriodCost,
    periodTrendPercent:
      previousPeriodCost > 0
        ? ((currentPeriodCost - previousPeriodCost) / previousPeriodCost) * 100
        : null,
    monthlyCosts,
  };
}
