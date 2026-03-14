import type { FuelLog, FuelLogEnergyType, FuelLogFillType } from "@/types/database";

export type FuelAnalyticsMode = FuelLogEnergyType;

export type DerivedFuelLog = FuelLog & {
    energy_type: FuelLogEnergyType;
    fill_type: FuelLogFillType;
    contributes_to_efficiency: boolean;
    derived_efficiency: number | null;
    segment_distance: number | null;
    segment_volume: number | null;
    segment_cost: number | null;
    segment_closed_at_log_id: string | null;
    pending_full: boolean;
};

export type ClosedFuelSegment = {
    energy_type: FuelAnalyticsMode;
    start_odometer: number;
    end_odometer: number;
    distance: number;
    volume: number;
    cost: number;
    closing_log_id: string;
    closing_log_date: string;
    closing_log_created_at: string;
    derived_efficiency: number;
};

export type FuelAnalyticsStream = {
    energy_type: FuelAnalyticsMode;
    logs: DerivedFuelLog[];
    closed_segments: ClosedFuelSegment[];
};

export type FuelAnalyticsResult = Record<FuelAnalyticsMode, FuelAnalyticsStream>;

type FuelLogLike = Omit<FuelLog, "energy_type" | "fill_type"> & {
    energy_type?: string | null;
    fill_type?: string | null;
};

function normalizeEnergyType(energyType?: string | null): FuelLogEnergyType {
    return energyType === "charge" ? "charge" : "fuel";
}

function normalizeFillType(fillType?: string | null): FuelLogFillType {
    return fillType === "partial" ? "partial" : "full";
}

function normalizeCreatedAt(createdAt?: string | null): string {
    return createdAt ?? "";
}

function sortLogs(logs: FuelLog[]): FuelLog[] {
    return [...logs].sort((left, right) => {
        const byDate = new Date(left.date).getTime() - new Date(right.date).getTime();
        if (byDate !== 0) return byDate;

        const byOdometer = left.odometer - right.odometer;
        if (byOdometer !== 0) return byOdometer;

        const byCreatedAt = normalizeCreatedAt(left.created_at).localeCompare(normalizeCreatedAt(right.created_at));
        if (byCreatedAt !== 0) return byCreatedAt;

        return left.id.localeCompare(right.id);
    });
}

function buildStream(logs: FuelLog[], baselineOdometer: number, energyType: FuelAnalyticsMode): FuelAnalyticsStream {
    const sortedLogs = sortLogs(logs).map<DerivedFuelLog>((log) => ({
        ...log,
        energy_type: normalizeEnergyType(log.energy_type),
        fill_type: normalizeFillType(log.fill_type),
        contributes_to_efficiency: false,
        derived_efficiency: null,
        segment_distance: null,
        segment_volume: null,
        segment_cost: null,
        segment_closed_at_log_id: null,
        pending_full: false,
    }));

    const closedSegments: ClosedFuelSegment[] = [];
    let pendingIndexes: number[] = [];
    let boundaryOdometer = baselineOdometer;

    for (let index = 0; index < sortedLogs.length; index += 1) {
        const log = sortedLogs[index];
        pendingIndexes.push(index);

        if (log.fill_type !== "full") {
            continue;
        }

        const segmentLogs = pendingIndexes.map((pendingIndex) => sortedLogs[pendingIndex]);
        const segmentVolume = segmentLogs.reduce((sum, segmentLog) => sum + segmentLog.fuel_volume, 0);
        const segmentCost = segmentLogs.reduce((sum, segmentLog) => sum + segmentLog.total_cost, 0);
        const segmentDistance = log.odometer - boundaryOdometer;
        const derivedEfficiency = segmentDistance > 0 && segmentVolume > 0
            ? Number((segmentDistance / segmentVolume).toFixed(6))
            : null;

        for (const pendingIndex of pendingIndexes) {
            sortedLogs[pendingIndex].segment_closed_at_log_id = log.id;
        }

        if (derivedEfficiency != null) {
            log.contributes_to_efficiency = true;
            log.derived_efficiency = derivedEfficiency;
            log.segment_distance = segmentDistance;
            log.segment_volume = segmentVolume;
            log.segment_cost = segmentCost;

            closedSegments.push({
                energy_type: energyType,
                start_odometer: boundaryOdometer,
                end_odometer: log.odometer,
                distance: segmentDistance,
                volume: segmentVolume,
                cost: segmentCost,
                closing_log_id: log.id,
                closing_log_date: log.date,
                closing_log_created_at: normalizeCreatedAt(log.created_at),
                derived_efficiency: derivedEfficiency,
            });
        }

        boundaryOdometer = log.odometer;
        pendingIndexes = [];
    }

    for (const pendingIndex of pendingIndexes) {
        sortedLogs[pendingIndex].pending_full = true;
        sortedLogs[pendingIndex].segment_closed_at_log_id = null;
    }

    return {
        energy_type: energyType,
        logs: sortedLogs,
        closed_segments: closedSegments,
    };
}

export function buildFuelAnalytics(logs: FuelLogLike[], baselineOdometer: number): FuelAnalyticsResult {
    const normalizedLogs: FuelLog[] = logs.map((log) => ({
        ...log,
        energy_type: normalizeEnergyType(log.energy_type),
        fill_type: normalizeFillType(log.fill_type),
        created_at: normalizeCreatedAt(log.created_at),
    }));

    const fuelLogs = normalizedLogs.filter((log) => log.energy_type === "fuel");
    const chargeLogs = normalizedLogs.filter((log) => log.energy_type === "charge");

    return {
        fuel: buildStream(fuelLogs, baselineOdometer, "fuel"),
        charge: buildStream(chargeLogs, baselineOdometer, "charge"),
    };
}
