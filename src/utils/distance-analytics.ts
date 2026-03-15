import {
    endOfDay,
    endOfMonth,
    format,
    isSameMonth,
    parseISO,
    startOfDay,
    startOfMonth,
    subDays,
    subMonths,
} from "date-fns";

import type { FuelLog, VehicleWithLogs } from "@/types/database";

export type DistanceCoverage = "none" | "partial" | "full";

export type DistanceDateRangeInput = {
    start: string | Date;
    end: string | Date;
};

export type DistanceSummary = {
    value: number | null;
    hasSufficientData: boolean;
    coverage: DistanceCoverage;
    contributingVehicles: number;
    totalVehicles: number;
    vehiclesWithHistory: number;
    usesBaselineFallback: boolean;
};

export type DistanceMonthlyRollup = {
    key: string;
    label: string;
    start: string;
    end: string;
    value: number;
    hasSufficientData: boolean;
    coverage: DistanceCoverage;
};

type OdometerReading = FuelLog & {
    timestamp: number;
    createdAtSortKey: string;
};

function normalizeDateBoundary(value: string | Date, boundary: "start" | "end"): number {
    const date = typeof value === "string"
        ? (value.includes("T") ? new Date(value) : parseISO(value))
        : value;

    return boundary === "start" ? startOfDay(date).getTime() : endOfDay(date).getTime();
}

function toDateKey(value: string | Date): string {
    const date = typeof value === "string" ? parseISO(value.slice(0, 10)) : value;
    return format(date, "yyyy-MM-dd");
}

function getLogTimestamp(date: string): number {
    if (date.includes("T")) {
        return new Date(date).getTime();
    }

    return parseISO(date).getTime();
}

function getSortedOdometerReadings(vehicle: VehicleWithLogs): OdometerReading[] {
    return [...(vehicle.fuel_logs ?? [])]
        .filter((log) => Number.isFinite(log.odometer))
        .map((log) => ({
            ...log,
            timestamp: getLogTimestamp(log.date),
            createdAtSortKey: log.created_at ?? "",
        }))
        .sort((left, right) => {
            if (left.timestamp !== right.timestamp) {
                return left.timestamp - right.timestamp;
            }

            if (left.odometer !== right.odometer) {
                return left.odometer - right.odometer;
            }

            const createdAtComparison = left.createdAtSortKey.localeCompare(right.createdAtSortKey);
            if (createdAtComparison !== 0) {
                return createdAtComparison;
            }

            return left.id.localeCompare(right.id);
        });
}

function findLatestReadingAtOrBefore(readings: OdometerReading[], boundary: number) {
    for (let index = readings.length - 1; index >= 0; index -= 1) {
        if (readings[index].timestamp <= boundary) {
            return readings[index];
        }
    }

    return null;
}

function findLatestReadingBefore(readings: OdometerReading[], boundary: number) {
    for (let index = readings.length - 1; index >= 0; index -= 1) {
        if (readings[index].timestamp < boundary) {
            return readings[index];
        }
    }

    return null;
}

function createEmptySummary(totalVehicles = 1, vehiclesWithHistory = 0): DistanceSummary {
    return {
        value: null,
        hasSufficientData: false,
        coverage: "none",
        contributingVehicles: 0,
        totalVehicles,
        vehiclesWithHistory,
        usesBaselineFallback: false,
    };
}

export function getVehicleDistanceSummary(
    vehicle: VehicleWithLogs,
    range: DistanceDateRangeInput,
): DistanceSummary {
    const readings = getSortedOdometerReadings(vehicle);
    if (readings.length === 0) {
        return createEmptySummary();
    }

    const startBoundary = normalizeDateBoundary(range.start, "start");
    const endBoundary = normalizeDateBoundary(range.end, "end");
    const endReading = findLatestReadingAtOrBefore(readings, endBoundary);

    if (!endReading) {
        return createEmptySummary(1, 1);
    }

    const startReading = findLatestReadingBefore(readings, startBoundary);
    const startOdometer = startReading?.odometer ?? vehicle.baseline_odometer;
    const usesBaselineFallback = !startReading;

    return {
        value: Math.max(0, endReading.odometer - startOdometer),
        hasSufficientData: true,
        coverage: usesBaselineFallback ? "partial" : "full",
        contributingVehicles: 1,
        totalVehicles: 1,
        vehiclesWithHistory: 1,
        usesBaselineFallback,
    };
}

export function getVehicleLifetimeDistanceSummary(vehicle: VehicleWithLogs): DistanceSummary {
    const readings = getSortedOdometerReadings(vehicle);
    if (readings.length === 0) {
        return createEmptySummary();
    }

    const latestReading = readings[readings.length - 1];
    return {
        value: Math.max(0, latestReading.odometer - vehicle.baseline_odometer),
        hasSufficientData: true,
        coverage: "full",
        contributingVehicles: 1,
        totalVehicles: 1,
        vehiclesWithHistory: 1,
        usesBaselineFallback: false,
    };
}

export function getGarageDistanceSummary(
    vehicles: VehicleWithLogs[],
    range: DistanceDateRangeInput,
): DistanceSummary {
    if (vehicles.length === 0) {
        return createEmptySummary(0, 0);
    }

    let totalDistance = 0;
    let contributingVehicles = 0;
    let vehiclesWithHistory = 0;
    let usesBaselineFallback = false;
    let coverage: DistanceCoverage = "full";

    for (const vehicle of vehicles) {
        const summary = getVehicleDistanceSummary(vehicle, range);
        vehiclesWithHistory += summary.vehiclesWithHistory;
        usesBaselineFallback = usesBaselineFallback || summary.usesBaselineFallback;

        if (summary.hasSufficientData && summary.value != null) {
            totalDistance += summary.value;
            contributingVehicles += 1;
        }

        if (summary.coverage !== "full") {
            coverage = summary.coverage === "none" ? "partial" : summary.coverage;
        }
    }

    if (contributingVehicles === 0) {
        return createEmptySummary(vehicles.length, vehiclesWithHistory);
    }

    if (contributingVehicles < vehicles.length) {
        coverage = "partial";
    }

    return {
        value: totalDistance,
        hasSufficientData: true,
        coverage,
        contributingVehicles,
        totalVehicles: vehicles.length,
        vehiclesWithHistory,
        usesBaselineFallback,
    };
}

export function getGarageLifetimeDistanceSummary(vehicles: VehicleWithLogs[]): DistanceSummary {
    if (vehicles.length === 0) {
        return createEmptySummary(0, 0);
    }

    let totalDistance = 0;
    let contributingVehicles = 0;
    let vehiclesWithHistory = 0;

    for (const vehicle of vehicles) {
        const summary = getVehicleLifetimeDistanceSummary(vehicle);
        vehiclesWithHistory += summary.vehiclesWithHistory;

        if (summary.hasSufficientData && summary.value != null) {
            totalDistance += summary.value;
            contributingVehicles += 1;
        }
    }

    if (contributingVehicles === 0) {
        return createEmptySummary(vehicles.length, vehiclesWithHistory);
    }

    return {
        value: totalDistance,
        hasSufficientData: true,
        coverage: contributingVehicles === vehicles.length ? "full" : "partial",
        contributingVehicles,
        totalVehicles: vehicles.length,
        vehiclesWithHistory,
        usesBaselineFallback: false,
    };
}

export function getVehicleMonthlyDistanceRollups(
    vehicle: VehicleWithLogs,
    monthCount = 12,
    endDate: Date = new Date(),
): DistanceMonthlyRollup[] {
    return Array.from({ length: monthCount }, (_, index) => {
        const monthDate = subMonths(endDate, monthCount - index - 1);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = isSameMonth(monthDate, endDate) ? endOfDay(endDate) : endOfMonth(monthDate);
        const summary = getVehicleDistanceSummary(vehicle, { start: monthStart, end: monthEnd });

        return {
            key: format(monthStart, "yyyy-MM"),
            label: format(monthStart, "MMM yy"),
            start: toDateKey(monthStart),
            end: toDateKey(monthEnd),
            value: summary.value ?? 0,
            hasSufficientData: summary.hasSufficientData,
            coverage: summary.coverage,
        };
    });
}

export function createTrailingDayRange(days: number, endDate: Date = new Date()): DistanceDateRangeInput {
    return {
        start: subDays(endDate, days),
        end: endDate,
    };
}

export function createTrailingMonthRange(months: number, endDate: Date = new Date()): DistanceDateRangeInput {
    return {
        start: subMonths(endDate, months),
        end: endDate,
    };
}
