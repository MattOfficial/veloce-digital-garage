import { format, isValid, parseISO, subDays } from "date-fns";

import type { ChargeSource, FuelLog, VehicleWithLogs } from "@/types/database";
import {
    getSocDelta,
    isFullChargeSession,
    measurePackCapacity,
    type PackCapacityMeasurement,
} from "@/utils/charge-session";
import {
    createTrailingDayRange,
    getVehicleDistanceSummary,
    getVehicleLifetimeDistanceSummary,
} from "@/utils/distance-analytics";
import { consistencyScore, getOutlierBounds, median } from "@/utils/statistics";

/**
 * Energy accounting for grid-charged vehicles.
 *
 * Every charge is a logged event, home included: a home charger sits on a meter
 * the owner can read, so asking for the units beats inferring them from
 * `distance x Wh/km`. Inference survives only as a labelled cold-start fallback
 * for a period with nothing logged in it. See docs/ev-charging-redesign.md.
 *
 * Efficiency comes from the driving *between* two sessions, with the closing
 * session's energy rescaled by the state of charge that driving actually
 * consumed. That needs no full charge — and collapses to the classic full-tank
 * method when both sessions happen to end at 100%.
 */

export const CHARGE_SOURCES: ChargeSource[] = ["home", "ac_public", "dc_fast", "other"];

const DEFAULT_PERIOD_DAYS = 30;
/** Below this the pack sits at a stressful state of charge. */
const DEEP_DISCHARGE_SOC = 20;
const MIN_CARE_OBSERVATIONS = 5;
const MIN_SEGMENTS_FOR_ESTIMATE = 2;
const HIGH_CONFIDENCE_SEGMENTS = 5;
const HIGH_CONFIDENCE_CONSISTENCY = 60;

const DEEP_DISCHARGE_PENALTY = 30;
const FULL_CHARGE_PENALTY = 25;
const DC_FAST_PENALTY = 25;

/**
 * A session cannot plausibly be credited with more than this multiple of the
 * charge it delivered. Beyond it, an unlogged session almost certainly sits
 * inside the segment.
 */
const MAX_SOC_ATTRIBUTION_RATIO = 4;

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

/**
 * How a segment established its reference point. `soc-corrected` needs nothing
 * from the owner beyond two percentages; `full-charge-anchor` is the degraded
 * mode for sessions logged without them.
 */
export type ChargeSegmentMethod = "soc-corrected" | "full-charge-anchor";

export type ChargeSegmentRejection = "no-distance" | "no-energy" | "outlier";

export interface ChargeSegment {
    startLogId: string;
    endLogId: string;
    startDate: string;
    endDate: string;
    startOdometer: number;
    endOdometer: number;
    distance: number;
    /** Energy attributed to this stretch of driving, at the meter. */
    energyKwh: number;
    cost: number;
    method: ChargeSegmentMethod;
    distancePerKwh: number;
    costPerDistance: number;
    usable: boolean;
    rejection: ChargeSegmentRejection | null;
}

export type ChargeEfficiencyConfidence = "none" | "low" | "medium" | "high";

export interface ChargeEfficiencySummary {
    segments: ChargeSegment[];
    usableSegmentCount: number;
    /** Median across usable segments, using energy as billed. */
    distancePerKwh: number | null;
    costPerDistance: number | null;
    /** Null when methods are mixed across segments. */
    method: ChargeSegmentMethod | null;
    confidence: ChargeEfficiencyConfidence;
    consistencyScore: number | null;
    /** Sessions that produced no segment because nothing anchored them. */
    unanchoredSessionCount: number;
}

export interface PackCapacitySummary {
    measurements: PackCapacityMeasurement[];
    /** Upper bounds: metered energy includes losses that never reached the pack. */
    latestApparentKwh: number | null;
    baselineApparentKwh: number | null;
    stateOfHealthPercent: number | null;
}

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
    sessionCount: number;
    /** Cold start only: nothing was logged, so distance and efficiency stood in. */
    inferredEnergyKwh: number | null;
    inferredCost: number | null;
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
    efficiency: ChargeEfficiencySummary;
    capacity: PackCapacitySummary;
    /** Pack-level consumption, from battery health rather than from the meter. */
    whPerKm: number | null;
}

export interface EvEnergyOptions {
    /** Pack-level consumption, measured from SoC snapshots or seeded from a catalogue. */
    whPerKm?: number | null;
    /** Used only for the cold-start fallback and to derive kWh for timed sessions. */
    tariffPerKwh?: number | null;
    usableBatteryKwh?: number | null;
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

function finiteOrZero(value: number | null | undefined): number {
    return value != null && Number.isFinite(value) ? value : 0;
}

function sortChargeLogs(logs: FuelLog[]): FuelLog[] {
    return [...logs].sort((left, right) => {
        const byDate = new Date(left.date).getTime() - new Date(right.date).getTime();
        if (byDate !== 0) return byDate;

        const byOdometer = left.odometer - right.odometer;
        if (byOdometer !== 0) return byOdometer;

        return (left.created_at ?? "").localeCompare(right.created_at ?? "");
    });
}

function filterLogsInRange(logs: FuelLog[], start: Date | null, end: Date): FuelLog[] {
    return logs.filter((log) => {
        const date = parseLogDate(log.date);
        if (!date) return false;
        if (date > end) return false;
        return start == null || date >= start;
    });
}

interface AttributedEnergy {
    energyKwh: number;
    cost: number;
}

/**
 * Rescales a session's energy and cost to cover exactly the driving that
 * preceded it.
 *
 * `socUsed / socAdded` is the whole trick. When the driving burned as much
 * charge as the session put back — which is what happens when both sessions end
 * at 100% — the ratio is 1 and this is the full-tank method. Every other case
 * is handled by the same expression, which is why a full charge is never
 * required.
 */
function attributeBySocDelta(
    previous: FuelLog,
    current: FuelLog,
): AttributedEnergy | null {
    if (previous.end_soc == null || current.start_soc == null) return null;

    const socUsed = previous.end_soc - current.start_soc;
    const socAdded = getSocDelta(current.start_soc, current.end_soc);

    if (socUsed <= 0 || socAdded == null) return null;
    if (socUsed / socAdded > MAX_SOC_ATTRIBUTION_RATIO) return null;

    const energy = finiteOrZero(current.fuel_volume);
    if (energy <= 0) return null;

    const ratio = socUsed / socAdded;

    return {
        energyKwh: energy * ratio,
        cost: finiteOrZero(current.total_cost) * ratio,
    };
}

/**
 * Pairs charge sessions into segments of driving.
 *
 * The walk is sequential and the segments never overlap. A segment closes as
 * soon as the state of charge can attribute energy to it; failing that, it stays
 * open — accumulating energy and cost — until two full charges bracket it, which
 * is the only reference point available without percentages.
 */
export function buildChargeSegments(logs: FuelLog[]): ChargeSegment[] {
    const sorted = sortChargeLogs(logs.filter(isChargeLog));
    const segments: ChargeSegment[] = [];

    let anchorIndex = 0;
    let pendingEnergy = 0;
    let pendingCost = 0;

    for (let index = 1; index < sorted.length; index += 1) {
        const previous = sorted[index - 1];
        const current = sorted[index];

        pendingEnergy += finiteOrZero(current.fuel_volume);
        pendingCost += finiteOrZero(current.total_cost);

        const anchor = sorted[anchorIndex];
        const distance = current.odometer - anchor.odometer;

        // SoC attribution reads the charge left at the end of the previous
        // session, so it only holds when that session directly precedes.
        const attributed =
            anchorIndex === index - 1 ? attributeBySocDelta(previous, current) : null;

        const closable =
            attributed ?? (isFullChargeSession(anchor) && isFullChargeSession(current)
                ? { energyKwh: pendingEnergy, cost: pendingCost }
                : null);

        if (closable == null) continue;

        const method: ChargeSegmentMethod =
            attributed != null ? "soc-corrected" : "full-charge-anchor";

        const rejection: ChargeSegmentRejection | null =
            distance <= 0 ? "no-distance" : closable.energyKwh <= 0 ? "no-energy" : null;

        segments.push({
            startLogId: anchor.id,
            endLogId: current.id,
            startDate: anchor.date,
            endDate: current.date,
            startOdometer: anchor.odometer,
            endOdometer: current.odometer,
            distance,
            energyKwh: closable.energyKwh,
            cost: closable.cost,
            method,
            distancePerKwh: rejection == null ? distance / closable.energyKwh : 0,
            costPerDistance: rejection == null ? closable.cost / distance : 0,
            usable: rejection == null,
            rejection,
        });

        anchorIndex = index;
        pendingEnergy = 0;
        pendingCost = 0;
    }

    return flagOutliers(segments);
}

/**
 * A session logged somewhere in the middle of a segment moves the apparent
 * efficiency far further than terrain, load or riding style ever do.
 */
function flagOutliers(segments: ChargeSegment[]): ChargeSegment[] {
    const usableRates = segments
        .filter((segment) => segment.usable)
        .map((segment) => segment.distancePerKwh);

    if (usableRates.length < MIN_SEGMENTS_FOR_ESTIMATE + 1) return segments;

    const bounds = getOutlierBounds(usableRates);
    if (bounds == null) return segments;

    return segments.map((segment) => {
        if (!segment.usable) return segment;
        if (Math.abs(segment.distancePerKwh - bounds.center) <= bounds.limit) return segment;

        return { ...segment, usable: false, rejection: "outlier" as const };
    });
}

function resolveEfficiencyConfidence(
    usableSegmentCount: number,
    consistency: number | null,
): ChargeEfficiencyConfidence {
    if (usableSegmentCount === 0) return "none";
    if (usableSegmentCount < MIN_SEGMENTS_FOR_ESTIMATE) return "low";

    if (
        usableSegmentCount >= HIGH_CONFIDENCE_SEGMENTS &&
        consistency != null &&
        consistency >= HIGH_CONFIDENCE_CONSISTENCY
    ) {
        return "high";
    }

    return "medium";
}

export function summarizeChargeEfficiency(logs: FuelLog[]): ChargeEfficiencySummary {
    const segments = buildChargeSegments(logs);
    const usable = segments.filter((segment) => segment.usable);
    const rates = usable.map((segment) => segment.distancePerKwh);
    const consistency = consistencyScore(rates);

    const methods = new Set(usable.map((segment) => segment.method));
    const chargeSessionCount = logs.filter(isChargeLog).length;

    return {
        segments,
        usableSegmentCount: usable.length,
        distancePerKwh: usable.length >= MIN_SEGMENTS_FOR_ESTIMATE ? median(rates) : null,
        costPerDistance:
            usable.length >= MIN_SEGMENTS_FOR_ESTIMATE
                ? median(usable.map((segment) => segment.costPerDistance))
                : null,
        method: methods.size === 1 ? [...methods][0] : null,
        confidence: resolveEfficiencyConfidence(usable.length, consistency),
        consistencyScore: consistency,
        // The first session opens a segment rather than closing one, so it is
        // never unanchored just for being first.
        unanchoredSessionCount: Math.max(
            0,
            chargeSessionCount - segments.length - (chargeSessionCount > 0 ? 1 : 0),
        ),
    };
}

/**
 * Pack capacity over time, from sessions that ran up to a full charge.
 *
 * This is the one metric a 100% charge genuinely buys, and it is state of health
 * measured in kWh rather than inferred from range.
 */
export function summarizePackCapacity(logs: FuelLog[]): PackCapacitySummary {
    const measurements = sortChargeLogs(logs.filter(isChargeLog))
        .map(measurePackCapacity)
        .filter((measurement): measurement is PackCapacityMeasurement => measurement != null);

    if (measurements.length === 0) {
        return {
            measurements,
            latestApparentKwh: null,
            baselineApparentKwh: null,
            stateOfHealthPercent: null,
        };
    }

    const latest = measurements[measurements.length - 1].apparentUsableKwh;
    const baseline = measurements[0].apparentUsableKwh;

    return {
        measurements,
        latestApparentKwh: latest,
        baselineApparentKwh: baseline,
        // Two measurements is the minimum that says anything about a change.
        stateOfHealthPercent:
            measurements.length >= 2 && baseline > 0 ? (latest / baseline) * 100 : null,
    };
}

function buildChargingMix(
    chargeLogs: FuelLog[],
    inferredEnergyKwh: number | null,
    inferredCost: number | null,
): ChargingMix {
    const totals = new Map<
        ChargeSource,
        { energyKwh: number; cost: number; sessionCount: number }
    >(CHARGE_SOURCES.map((source) => [source, { energyKwh: 0, cost: 0, sessionCount: 0 }]));

    for (const log of chargeLogs) {
        const source: ChargeSource = log.charge_source ?? "other";
        const bucket = totals.get(source) ?? { energyKwh: 0, cost: 0, sessionCount: 0 };
        bucket.energyKwh += finiteOrZero(log.fuel_volume);
        bucket.cost += finiteOrZero(log.total_cost);
        bucket.sessionCount += 1;
        totals.set(source, bucket);
    }

    // Cold-start energy is assumed to be home charging, and carries no session
    // count: it stands for an unknown number of plug-ins, not one event.
    const hasInferred = inferredEnergyKwh != null && inferredEnergyKwh > 0;

    if (hasInferred) {
        const homeBucket = totals.get("home") ?? { energyKwh: 0, cost: 0, sessionCount: 0 };
        homeBucket.energyKwh += inferredEnergyKwh;
        homeBucket.cost += inferredCost ?? 0;
        totals.set("home", homeBucket);
    }

    const totalEnergyKwh = sumBy([...totals.values()], (bucket) => bucket.energyKwh);
    const totalCost = sumBy([...totals.values()], (bucket) => bucket.cost);

    const entries: ChargingMixEntry[] = CHARGE_SOURCES.map((source) => {
        const bucket = totals.get(source) ?? { energyKwh: 0, cost: 0, sessionCount: 0 };

        return {
            source,
            energyKwh: bucket.energyKwh,
            cost: bucket.cost,
            sessionCount: bucket.sessionCount,
            share: totalEnergyKwh > 0 ? bucket.energyKwh / totalEnergyKwh : 0,
            isEstimated: source === "home" && hasInferred,
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
    inferredEnergyKwh: number | null,
): EnergyCostBasis {
    const hasInferred = inferredEnergyKwh != null && inferredEnergyKwh > 0;

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
    // A session logged without percentages still says whether it went to full.
    const sessionsWithEndState = chargeLogs.filter(
        (log) => log.end_soc != null || log.charged_to_full != null,
    );

    const deepDischargeCount = snapshotsWithSoc.filter(
        (snapshot) => (snapshot.soc_percent as number) < DEEP_DISCHARGE_SOC,
    ).length;
    const fullChargeCount = sessionsWithEndState.filter(isFullChargeSession).length;

    const observationCount = snapshotsWithSoc.length + sessionsWithEndState.length;

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
        sessionsWithEndState.length > 0 ? fullChargeCount / sessionsWithEndState.length : 0;

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
    allChargeLogs: FuelLog[],
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

    const loggedEnergyKwh = sumBy(chargeLogs, (log) => finiteOrZero(log.fuel_volume));
    const loggedCost = sumBy(chargeLogs, (log) => finiteOrZero(log.total_cost));

    // Cold start only. Once a single session exists the owner is logging, and
    // topping their figures up with a guess would corrupt a number they can
    // check against a bill.
    const canInfer =
        chargeLogs.length === 0 &&
        whPerKm != null &&
        whPerKm > 0 &&
        distance != null &&
        distance > 0;

    const inferredEnergyKwh = canInfer ? (distance * whPerKm) / 1000 : null;
    const inferredCost =
        inferredEnergyKwh != null && tariffPerKwh != null && tariffPerKwh > 0
            ? inferredEnergyKwh * tariffPerKwh
            : null;

    const totalEnergyKwh =
        loggedEnergyKwh > 0 ? loggedEnergyKwh : inferredEnergyKwh;
    const hasCost = loggedCost > 0 || inferredCost != null;
    const totalCost = hasCost ? loggedCost + (inferredCost ?? 0) : null;

    const mix = buildChargingMix(chargeLogs, inferredEnergyKwh, inferredCost);

    return {
        period: {
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
            endDate: format(endDate, "yyyy-MM-dd"),
            days,
            distance,
            loggedEnergyKwh,
            loggedCost,
            sessionCount: chargeLogs.length,
            inferredEnergyKwh,
            inferredCost,
            totalEnergyKwh,
            totalCost,
            costPerDistance:
                totalCost != null && distance != null && distance > 0
                    ? totalCost / distance
                    : null,
            basis: resolveBasis(loggedEnergyKwh, inferredEnergyKwh),
        },
        mix,
        savings: buildSavings(distance, totalCost, petrolPricePerUnit, iceReferenceEfficiency),
        care: buildBatteryCareSummary(vehicle, chargeLogs, mix.dcFastShare),
        // Efficiency and capacity read the whole history: a segment routinely
        // straddles the start of the window, and a capacity measurement is worth
        // keeping however old it is.
        efficiency: summarizeChargeEfficiency(allChargeLogs),
        capacity: summarizePackCapacity(allChargeLogs),
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
    const allChargeLogs = (vehicle.fuel_logs ?? []).filter(isChargeLog);

    return buildSummary(
        vehicle,
        distance,
        filterLogsInRange(allChargeLogs, startDate, currentDate),
        allChargeLogs,
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

    return buildSummary(
        vehicle,
        distance,
        chargeLogs,
        chargeLogs,
        null,
        currentDate,
        null,
        options,
    );
}
