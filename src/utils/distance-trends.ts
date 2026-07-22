import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";

import type { DistanceCoverage } from "@/utils/distance-analytics";
import type { VehicleWithLogs } from "@/types/database";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;
const DEFAULT_MONTH_COUNT = 12;
const MAX_MONTH_COUNT = 60;

export type DistanceEstimateKind =
  | "adjacent-readings"
  | "interpolated"
  | "unavailable";

export type DistanceConsistencyBand =
  | "steady"
  | "mixed"
  | "variable"
  | "insufficient-data";

export type DistanceComparisonDirection =
  | "up"
  | "down"
  | "steady"
  | "unavailable";

export type DistanceComparisonQuality =
  | "comparable"
  | "directional"
  | "unavailable";

export type DistanceComparisonBasis = "full-month" | "month-to-date";

export interface DistanceTrendDailyPoint {
  key: string;
  label: string;
  day: number;
  /** Estimated distance allocated to this calendar day, or null when unknown. */
  distance: number | null;
  /** Running total of the covered distance within the selected month. */
  cumulativeDistance: number | null;
  hasCoverage: boolean;
  /** Always true for a populated point; odometer readings are not trip logs. */
  isEstimated: boolean;
  estimateKind: DistanceEstimateKind;
  /** Days between the two cumulative readings used for this estimate. */
  interpolationSpanDays: number | null;
}

export interface DistanceTrendMonth {
  key: string;
  label: string;
  start: string;
  end: string;
  totalDistance: number | null;
  /** Numeric chart value; consult `hasData` before presenting zero as observed. */
  value: number;
  hasData: boolean;
  coverage: DistanceCoverage;
  coverageRatio: number;
  coveredDays: number;
  totalDays: number;
  readingCount: number;
  isEstimated: boolean;
}

export interface DistancePeakDay {
  key: string;
  label: string;
  distance: number;
}

export interface DistanceMonthKpis {
  /** Average across days for which interpolation coverage exists. */
  averageCoveredDayDistance: number | null;
  /** Average across estimated days with positive distance. */
  averageDrivingDayDistance: number | null;
  medianDrivingDayDistance: number | null;
  estimatedDrivingDays: number;
  peakDay: DistancePeakDay | null;
  /** 0-100 score based on coefficient of variation across covered days. */
  consistencyScore: number | null;
  consistencyBand: DistanceConsistencyBand;
  coverageRatio: number;
  longestUncoveredRunDays: number;
  largestInterpolationSpanDays: number | null;
}

export interface DistanceMonthDrilldown extends DistanceTrendMonth {
  dailyPoints: DistanceTrendDailyPoint[];
  kpis: DistanceMonthKpis;
}

export interface DistanceMonthComparison {
  currentMonthKey: string;
  previousMonthKey: string;
  currentPeriodEnd: string;
  previousPeriodEnd: string;
  basis: DistanceComparisonBasis;
  currentDistance: number | null;
  previousDistance: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  direction: DistanceComparisonDirection;
  /** Full/full is comparable; partial data is directional only. */
  quality: DistanceComparisonQuality;
}

export interface DistanceTrendDataQuality {
  fuelObservations: number;
  maintenanceObservations: number;
  baselineIncluded: boolean;
  validObservations: number;
  usableReadingDays: number;
  collapsedSameDayObservations: number;
  discardedInvalidObservations: number;
  discardedDecreasingReadings: number;
  segmentCount: number;
}

export interface VehicleDistanceTrends {
  months: DistanceTrendMonth[];
  selectedMonth: DistanceMonthDrilldown;
  comparison: DistanceMonthComparison;
  dataQuality: DistanceTrendDataQuality;
}

export interface BuildVehicleDistanceTrendsOptions {
  monthCount?: number;
  endDate?: Date;
  selectedMonthKey?: string;
}

type ObservationSource = "fuel" | "maintenance" | "baseline";

interface RawOdometerObservation {
  dateKey: string;
  date: Date;
  odometer: number;
  source: ObservationSource;
}

interface OdometerReading {
  dateKey: string;
  date: Date;
  odometer: number;
  sources: ObservationSource[];
}

interface DistanceSegment {
  startDate: Date;
  endDate: Date;
  spanDays: number;
  dailyDistance: number;
}

interface PreparedDistanceData {
  readings: OdometerReading[];
  segments: DistanceSegment[];
  quality: DistanceTrendDataQuality;
}

function parseDateKey(value: string): { key: string; date: Date } | null {
  const key = value.slice(0, 10);
  if (!DATE_KEY_PATTERN.test(key)) {
    return null;
  }

  const date = parseISO(key);
  if (!isValid(date) || format(date, "yyyy-MM-dd") !== key) {
    return null;
  }

  return { key, date };
}

function parseMonthKey(value: string): Date | null {
  if (!MONTH_KEY_PATTERN.test(value)) {
    return null;
  }

  const date = parseISO(`${value}-01`);
  return isValid(date) && format(date, "yyyy-MM") === value ? date : null;
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function clampMonthCount(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_MONTH_COUNT;
  }

  return Math.min(MAX_MONTH_COUNT, Math.max(1, Math.floor(value!)));
}

function resolveEndDate(value: Date | undefined): Date {
  return value && isValid(value) ? startOfDay(value) : startOfDay(new Date());
}

function addObservation(
  observations: RawOdometerObservation[],
  dateValue: string,
  odometer: number | null | undefined,
  source: ObservationSource,
  endDate: Date,
): boolean {
  const parsed = parseDateKey(dateValue);
  if (
    !parsed ||
    !Number.isFinite(odometer) ||
    odometer == null ||
    odometer < 0 ||
    isAfter(parsed.date, endDate)
  ) {
    return false;
  }

  observations.push({
    dateKey: parsed.key,
    date: parsed.date,
    odometer,
    source,
  });
  return true;
}

function prepareDistanceData(
  vehicle: VehicleWithLogs,
  endDate: Date,
): PreparedDistanceData {
  const observations: RawOdometerObservation[] = [];
  let discardedInvalidObservations = 0;
  let fuelObservations = 0;
  let maintenanceObservations = 0;

  for (const log of vehicle.fuel_logs ?? []) {
    fuelObservations += 1;
    if (!addObservation(observations, log.date, log.odometer, "fuel", endDate)) {
      discardedInvalidObservations += 1;
    }
  }

  for (const log of vehicle.maintenance_logs ?? []) {
    if (log.odometer == null) {
      continue;
    }

    maintenanceObservations += 1;
    if (
      !addObservation(
        observations,
        log.date,
        log.odometer,
        "maintenance",
        endDate,
      )
    ) {
      discardedInvalidObservations += 1;
    }
  }

  const earliestLogDateKey = observations
    .map((observation) => observation.dateKey)
    .sort()[0];
  const baselineDate = parseDateKey(vehicle.created_at);
  const canUseBaseline =
    baselineDate != null &&
    (!earliestLogDateKey || baselineDate.key <= earliestLogDateKey);
  const baselineIncluded =
    canUseBaseline &&
    addObservation(
      observations,
      vehicle.created_at,
      vehicle.baseline_odometer,
      "baseline",
      endDate,
    );

  const readingsByDate = new Map<
    string,
    { date: Date; odometer: number; sources: Set<ObservationSource> }
  >();
  for (const observation of observations) {
    const existing = readingsByDate.get(observation.dateKey);
    if (!existing) {
      readingsByDate.set(observation.dateKey, {
        date: observation.date,
        odometer: observation.odometer,
        sources: new Set([observation.source]),
      });
      continue;
    }

    existing.odometer = Math.max(existing.odometer, observation.odometer);
    existing.sources.add(observation.source);
  }

  const collapsedSameDayObservations =
    observations.length - readingsByDate.size;
  const dailyReadings = Array.from(readingsByDate, ([dateKey, reading]) => ({
    dateKey,
    date: reading.date,
    odometer: reading.odometer,
    sources: Array.from(reading.sources),
  })).sort((left, right) => left.dateKey.localeCompare(right.dateKey));

  // A later lower reading cannot form a valid cumulative-odometer segment.
  // Dropping it avoids double counting when the following reading recovers.
  const readings: OdometerReading[] = [];
  let discardedDecreasingReadings = 0;
  for (const reading of dailyReadings) {
    const previous = readings[readings.length - 1];
    if (previous && reading.odometer < previous.odometer) {
      discardedDecreasingReadings += 1;
      continue;
    }

    readings.push(reading);
  }

  const segments: DistanceSegment[] = [];
  for (let index = 1; index < readings.length; index += 1) {
    const start = readings[index - 1];
    const end = readings[index];
    const spanDays = differenceInCalendarDays(end.date, start.date);
    if (spanDays <= 0) {
      continue;
    }

    segments.push({
      startDate: start.date,
      endDate: end.date,
      spanDays,
      dailyDistance: (end.odometer - start.odometer) / spanDays,
    });
  }

  return {
    readings,
    segments,
    quality: {
      fuelObservations,
      maintenanceObservations,
      baselineIncluded,
      validObservations: observations.length,
      usableReadingDays: readings.length,
      collapsedSameDayObservations,
      discardedInvalidObservations,
      discardedDecreasingReadings,
      segmentCount: segments.length,
    },
  };
}

function maxDate(left: Date, right: Date): Date {
  return isAfter(left, right) ? left : right;
}

function minDate(left: Date, right: Date): Date {
  return isBefore(left, right) ? left : right;
}

function buildDailyPoints(
  start: Date,
  end: Date,
  segments: readonly DistanceSegment[],
): DistanceTrendDailyPoint[] {
  if (isAfter(start, end)) {
    return [];
  }

  const allocations = new Map<
    string,
    { distance: number; spanDays: number }
  >();

  for (const segment of segments) {
    // A cumulative delta from A to B represents the calendar intervals (A, B].
    const segmentFirstDay = addDays(segment.startDate, 1);
    const allocationStart = maxDate(start, segmentFirstDay);
    const allocationEnd = minDate(end, segment.endDate);
    if (isAfter(allocationStart, allocationEnd)) {
      continue;
    }

    for (
      let date = allocationStart;
      !isAfter(date, allocationEnd);
      date = addDays(date, 1)
    ) {
      allocations.set(format(date, "yyyy-MM-dd"), {
        distance: segment.dailyDistance,
        spanDays: segment.spanDays,
      });
    }
  }

  let cumulativeDistance = 0;
  const points: DistanceTrendDailyPoint[] = [];
  for (let date = start; !isAfter(date, end); date = addDays(date, 1)) {
    const key = format(date, "yyyy-MM-dd");
    const allocation = allocations.get(key);
    if (!allocation) {
      points.push({
        key,
        label: format(date, "d MMM"),
        day: date.getDate(),
        distance: null,
        cumulativeDistance: null,
        hasCoverage: false,
        isEstimated: false,
        estimateKind: "unavailable",
        interpolationSpanDays: null,
      });
      continue;
    }

    cumulativeDistance += allocation.distance;
    points.push({
      key,
      label: format(date, "d MMM"),
      day: date.getDate(),
      distance: allocation.distance,
      cumulativeDistance,
      hasCoverage: true,
      isEstimated: true,
      estimateKind:
        allocation.spanDays === 1 ? "adjacent-readings" : "interpolated",
      interpolationSpanDays: allocation.spanDays,
    });
  }

  return points;
}

function getCoverage(coveredDays: number, totalDays: number): DistanceCoverage {
  if (coveredDays === 0 || totalDays === 0) {
    return "none";
  }

  return coveredDays === totalDays ? "full" : "partial";
}

function countReadings(
  readings: readonly OdometerReading[],
  start: Date,
  end: Date,
): number {
  return readings.filter(
    (reading) =>
      !isBefore(reading.date, start) &&
      !isAfter(reading.date, end) &&
      reading.sources.some((source) => source !== "baseline"),
  ).length;
}

function summarizeMonth(
  monthStart: Date,
  periodEnd: Date,
  data: PreparedDistanceData,
): { summary: DistanceTrendMonth; dailyPoints: DistanceTrendDailyPoint[] } {
  const dailyPoints = buildDailyPoints(monthStart, periodEnd, data.segments);
  const coveredPoints = dailyPoints.filter((point) => point.distance != null);
  const totalDistance =
    coveredPoints.length > 0
      ? coveredPoints.reduce((sum, point) => sum + (point.distance ?? 0), 0)
      : null;
  const coveredDays = coveredPoints.length;
  const totalDays = dailyPoints.length;
  const coverage = getCoverage(coveredDays, totalDays);

  return {
    summary: {
      key: format(monthStart, "yyyy-MM"),
      label: format(monthStart, "MMM yy"),
      start: format(monthStart, "yyyy-MM-dd"),
      end: format(periodEnd, "yyyy-MM-dd"),
      totalDistance,
      value: totalDistance ?? 0,
      hasData: totalDistance != null,
      coverage,
      coverageRatio: totalDays > 0 ? coveredDays / totalDays : 0,
      coveredDays,
      totalDays,
      readingCount: countReadings(data.readings, monthStart, periodEnd),
      isEstimated: coveredDays > 0,
    },
    dailyPoints,
  };
}

function getLongestUncoveredRun(
  points: readonly DistanceTrendDailyPoint[],
): number {
  let longest = 0;
  let current = 0;

  for (const point of points) {
    if (point.hasCoverage) {
      current = 0;
    } else {
      current += 1;
      longest = Math.max(longest, current);
    }
  }

  return longest;
}

function getConsistencyBand(score: number | null): DistanceConsistencyBand {
  if (score == null) {
    return "insufficient-data";
  }

  if (score >= 75) {
    return "steady";
  }

  return score >= 45 ? "mixed" : "variable";
}

function buildKpis(
  points: readonly DistanceTrendDailyPoint[],
): DistanceMonthKpis {
  const covered = points.filter(
    (point): point is DistanceTrendDailyPoint & { distance: number } =>
      point.distance != null,
  );
  const drivingDays = covered.filter((point) => point.distance > 0);
  const totalDistance = covered.reduce((sum, point) => sum + point.distance, 0);
  const averageCoveredDayDistance =
    covered.length > 0 ? totalDistance / covered.length : null;
  const averageDrivingDayDistance =
    drivingDays.length > 0 ? totalDistance / drivingDays.length : null;
  const medianDrivingDayDistance =
    drivingDays.length > 0
      ? median(drivingDays.map((point) => point.distance))
      : null;
  const peakPoint = drivingDays.reduce<
    (DistanceTrendDailyPoint & { distance: number }) | null
  >(
    (peak, point) => (!peak || point.distance > peak.distance ? point : peak),
    null,
  );

  let consistencyScore: number | null = null;
  if (
    covered.length >= 2 &&
    averageCoveredDayDistance != null &&
    averageCoveredDayDistance > 0
  ) {
    const variance =
      covered.reduce(
        (sum, point) =>
          sum + Math.pow(point.distance - averageCoveredDayDistance, 2),
        0,
      ) / covered.length;
    const coefficientOfVariation =
      Math.sqrt(variance) / averageCoveredDayDistance;
    consistencyScore = Math.round(
      Math.max(0, Math.min(1, 1 - coefficientOfVariation)) * 100,
    );
  }

  const interpolationSpans = covered
    .map((point) => point.interpolationSpanDays)
    .filter((value): value is number => value != null);

  return {
    averageCoveredDayDistance,
    averageDrivingDayDistance,
    medianDrivingDayDistance,
    estimatedDrivingDays: drivingDays.length,
    peakDay: peakPoint
      ? {
          key: peakPoint.key,
          label: peakPoint.label,
          distance: peakPoint.distance,
        }
      : null,
    consistencyScore,
    consistencyBand: getConsistencyBand(consistencyScore),
    coverageRatio: points.length > 0 ? covered.length / points.length : 0,
    longestUncoveredRunDays: getLongestUncoveredRun(points),
    largestInterpolationSpanDays:
      interpolationSpans.length > 0 ? Math.max(...interpolationSpans) : null,
  };
}

function buildComparison(
  current: DistanceTrendMonth,
  previous: DistanceTrendMonth,
  basis: DistanceComparisonBasis,
): DistanceMonthComparison {
  if (current.totalDistance == null || previous.totalDistance == null) {
    return {
      currentMonthKey: current.key,
      previousMonthKey: previous.key,
      currentPeriodEnd: current.end,
      previousPeriodEnd: previous.end,
      basis,
      currentDistance: current.totalDistance,
      previousDistance: previous.totalDistance,
      absoluteChange: null,
      percentageChange: null,
      direction: "unavailable",
      quality: "unavailable",
    };
  }

  const absoluteChange = current.totalDistance - previous.totalDistance;
  const percentageChange =
    previous.totalDistance > 0
      ? (absoluteChange / previous.totalDistance) * 100
      : absoluteChange === 0
        ? 0
        : null;

  return {
    currentMonthKey: current.key,
    previousMonthKey: previous.key,
    currentPeriodEnd: current.end,
    previousPeriodEnd: previous.end,
    basis,
    currentDistance: current.totalDistance,
    previousDistance: previous.totalDistance,
    absoluteChange,
    percentageChange,
    direction:
      absoluteChange > 0 ? "up" : absoluteChange < 0 ? "down" : "steady",
    quality:
      current.coverage === "full" && previous.coverage === "full"
        ? "comparable"
        : "directional",
  };
}

function getPeriodEnd(monthStart: Date, endDate: Date): Date {
  return isSameMonth(monthStart, endDate) ? endDate : endOfMonth(monthStart);
}

/**
 * Build monthly distance trends and an estimated daily drill-down from
 * cumulative odometer readings.
 *
 * Fuel and odometer-bearing maintenance logs are merged. Same-day readings
 * collapse to the highest odometer. Distance between consecutive readings is
 * allocated evenly over the calendar intervals between them, so daily values
 * are estimates—not reconstructed trips. Unknown days stay null.
 */
export function buildVehicleDistanceTrends(
  vehicle: VehicleWithLogs,
  options: BuildVehicleDistanceTrendsOptions = {},
): VehicleDistanceTrends {
  const endDate = resolveEndDate(options.endDate);
  const monthCount = clampMonthCount(options.monthCount);
  const endMonth = startOfMonth(endDate);
  const requestedMonth = options.selectedMonthKey
    ? parseMonthKey(options.selectedMonthKey)
    : null;
  const selectedMonthStart =
    requestedMonth && !isAfter(requestedMonth, endMonth)
      ? requestedMonth
      : endMonth;
  const data = prepareDistanceData(vehicle, endDate);

  const months = Array.from({ length: monthCount }, (_, index) => {
    const monthStart = subMonths(endMonth, monthCount - index - 1);
    return summarizeMonth(
      monthStart,
      getPeriodEnd(monthStart, endDate),
      data,
    ).summary;
  });

  const selectedPeriodEnd = getPeriodEnd(selectedMonthStart, endDate);
  const selected = summarizeMonth(
    selectedMonthStart,
    selectedPeriodEnd,
    data,
  );
  const selectedMonth: DistanceMonthDrilldown = {
    ...selected.summary,
    dailyPoints: selected.dailyPoints,
    kpis: buildKpis(selected.dailyPoints),
  };

  const previousMonthStart = subMonths(selectedMonthStart, 1);
  const isMonthToDate = !isSameDay(
    selectedPeriodEnd,
    endOfMonth(selectedMonthStart),
  );
  const elapsedSelectedDays =
    differenceInCalendarDays(selectedPeriodEnd, selectedMonthStart) + 1;
  const previousPeriodEnd = isMonthToDate
    ? minDate(
        endOfMonth(previousMonthStart),
        addDays(previousMonthStart, elapsedSelectedDays - 1),
      )
    : endOfMonth(previousMonthStart);
  const previousMonth = summarizeMonth(
    previousMonthStart,
    previousPeriodEnd,
    data,
  ).summary;

  return {
    months,
    selectedMonth,
    comparison: buildComparison(
      selectedMonth,
      previousMonth,
      isMonthToDate ? "month-to-date" : "full-month",
    ),
    dataQuality: data.quality,
  };
}
