import { differenceInCalendarDays, format, isValid, parseISO, startOfMonth, subMonths } from "date-fns";

import type { FuelLog } from "@/types/database";
import {
  consistencyScore as scoreConsistency,
  getOutlierBounds,
  leastSquaresSlope,
  median,
} from "@/utils/statistics";

/**
 * Battery health derived from state-of-charge snapshots.
 *
 * The measurement is a discharge segment: two snapshots with no charge between
 * them. `distance / soc_drop` gives km per percent, and multiplying by 100 gives
 * the usable range at a full charge. Tracking that figure over time is the
 * closest thing to state-of-health we can get without OBD access.
 *
 * Home charging is never logged (see docs/ev-redesign.md), so we cannot prove a
 * charge did not happen mid-segment. A rising SoC is direct evidence of one; the
 * remaining risk is a charge followed by enough riding to still net out lower.
 * That produces an implausibly high km/%, which the outlier filter removes.
 */

/** Beyond this the odds of an unlogged charge inside the segment get too high. */
const MAX_SEGMENT_SPAN_DAYS = 30;
/** SoC is reported in whole percent, so a small drop is mostly quantisation noise. */
const MIN_SOC_DROP = 5;
const MIN_SEGMENTS_FOR_ESTIMATE = 3;
const MIN_SEGMENTS_FOR_BASELINE = 3;
const MIN_POINTS_FOR_TREND = 3;
const HIGH_CONFIDENCE_SEGMENTS = 6;
const HIGH_CONFIDENCE_CONSISTENCY = 60;
const OUTLIER_MAD_MULTIPLIER = 3;
/** Floor for the outlier threshold, as a fraction of the median rate. */
const OUTLIER_MIN_RELATIVE_SPREAD = 0.5;
const DEFAULT_RECENT_WINDOW_DAYS = 120;
const DEFAULT_TREND_MONTHS = 12;
const DEFAULT_SOH_THRESHOLD_PERCENT = 70;

export type BatterySegmentRejection =
  | "charged-between"
  | "no-distance"
  | "soc-drop-too-small"
  | "span-too-long"
  | "outlier"
  | "invalid-reading";

export type BatteryHealthConfidence = "none" | "low" | "medium" | "high";

export type BatteryBaselineSource =
  | "configured"
  | "earliest-segments"
  | "unavailable";

export interface BatteryDischargeSegment {
  startSnapshotId: string;
  endSnapshotId: string;
  startDate: string;
  endDate: string;
  spanDays: number;
  startOdometer: number;
  endOdometer: number;
  distance: number;
  startSoc: number;
  endSoc: number;
  socDrop: number;
  kmPerPercent: number;
  /** Usable segments are the ones that feed every published figure. */
  usable: boolean;
  rejection: BatterySegmentRejection | null;
}

export interface BatteryHealthTrendPoint {
  key: string;
  label: string;
  kmPerPercent: number | null;
  usableRangeKm: number | null;
  segmentCount: number;
}

export interface BatteryHealthSummary {
  segments: BatteryDischargeSegment[];
  usableSegmentCount: number;
  /** Robust median over the recent window; null until there is enough data. */
  kmPerPercent: number | null;
  usableRangeKm: number | null;
  baselineRangeKm: number | null;
  baselineSource: BatteryBaselineSource;
  stateOfHealthPercent: number | null;
  whPerKm: number | null;
  confidence: BatteryHealthConfidence;
  /** 0-100, from the coefficient of variation across usable segments. */
  consistencyScore: number | null;
  degradationPercentPerYear: number | null;
  yearsToSohThreshold: number | null;
  sohThresholdPercent: number;
  trend: BatteryHealthTrendPoint[];
}

export interface BatteryHealthOptions {
  usableBatteryKwh?: number | null;
  baselineRangeKm?: number | null;
  recentWindowDays?: number;
  trendMonths?: number;
  sohThresholdPercent?: number;
  currentDate?: Date;
}

/**
 * A state-of-charge reading with an odometer beside it.
 *
 * A manual check-in is one. So is each end of a charge session — plugging in
 * records the charge left after a ride, unplugging records what it was topped
 * up to — and those are the readings an owner produces most, because logging a
 * charge is the primary EV action while a check-in is an extra deliberate one.
 */
export type SocObservation = {
  id: string;
  date: string;
  odometer: number;
  soc_percent: number | null;
  created_at: string | null;
};

function parseSnapshotDate(value: string): Date | null {
  const parsed = parseISO(value.slice(0, 10));
  return isValid(parsed) ? parsed : null;
}

/**
 * The readings a charge session already carries.
 *
 * Without these, state of health is measured only from manual check-ins: an
 * owner who logs every charge with its percentages and never opens the check-in
 * form gets no usable-range figure at all, despite the app holding exactly the
 * data it needs. Estimated rows are excluded — those are the app's own
 * cold-start guess, not something anybody read off a dashboard.
 */
export function toChargeSocObservations(logs: FuelLog[]): SocObservation[] {
  const observations: SocObservation[] = [];

  for (const log of logs) {
    if (log.energy_type !== "charge" || log.is_estimated) continue;

    const base = log.created_at || `${log.date}T00:00:00.000Z`;

    // Plug-in and unplug share a date and an odometer, so the sort's only
    // remaining tiebreak decides their order. Getting it backwards would read
    // the session as a discharge and the ride before it as a charge.
    if (log.start_soc != null && Number.isFinite(log.start_soc)) {
      observations.push({
        id: `charge:${log.id}:start`,
        date: log.date,
        odometer: log.odometer,
        soc_percent: log.start_soc,
        created_at: `${base}#0`,
      });
    }

    if (log.end_soc != null && Number.isFinite(log.end_soc)) {
      observations.push({
        id: `charge:${log.id}:end`,
        date: log.date,
        odometer: log.odometer,
        soc_percent: log.end_soc,
        created_at: `${base}#1`,
      });
    }
  }

  return observations;
}

/**
 * Every state-of-charge reading the app holds for a vehicle. Call sites pass
 * the result to `summarizeBatteryHealth` and `getLatestSocSnapshot` so both
 * read the same set.
 */
export function collectSocObservations(
  snapshots: readonly SocObservation[] = [],
  chargeLogs: readonly FuelLog[] = [],
): SocObservation[] {
  return [...snapshots, ...toChargeSocObservations([...chargeLogs])];
}

function sortSnapshots(snapshots: SocObservation[]): SocObservation[] {
  return [...snapshots].sort((left, right) => {
    const byDate = new Date(left.date).getTime() - new Date(right.date).getTime();
    if (byDate !== 0) return byDate;

    const byOdometer = left.odometer - right.odometer;
    if (byOdometer !== 0) return byOdometer;

    return (left.created_at ?? "").localeCompare(right.created_at ?? "");
  });
}

/**
 * Pairs consecutive snapshots into candidate discharge segments and marks the
 * ones we cannot trust. Every candidate is returned, rejected or not, so the UI
 * can explain why a reading was ignored.
 */
export function buildDischargeSegments(
  snapshots: SocObservation[],
): BatteryDischargeSegment[] {
  // A non-finite SoC is already screened out here. A non-finite odometer is
  // not, so it is checked per-candidate below instead — the same reading can
  // be the end of one segment and the start of the next.
  const withSoc = sortSnapshots(snapshots).filter(
    (snapshot) => snapshot.soc_percent != null && Number.isFinite(snapshot.soc_percent),
  );

  const candidates: BatteryDischargeSegment[] = [];

  for (let index = 1; index < withSoc.length; index += 1) {
    const start = withSoc[index - 1];
    const end = withSoc[index];
    const startDate = parseSnapshotDate(start.date);
    const endDate = parseSnapshotDate(end.date);

    if (!startDate || !endDate) continue;

    const startSoc = start.soc_percent as number;
    const endSoc = end.soc_percent as number;
    const socDrop = startSoc - endSoc;
    const distance = end.odometer - start.odometer;
    const spanDays = differenceInCalendarDays(endDate, startDate);

    // A non-finite odometer reading (a bad OCR read, a corrupted row) would
    // otherwise sail past every check below: `distance <= 0` and `distance >
    // 0` are both false for NaN, so the segment fell through as "usable" with
    // a fabricated kmPerPercent of 0 rather than being rejected outright.
    const hasFiniteReadings = Number.isFinite(distance) && Number.isFinite(socDrop);

    let rejection: BatterySegmentRejection | null = null;
    if (!hasFiniteReadings) {
      rejection = "invalid-reading";
    } else if (socDrop <= 0) {
      rejection = "charged-between";
    } else if (distance <= 0) {
      rejection = "no-distance";
    } else if (socDrop < MIN_SOC_DROP) {
      rejection = "soc-drop-too-small";
    } else if (spanDays > MAX_SEGMENT_SPAN_DAYS) {
      rejection = "span-too-long";
    }

    candidates.push({
      startSnapshotId: start.id,
      endSnapshotId: end.id,
      startDate: start.date,
      endDate: end.date,
      spanDays,
      startOdometer: start.odometer,
      endOdometer: end.odometer,
      distance,
      startSoc,
      endSoc,
      socDrop,
      kmPerPercent:
        hasFiniteReadings && socDrop > 0 && distance > 0 ? distance / socDrop : 0,
      usable: rejection == null,
      rejection,
    });
  }

  return flagOutliers(candidates);
}

/**
 * Terrain, ride mode, pillion load and temperature all move km/% legitimately,
 * but an unlogged mid-segment charge moves it far further. A median-absolute-
 * deviation filter drops those without assuming a normal distribution.
 */
function flagOutliers(segments: BatteryDischargeSegment[]): BatteryDischargeSegment[] {
  const usableRates = segments
    .filter((segment) => segment.usable)
    .map((segment) => segment.kmPerPercent);

  if (usableRates.length < MIN_SEGMENTS_FOR_ESTIMATE) {
    return segments;
  }

  const bounds = getOutlierBounds(usableRates, {
    madMultiplier: OUTLIER_MAD_MULTIPLIER,
    minRelativeSpread: OUTLIER_MIN_RELATIVE_SPREAD,
  });
  if (bounds == null) return segments;

  return segments.map((segment) => {
    if (!segment.usable) return segment;
    if (Math.abs(segment.kmPerPercent - bounds.center) <= bounds.limit) return segment;

    return { ...segment, usable: false, rejection: "outlier" as const };
  });
}

function buildTrend(
  segments: BatteryDischargeSegment[],
  monthCount: number,
  currentDate: Date,
): BatteryHealthTrendPoint[] {
  const buckets = new Map<string, number[]>();

  for (const segment of segments) {
    if (!Number.isFinite(segment.kmPerPercent)) continue;
    const endDate = parseSnapshotDate(segment.endDate);
    if (!endDate) continue;
    const key = format(startOfMonth(endDate), "yyyy-MM");
    buckets.set(key, [...(buckets.get(key) ?? []), segment.kmPerPercent]);
  }

  return Array.from({ length: monthCount }, (_, index) => {
    const monthDate = startOfMonth(subMonths(currentDate, monthCount - index - 1));
    const key = format(monthDate, "yyyy-MM");
    const rates = buckets.get(key) ?? [];
    const monthlyRate = median(rates);

    return {
      key,
      label: format(monthDate, "MMM"),
      kmPerPercent: monthlyRate,
      usableRangeKm: monthlyRate != null ? monthlyRate * 100 : null,
      segmentCount: rates.length,
    };
  });
}

/** Least-squares slope of usable range against time, in km per year. */
function estimateRangeSlopePerYear(trend: BatteryHealthTrendPoint[]): number | null {
  const points = trend
    .map((point) => {
      const monthDate = parseISO(`${point.key}-01`);
      return isValid(monthDate) && point.usableRangeKm != null
        ? { time: monthDate.getTime(), range: point.usableRangeKm }
        : null;
    })
    .filter((point): point is { time: number; range: number } => point != null);

  if (points.length < MIN_POINTS_FOR_TREND) return null;

  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const originTime = points[0].time;

  return leastSquaresSlope(
    points.map((point) => ({
      x: (point.time - originTime) / msPerYear,
      y: point.range,
    })),
  );
}

function resolveConfidence(
  usableSegmentCount: number,
  consistencyScore: number | null,
): BatteryHealthConfidence {
  if (usableSegmentCount === 0) return "none";
  if (usableSegmentCount < MIN_SEGMENTS_FOR_ESTIMATE) return "low";

  if (
    usableSegmentCount >= HIGH_CONFIDENCE_SEGMENTS &&
    consistencyScore != null &&
    consistencyScore >= HIGH_CONFIDENCE_CONSISTENCY
  ) {
    return "high";
  }

  return "medium";
}

export function summarizeBatteryHealth(
  snapshots: SocObservation[],
  options: BatteryHealthOptions = {},
): BatteryHealthSummary {
  const {
    usableBatteryKwh = null,
    baselineRangeKm = null,
    recentWindowDays = DEFAULT_RECENT_WINDOW_DAYS,
    trendMonths = DEFAULT_TREND_MONTHS,
    sohThresholdPercent = DEFAULT_SOH_THRESHOLD_PERCENT,
    currentDate = new Date(),
  } = options;

  const segments = buildDischargeSegments(snapshots);
  const usableSegments = segments.filter((segment) => segment.usable);

  // Health is a "right now" figure, so prefer recent segments and only widen the
  // window when there are too few to say anything.
  const recentSegments = usableSegments.filter((segment) => {
    const endDate = parseSnapshotDate(segment.endDate);
    return endDate != null && differenceInCalendarDays(currentDate, endDate) <= recentWindowDays;
  });
  const measurementSegments =
    recentSegments.length >= MIN_SEGMENTS_FOR_ESTIMATE ? recentSegments : usableSegments;

  const rates = measurementSegments.map((segment) => segment.kmPerPercent);
  const hasEnoughData = usableSegments.length >= MIN_SEGMENTS_FOR_ESTIMATE;
  const kmPerPercent = hasEnoughData ? median(rates) : null;
  const usableRangeKm = kmPerPercent != null ? kmPerPercent * 100 : null;

  const consistencyScore = scoreConsistency(rates);

  // Without a configured baseline, the earliest usable segments stand in for
  // "when new". That is only meaningful if tracking started early in ownership,
  // so the source is reported alongside the number.
  let resolvedBaseline = baselineRangeKm;
  let baselineSource: BatteryBaselineSource = baselineRangeKm != null ? "configured" : "unavailable";

  if (resolvedBaseline == null && usableSegments.length >= MIN_SEGMENTS_FOR_BASELINE) {
    const earliest = usableSegments
      .slice(0, MIN_SEGMENTS_FOR_BASELINE)
      .map((segment) => segment.kmPerPercent);
    const earliestRate = median(earliest);

    if (earliestRate != null) {
      resolvedBaseline = earliestRate * 100;
      baselineSource = "earliest-segments";
    }
  }

  const stateOfHealthPercent =
    usableRangeKm != null && resolvedBaseline != null && resolvedBaseline > 0
      ? (usableRangeKm / resolvedBaseline) * 100
      : null;

  // whPerKm = usable pack kWh spread over the range it delivers.
  const whPerKm =
    usableBatteryKwh != null && usableBatteryKwh > 0 && usableRangeKm != null && usableRangeKm > 0
      ? (usableBatteryKwh * 1000) / usableRangeKm
      : null;

  const trend = buildTrend(usableSegments, trendMonths, currentDate);
  const slopePerYear = estimateRangeSlopePerYear(trend);

  const degradationPercentPerYear =
    slopePerYear != null && resolvedBaseline != null && resolvedBaseline > 0
      ? (-slopePerYear / resolvedBaseline) * 100
      : null;

  // Only project when range is actually falling; a flat or improving trend has
  // no meaningful crossing point.
  const yearsToSohThreshold =
    degradationPercentPerYear != null &&
    degradationPercentPerYear > 0 &&
    stateOfHealthPercent != null &&
    stateOfHealthPercent > sohThresholdPercent
      ? (stateOfHealthPercent - sohThresholdPercent) / degradationPercentPerYear
      : null;

  return {
    segments,
    usableSegmentCount: usableSegments.length,
    kmPerPercent,
    usableRangeKm,
    baselineRangeKm: resolvedBaseline,
    baselineSource,
    stateOfHealthPercent,
    whPerKm,
    confidence: resolveConfidence(usableSegments.length, consistencyScore),
    consistencyScore,
    degradationPercentPerYear,
    yearsToSohThreshold,
    sohThresholdPercent,
    trend,
  };
}

/**
 * Replaces the ICE "days until next refuel" prediction. Charging is nightly, so
 * the useful question is how much range is left, not when the next top-up is due.
 */
export function estimateDaysOfRangeLeft(
  currentSoc: number | null,
  kmPerPercent: number | null,
  averageDailyDistance: number | null,
): number | null {
  if (
    currentSoc == null ||
    kmPerPercent == null ||
    averageDailyDistance == null ||
    currentSoc <= 0 ||
    kmPerPercent <= 0 ||
    averageDailyDistance <= 0
  ) {
    return null;
  }

  return (currentSoc * kmPerPercent) / averageDailyDistance;
}

/** The most recent snapshot carrying a state-of-charge reading. */
export function getLatestSocSnapshot(snapshots: SocObservation[]): SocObservation | null {
  const withSoc = sortSnapshots(snapshots).filter((snapshot) => snapshot.soc_percent != null);
  return withSoc.length > 0 ? withSoc[withSoc.length - 1] : null;
}
