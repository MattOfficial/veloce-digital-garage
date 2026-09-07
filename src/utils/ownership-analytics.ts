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

export function getOwnershipCostSummary(
  vehicle: VehicleWithLogs,
  currentDate: Date = new Date(),
  monthCount = 6,
): OwnershipCostSummary {
  const today = startOfDay(currentDate);
  const currentPeriodEnd = addDays(today, 1);
  const trackedDistance = Math.max(
    0,
    getVehicleCurrentOdometer(vehicle) - vehicle.baseline_odometer,
  );

  const currentPeriodStart = subDays(today, 29);
  const previousPeriodStart = subDays(currentPeriodStart, 30);
  let currentPeriodCost = 0;
  let previousPeriodCost = 0;
  const totals: Record<OwnershipCostCategory, number> = {
    fuel: 0,
    maintenance: 0,
    other: 0,
  };

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

  // Parse each date once and accumulate all summaries in the same pass.
  for (const event of getCostEvents(vehicle)) {
    const date = parseLogDate(event.date);
    if (!date || date >= currentPeriodEnd) continue;

    totals[event.category] += event.cost;
    if (date >= currentPeriodStart) {
      currentPeriodCost += event.cost;
    } else if (date >= previousPeriodStart) {
      previousPeriodCost += event.cost;
    }

    const month = monthMap.get(format(date, "yyyy-MM"));
    if (!month) continue;
    month[event.category] += event.cost;
    month.total += event.cost;
  }

  const { fuel: totalFuelCost, maintenance: totalMaintenanceCost, other: totalOtherCost } = totals;
  const totalCost = totalFuelCost + totalMaintenanceCost + totalOtherCost;

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
