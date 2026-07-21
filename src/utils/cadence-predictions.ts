import {
  addDays,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";

/**
 * Smart cadence prediction utilities for fuel/charge refill predictions.
 *
 * Fuel log dates are database DATE values, so every calculation in this file
 * intentionally uses calendar days rather than elapsed 24-hour periods.
 */

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RECENT_INTERVALS = 8;

export type RefillStatus =
  | "on-track"
  | "refuelling-soon"
  | "refuelling-imminent"
  | "overdue"
  | "insufficient-data";

export type CadenceConfidence = "none" | "low" | "medium" | "high";

export interface RefillCadenceEstimate {
  /** Robust estimate based on the median of recent intervals. */
  intervalDays: number;
  /** Number of intervals used by the estimate. */
  sampleSize: number;
  /** Number of distinct, valid event dates used by the estimate. */
  eventCount: number;
  /** Median absolute deviation of the recent intervals. */
  madDays: number;
  confidence: Exclude<CadenceConfidence, "none">;
  lastEventDate: Date;
  lastEventDateKey: string;
}

export interface SmartRefillPrediction {
  /** The expected refill date. It remains in the past when a refill is overdue. */
  adjustedDate: Date | null;
  /** Backward-compatible alias for the unadjusted expected refill date. */
  originalDate: Date | null;
  /** Stable DATE representation used for timezone-safe rendering. */
  expectedDateKey: string | null;
  /** Human-friendly status category. */
  status: RefillStatus;
  /** Human-readable status summary. */
  message: string;
  /** Calendar days until the expected date; negative values mean overdue. */
  daysDifference: number;
  /** Whether the expected date is before today's calendar date. */
  wasProjectionPast: boolean;
  /** @deprecated Refill predictions are no longer rolled through synthetic cycles. */
  cyclesMissed: number;
  /** Typical number of calendar days between refill events. */
  intervalDays: number | null;
  /** Number of observed intervals used to estimate cadence. */
  sampleSize: number;
  /** Median absolute deviation of observed intervals. */
  madDays: number | null;
  /** Confidence based on sample count and cadence variation. */
  confidence: CadenceConfidence;
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function parseDateKey(value: string): Date | null {
  if (!DATE_KEY_PATTERN.test(value)) {
    return null;
  }

  const parsed = parseISO(value);
  if (!isValid(parsed) || format(parsed, "yyyy-MM-dd") !== value) {
    return null;
  }

  return parsed;
}

function toDateKey(value: Date | string): string | null {
  if (typeof value === "string") {
    return parseDateKey(value) ? value : null;
  }

  if (!isValid(value)) {
    return null;
  }

  // A Date created from a database DATE (`new Date("yyyy-MM-dd")`) is UTC
  // midnight. Recover its UTC components before converting it to a local
  // calendar date. Dates already created at local midnight keep local fields.
  const isLocalMidnight =
    value.getHours() === 0 &&
    value.getMinutes() === 0 &&
    value.getSeconds() === 0 &&
    value.getMilliseconds() === 0;
  const isUtcMidnight =
    value.getUTCHours() === 0 &&
    value.getUTCMinutes() === 0 &&
    value.getUTCSeconds() === 0 &&
    value.getUTCMilliseconds() === 0;

  if (isLocalMidnight || !isUtcMidnight) {
    return format(value, "yyyy-MM-dd");
  }

  const year = value.getUTCFullYear().toString().padStart(4, "0");
  const month = (value.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = value.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getConfidence(
  sampleSize: number,
  medianDays: number,
  madDays: number,
): Exclude<CadenceConfidence, "none"> {
  if (sampleSize <= 1) {
    return "low";
  }

  const relativeVariation = medianDays > 0 ? madDays / medianDays : Infinity;
  if (sampleSize >= 4 && relativeVariation <= 0.25) {
    return "high";
  }

  if (relativeVariation <= 0.5) {
    return "medium";
  }

  return "low";
}

function insufficientPrediction(): SmartRefillPrediction {
  return {
    adjustedDate: null,
    originalDate: null,
    expectedDateKey: null,
    status: "insufficient-data",
    message: "Insufficient data to predict next refill",
    daysDifference: 0,
    wasProjectionPast: false,
    cyclesMissed: 0,
    intervalDays: null,
    sampleSize: 0,
    madDays: null,
    confidence: "none",
  };
}

function buildPrediction(
  lastEventDateKey: string,
  intervalDays: number,
  currentDate: Date,
  metadata: Pick<SmartRefillPrediction, "sampleSize" | "madDays" | "confidence">,
): SmartRefillPrediction {
  const lastEventDate = parseDateKey(lastEventDateKey);
  if (
    !lastEventDate ||
    !isValid(currentDate) ||
    !Number.isFinite(intervalDays) ||
    intervalDays <= 0
  ) {
    return insufficientPrediction();
  }

  const normalizedIntervalDays = Math.max(1, Math.round(intervalDays));
  const expectedDate = addDays(lastEventDate, normalizedIntervalDays);
  const expectedDateKey = format(expectedDate, "yyyy-MM-dd");
  const daysDifference = differenceInCalendarDays(
    expectedDate,
    startOfDay(currentDate),
  );
  const wasProjectionPast = daysDifference < 0;

  let status: RefillStatus;
  let message: string;

  if (wasProjectionPast) {
    const overdueDays = Math.abs(daysDifference);
    status = "overdue";
    message = `Refill overdue by ${overdueDays} ${overdueDays === 1 ? "day" : "days"}`;
  } else if (daysDifference <= 1) {
    status = "refuelling-imminent";
    message = "Refuelling imminent";
  } else if (daysDifference <= 2) {
    status = "refuelling-soon";
    message = "Refuelling soon";
  } else {
    status = "on-track";
    message = "On track";
  }

  return {
    adjustedDate: expectedDate,
    originalDate: new Date(expectedDate),
    expectedDateKey,
    status,
    message,
    daysDifference,
    wasProjectionPast,
    // Kept only so existing consumers do not break. An overdue event represents
    // one unfulfilled prediction; it is never advanced through imagined cycles.
    cyclesMissed: wasProjectionPast ? 1 : 0,
    intervalDays: normalizedIntervalDays,
    ...metadata,
  };
}

/**
 * Estimate refill cadence from actual event DATE strings.
 *
 * Invalid and future dates are ignored, same-day entries are deduplicated, and
 * only the eight most recent intervals are used. The median resists isolated
 * long gaps while the recent window lets the estimate adapt to changed usage.
 */
export function estimateRefillCadence(
  eventDates: readonly string[],
  currentDate: Date = new Date(),
): RefillCadenceEstimate | null {
  if (!isValid(currentDate)) {
    return null;
  }

  const today = startOfDay(currentDate);
  const validDateKeys = Array.from(
    new Set(
      eventDates.filter((dateKey) => {
        const parsed = parseDateKey(dateKey);
        return parsed != null && differenceInCalendarDays(parsed, today) <= 0;
      }),
    ),
  ).sort();

  const recentDateKeys = validDateKeys.slice(-(MAX_RECENT_INTERVALS + 1));
  if (recentDateKeys.length < 2) {
    return null;
  }

  const recentDates = recentDateKeys.map((dateKey) => parseDateKey(dateKey)!);
  const intervals = recentDates.slice(1).map((date, index) =>
    differenceInCalendarDays(date, recentDates[index]),
  );

  const medianDays = median(intervals);
  const madDays = median(
    intervals.map((interval) => Math.abs(interval - medianDays)),
  );
  const intervalDays = Math.max(1, Math.round(medianDays));
  const sampleSize = intervals.length;

  return {
    intervalDays,
    sampleSize,
    eventCount: recentDateKeys.length,
    madDays,
    confidence: getConfidence(sampleSize, medianDays, madDays),
    lastEventDate: recentDates[recentDates.length - 1],
    lastEventDateKey: recentDateKeys[recentDateKeys.length - 1],
  };
}

/**
 * Calculate a cadence prediction directly from refill event DATE strings.
 */
export function calculateSmartNextRefillFromHistory(
  eventDates: readonly string[],
  currentDate: Date = new Date(),
): SmartRefillPrediction {
  const estimate = estimateRefillCadence(eventDates, currentDate);
  if (!estimate) {
    return insufficientPrediction();
  }

  return buildPrediction(
    estimate.lastEventDateKey,
    estimate.intervalDays,
    currentDate,
    {
      sampleSize: estimate.sampleSize,
      madDays: estimate.madDays,
      confidence: estimate.confidence,
    },
  );
}

/**
 * Calculate a prediction from an already-derived cadence interval.
 *
 * This backward-compatible entry point remains available to existing callers.
 * Prefer `calculateSmartNextRefillFromHistory` when raw event dates are present.
 */
export function calculateSmartNextRefill(
  cadenceEndDate: Date | string | null,
  averageDaysBetween: number,
  currentDate: Date = new Date(),
): SmartRefillPrediction {
  if (
    !cadenceEndDate ||
    !Number.isFinite(averageDaysBetween) ||
    averageDaysBetween <= 0
  ) {
    return insufficientPrediction();
  }

  const cadenceEndDateKey = toDateKey(cadenceEndDate);
  if (!cadenceEndDateKey) {
    return insufficientPrediction();
  }

  return buildPrediction(cadenceEndDateKey, averageDaysBetween, currentDate, {
    sampleSize: 0,
    madDays: null,
    confidence: "low",
  });
}

/**
 * Get a human-friendly display string for a refill prediction.
 */
export function getRefillDisplayString(
  prediction: SmartRefillPrediction,
  mode: "fuel" | "charge" = "fuel",
): string {
  const action = mode === "charge" ? "charging" : "refuelling";

  if (prediction.status === "insufficient-data") {
    return "Insufficient data to predict";
  }

  if (!prediction.adjustedDate) {
    return "Unable to calculate prediction";
  }

  const dateKey =
    prediction.expectedDateKey ?? toDateKey(prediction.adjustedDate);
  const displayDate = dateKey ? parseDateKey(dateKey) : null;
  if (!displayDate) {
    return "Unable to calculate prediction";
  }

  const dateStr = displayDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  if (prediction.status === "overdue") {
    const overdueDays = Math.abs(prediction.daysDifference);
    if (overdueDays === 0) {
      return `${dateStr} - ${action} overdue`;
    }

    return `${dateStr} - ${action} overdue by ${overdueDays} ${overdueDays === 1 ? "day" : "days"}`;
  }

  if (prediction.status === "refuelling-imminent") {
    if (prediction.daysDifference === 0) {
      return `Today - ${action} due`;
    }

    if (prediction.daysDifference === 1) {
      return `Tomorrow - ${action} due`;
    }

    return `${dateStr} - ${action} imminent`;
  }

  if (prediction.status === "refuelling-soon") {
    return `${dateStr} - ${action} in ${prediction.daysDifference} days`;
  }

  return dateStr;
}

/** Get CSS class for styling based on refill status. */
export function getStatusClassName(status: RefillStatus): string {
  switch (status) {
    case "on-track":
      return "text-emerald-600 dark:text-emerald-400";
    case "refuelling-soon":
      return "text-amber-600 dark:text-amber-400";
    case "refuelling-imminent":
      return "text-orange-600 dark:text-orange-400";
    case "overdue":
      return "text-rose-600 dark:text-rose-400";
    case "insufficient-data":
      return "text-slate-500 dark:text-slate-400";
  }
}

/** Get icon name for refill status (using Lucide icon names). */
export function getStatusIcon(status: RefillStatus): string {
  switch (status) {
    case "on-track":
      return "CheckCircle";
    case "refuelling-soon":
      return "Clock";
    case "refuelling-imminent":
      return "AlertCircle";
    case "overdue":
      return "AlertTriangle";
    case "insufficient-data":
      return "HelpCircle";
  }
}
