import { format, isValid, parseISO, subDays } from "date-fns";

import type { ChargeSource, FuelLog, VehicleWithLogs } from "@/types/database";
import {
    createTrailingDayRange,
    getVehicleDistanceSummary,
    getVehicleLifetimeDistanceSummary,
} from "@/utils/distance-analytics";

/**
 * Energy accounting for grid-charged vehicles.
 *
 * Home charging is not logged: there is no pump, no receipt, and no kWh reading
 * the owner can see. It is inferred instead, as `distance x Wh/km` minus the
 * energy that was logged at public chargers, then costed at the user's tariff.
 * Public charging is a real event with a real receipt and stays event-logged.
 *
 * Every figure that leans on inference carries a `basis` so the UI can label it
 * as an estimate rather than presenting it as measured.
 */

export const CHARGE_SOURCES: ChargeSource[] = ["home", "ac_public", "dc_fast", "other"];

const DEFAULT_PERIOD_DAYS = 30;
/** Below this the pack sits at a stressful state of charge. */
const DEEP_DISCHARGE_SOC = 20;
/** Charging this high routinely accelerates calendar ageing. */
const FULL_CHARGE_SOC = 98;
const MIN_CARE_OBSERVATIONS = 5;

const DEEP_DISCHARGE_PENALTY = 30;
const FULL_CHARGE_PENALTY = 25;
const DC_FAST_PENALTY = 25;

export type EnergyCostBasis =
    | "measured"
    | "partially-inferred"
    | "inferred"
    | "unavailable";

export type BatteryCareBand =
    | "excellent"
    | "good"
    | "fair"
    | "poor"
    | "insufficient-data";

export interface ChargingMixEntry {
    source: ChargeSource;
    energyKwh: number;
    cost: number;
    sessionCount: number;
    /** Share of total energy, 0-1. */
    share: number;
    isEstimated: boolean;
}

export interface ChargingMix {
    entries: ChargingMixEntry[];
    totalEnergyKwh: number;
    totalCost: number;
    /** Fast charging is the strongest behavioural input to degradation. */
    dcFastShare: number | null;
    homeShare: number | null;
}

export interface EvEnergyPeriod {
    startDate: string | null;
    endDate: string;
    days: number | null;
    distance: number | null;
    loggedEnergyKwh: number;
    loggedCost: number;
    inferredHomeEnergyKwh: number | null;
    inferredHomeCost: number | null;
    totalEnergyKwh: number | null;
    totalCost: number | null;
    costPerDistance: number | null;
    basis: EnergyCostBasis;
}

export interface EvSavingsSummary {
    distance: number | null;
    evEnergyCost: number | null;
    equivalentIceCost: number | null;
    savings: number | null;
    savingsPerDistance: number | null;
}

export interface BatteryCareSummary {
    score: number | null;
    band: BatteryCareBand;
    deepDischargeCount: number;
    fullChargeCount: number;
    dcFastShare: number | null;
    observationCount: number;
}

export interface EvEnergySummary {
    period: EvEnergyPeriod;
    mix: ChargingMix;
    savings: EvSavingsSummary;
    care: BatteryCareSummary;
    whPerKm: number | null;
}

export interface EvEnergyOptions {
    /** Measured from battery health, or seeded from a model catalogue. */
    whPerKm?: number | null;
    tariffPerKwh?: number | null;
    petrolPricePerUnit?: number | null;
    /** Reference ICE economy in distance per unit volume, e.g. km/L. */
    iceReferenceEfficiency?: number | null;
    periodDays?: number;
    currentDate?: Date;
}

function parseLogDate(value: string): Date | null {
    const parsed = parseISO(value.slice(0, 10));
    return isValid(parsed) ? parsed : null;
}

function isChargeLog(log: FuelLog): boolean {
    return log.energy_type === "charge";
}

function sumBy<T>(items: T[], select: (item: T) => number): number {
    return items.reduce((total, item) => {
        const value = select(item);
        return total + (Number.isFinite(value) ? value : 0);
    }, 0);
}

function filterLogsInRange(
    logs: FuelLog[],
    start: Date | null,
    end: Date,
): FuelLog[] {
    return logs.filter((log) => {
        const date = parseLogDate(log.date);
        if (!date) return false;
        if (date > end) return false;
        return start == null || date >= start;
    });
}

function buildChargingMix(
    chargeLogs: FuelLog[],
    inferredHomeEnergyKwh: number | null,
    inferredHomeCost: number | null,
): ChargingMix {
    const totals = new Map<ChargeSource, { energyKwh: number; cost: number; sessionCount: number }>();

    for (const source of CHARGE_SOURCES) {
        totals.set(source, { energyKwh: 0, cost: 0, sessionCount: 0 });
    }

    for (const log of chargeLogs) {
        const source: ChargeSource = log.charge_source ?? "other";
        const bucket = totals.get(source) ?? { energyKwh: 0, cost: 0, sessionCount: 0 };
        bucket.energyKwh += Number.isFinite(log.fuel_volume) ? log.fuel_volume : 0;
        bucket.cost += Number.isFinite(log.total_cost) ? log.total_cost : 0;
        bucket.sessionCount += 1;
        totals.set(source, bucket);
    }

    // Inferred home energy folds into the home bucket. It has no session count:
    // it represents an unknown number of overnight plug-ins, not one event.
    const homeBucket = totals.get("home") ?? { energyKwh: 0, cost: 0, sessionCount: 0 };
    const hasInferredHome = inferredHomeEnergyKwh != null && inferredHomeEnergyKwh > 0;

    if (hasInferredHome) {
        homeBucket.energyKwh += inferredHomeEnergyKwh;
        homeBucket.cost += inferredHomeCost ?? 0;
        totals.set("home", homeBucket);
    }

    const totalEnergyKwh = sumBy(Array.from(totals.values()), (bucket) => bucket.energyKwh);
    const totalCost = sumBy(Array.from(totals.values()), (bucket) => bucket.cost);

    const entries: ChargingMixEntry[] = CHARGE_SOURCES.map((source) => {
        const bucket = totals.get(source) ?? { energyKwh: 0, cost: 0, sessionCount: 0 };

        return {
            source,
            energyKwh: bucket.energyKwh,
            cost: bucket.cost,
            sessionCount: bucket.sessionCount,
            share: totalEnergyKwh > 0 ? bucket.energyKwh / totalEnergyKwh : 0,
            isEstimated: source === "home" && hasInferredHome,
        };
    });

    const dcFast = entries.find((entry) => entry.source === "dc_fast");
    const home = entries.find((entry) => entry.source === "home");

    return {
        entries,
        totalEnergyKwh,
        totalCost,
        dcFastShare: totalEnergyKwh > 0 ? (dcFast?.share ?? 0) : null,
        homeShare: totalEnergyKwh > 0 ? (home?.share ?? 0) : null,
    };
}

function resolveBasis(
    loggedEnergyKwh: number,
    inferredHomeEnergyKwh: number | null,
): EnergyCostBasis {
    const hasInferred = inferredHomeEnergyKwh != null && inferredHomeEnergyKwh > 0;

    if (loggedEnergyKwh > 0 && hasInferred) return "partially-inferred";
    if (hasInferred) return "inferred";
    if (loggedEnergyKwh > 0) return "measured";

    return "unavailable";
}

function buildSavings(
    distance: number | null,
    evEnergyCost: number | null,
    petrolPricePerUnit: number | null,
    iceReferenceEfficiency: number | null,
): EvSavingsSummary {
    const canCompare =
        distance != null &&
        distance > 0 &&
        evEnergyCost != null &&
        petrolPricePerUnit != null &&
        petrolPricePerUnit > 0 &&
        iceReferenceEfficiency != null &&
        iceReferenceEfficiency > 0;

    if (!canCompare) {
        return {
            distance,
            evEnergyCost,
            equivalentIceCost: null,
            savings: null,
            savingsPerDistance: null,
        };
    }

    const equivalentIceCost = (distance / iceReferenceEfficiency) * petrolPricePerUnit;
    const savings = equivalentIceCost - evEnergyCost;

    return {
        distance,
        evEnergyCost,
        equivalentIceCost,
        savings,
        savingsPerDistance: savings / distance,
    };
}

/**
 * A coaching metric, not a diagnostic one. It scores the three behaviours the
 * owner actually controls: sitting at a low state of charge, routinely charging
 * to 100%, and leaning on DC fast charging.
 */
export function buildBatteryCareSummary(
    vehicle: VehicleWithLogs,
    chargeLogs: FuelLog[],
    dcFastShare: number | null,
): BatteryCareSummary {
    const snapshotsWithSoc = (vehicle.vehicle_snapshots ?? []).filter(
        (snapshot) => snapshot.soc_percent != null,
    );
    const chargesWithEndSoc = chargeLogs.filter((log) => log.end_soc != null);

    const deepDischargeCount = snapshotsWithSoc.filter(
        (snapshot) => (snapshot.soc_percent as number) < DEEP_DISCHARGE_SOC,
    ).length;
    const fullChargeCount = chargesWithEndSoc.filter(
        (log) => (log.end_soc as number) >= FULL_CHARGE_SOC,
    ).length;

    const observationCount = snapshotsWithSoc.length + chargesWithEndSoc.length;

    if (observationCount < MIN_CARE_OBSERVATIONS) {
        return {
            score: null,
            band: "insufficient-data",
            deepDischargeCount,
            fullChargeCount,
            dcFastShare,
            observationCount,
        };
    }

    const deepDischargeRate =
        snapshotsWithSoc.length > 0 ? deepDischargeCount / snapshotsWithSoc.length : 0;
    const fullChargeRate =
        chargesWithEndSoc.length > 0 ? fullChargeCount / chargesWithEndSoc.length : 0;

    const penalty =
        deepDischargeRate * DEEP_DISCHARGE_PENALTY +
        fullChargeRate * FULL_CHARGE_PENALTY +
        (dcFastShare ?? 0) * DC_FAST_PENALTY;

    const score = Math.max(0, Math.min(100, 100 - penalty));

    let band: BatteryCareBand = "poor";
    if (score >= 85) band = "excellent";
    else if (score >= 70) band = "good";
    else if (score >= 50) band = "fair";

    return {
        score,
        band,
        deepDischargeCount,
        fullChargeCount,
        dcFastShare,
        observationCount,
    };
}

function buildSummary(
    vehicle: VehicleWithLogs,
    distance: number | null,
    chargeLogs: FuelLog[],
    startDate: Date | null,
    endDate: Date,
    days: number | null,
    options: EvEnergyOptions,
): EvEnergySummary {
    const {
        whPerKm = null,
        tariffPerKwh = null,
        petrolPricePerUnit = null,
        iceReferenceEfficiency = null,
    } = options;

    const loggedEnergyKwh = sumBy(chargeLogs, (log) => log.fuel_volume);
    const loggedCost = sumBy(chargeLogs, (log) => log.total_cost);

    // Total energy for the period follows from distance and efficiency. Anything
    // not accounted for by a logged public session is assumed to be home charging.
    const totalEnergyFromDistance =
        whPerKm != null && whPerKm > 0 && distance != null && distance > 0
            ? (distance * whPerKm) / 1000
            : null;

    const inferredHomeEnergyKwh =
        totalEnergyFromDistance != null
            ? Math.max(0, totalEnergyFromDistance - loggedEnergyKwh)
            : null;

    const inferredHomeCost =
        inferredHomeEnergyKwh != null && tariffPerKwh != null && tariffPerKwh > 0
            ? inferredHomeEnergyKwh * tariffPerKwh
            : null;

    const totalEnergyKwh =
        inferredHomeEnergyKwh != null
            ? loggedEnergyKwh + inferredHomeEnergyKwh
            : loggedEnergyKwh > 0
                ? loggedEnergyKwh
                : null;

    const hasCost = loggedCost > 0 || inferredHomeCost != null;
    const totalCost = hasCost ? loggedCost + (inferredHomeCost ?? 0) : null;

    const mix = buildChargingMix(chargeLogs, inferredHomeEnergyKwh, inferredHomeCost);

    return {
        period: {
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
            endDate: format(endDate, "yyyy-MM-dd"),
            days,
            distance,
            loggedEnergyKwh,
            loggedCost,
            inferredHomeEnergyKwh,
            inferredHomeCost,
            totalEnergyKwh,
            totalCost,
            costPerDistance:
                totalCost != null && distance != null && distance > 0
                    ? totalCost / distance
                    : null,
            basis: resolveBasis(loggedEnergyKwh, inferredHomeEnergyKwh),
        },
        mix,
        savings: buildSavings(distance, totalCost, petrolPricePerUnit, iceReferenceEfficiency),
        care: buildBatteryCareSummary(vehicle, chargeLogs, mix.dcFastShare),
        whPerKm,
    };
}

export function buildEvEnergySummary(
    vehicle: VehicleWithLogs,
    options: EvEnergyOptions = {},
): EvEnergySummary {
    const { periodDays = DEFAULT_PERIOD_DAYS, currentDate = new Date() } = options;

    const range = createTrailingDayRange(periodDays, currentDate);
    const distance = getVehicleDistanceSummary(vehicle, range).value;
    const startDate = subDays(currentDate, periodDays);
    const chargeLogs = filterLogsInRange(
        (vehicle.fuel_logs ?? []).filter(isChargeLog),
        startDate,
        currentDate,
    );

    return buildSummary(
        vehicle,
        distance,
        chargeLogs,
        startDate,
        currentDate,
        periodDays,
        options,
    );
}

export function buildEvLifetimeEnergySummary(
    vehicle: VehicleWithLogs,
    options: EvEnergyOptions = {},
): EvEnergySummary {
    const { currentDate = new Date() } = options;

    const distance = getVehicleLifetimeDistanceSummary(vehicle).value;
    const chargeLogs = (vehicle.fuel_logs ?? []).filter(isChargeLog);

    return buildSummary(vehicle, distance, chargeLogs, null, currentDate, null, options);
}

/**
 * kWh delivered by a public session, derived from the SoC it added when the
 * charger did not report energy directly.
 */
export function deriveEnergyFromSocDelta(
    startSoc: number | null,
    endSoc: number | null,
    usableBatteryKwh: number | null,
): number | null {
    if (
        startSoc == null ||
        endSoc == null ||
        usableBatteryKwh == null ||
        usableBatteryKwh <= 0 ||
        endSoc <= startSoc
    ) {
        return null;
    }

    return ((endSoc - startSoc) / 100) * usableBatteryKwh;
}
