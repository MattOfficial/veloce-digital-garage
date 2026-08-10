import {
  addDays,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";

/**
 * Report windows are plain calendar dates, never timestamps.
 *
 * Every log table stores `date` as a bare `YYYY-MM-DD`. Parsing those into
 * `Date` objects to compare them would reintroduce a timezone the data never
 * had, and a fill logged on the 1st would fall out of a range starting on the
 * 1st for anyone west of UTC. String comparison on ISO dates sorts correctly by
 * construction, so the whole module stays in that space.
 */

export const REPORT_RANGE_PRESETS = [
  "last-30-days",
  "last-3-months",
  "last-6-months",
  "last-12-months",
  "year-to-date",
  "all-time",
  "custom",
] as const;

export type ReportRangePreset = (typeof REPORT_RANGE_PRESETS)[number];

export type ReportRange = {
  preset: ReportRangePreset;
  /** Inclusive lower bound, `YYYY-MM-DD`. */
  from: string;
  /** Inclusive upper bound, `YYYY-MM-DD`. */
  to: string;
};

export type ResolveReportRangeOptions = {
  /** Required for `custom`; ignored otherwise. */
  from?: string | null;
  to?: string | null;
  today?: Date;
  /** Lower bound for `all-time` — the earliest record across the selection. */
  earliest?: string | null;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isReportRangePreset(value: string): value is ReportRangePreset {
  return REPORT_RANGE_PRESETS.some((preset) => preset === value);
}

/**
 * Narrows any stored date to its calendar day. Accepts both the bare dates the
 * log tables hold and the full timestamps `created_at` columns hold.
 */
export function toIsoDate(value: string | Date | null | undefined): string | null {
  if (value == null) return null;
  if (value instanceof Date) {
    return isValid(value) ? format(value, "yyyy-MM-dd") : null;
  }

  const candidate = value.slice(0, 10);
  if (!ISO_DATE_PATTERN.test(candidate)) return null;

  // The pattern admits 2024-13-45, so the calendar still has to agree.
  return isValid(parseISO(candidate)) ? candidate : null;
}

export function isValidIsoDate(value: string | null | undefined): boolean {
  return toIsoDate(value) != null;
}

/**
 * A window of length N ends today and contains exactly N days or N months of
 * calendar time, both endpoints included. Chaining two consecutive windows
 * therefore covers every day once and none twice.
 */
export function resolveReportRange(
  preset: ReportRangePreset,
  options: ResolveReportRangeOptions = {},
): ReportRange {
  const today = options.today ?? new Date();
  const to = format(today, "yyyy-MM-dd");

  switch (preset) {
    case "last-30-days":
      return { preset, from: format(subDays(today, 29), "yyyy-MM-dd"), to };
    case "last-3-months":
      return { preset, from: format(addDays(subMonths(today, 3), 1), "yyyy-MM-dd"), to };
    case "last-6-months":
      return { preset, from: format(addDays(subMonths(today, 6), 1), "yyyy-MM-dd"), to };
    case "last-12-months":
      return { preset, from: format(addDays(subMonths(today, 12), 1), "yyyy-MM-dd"), to };
    case "year-to-date":
      return { preset, from: format(startOfYear(today), "yyyy-MM-dd"), to };
    case "all-time":
      // No records means an empty window rather than one reaching back forever.
      return { preset, from: toIsoDate(options.earliest) ?? to, to };
    case "custom":
      return resolveCustomRange(options, to);
  }
}

function resolveCustomRange(
  options: ResolveReportRangeOptions,
  fallback: string,
): ReportRange {
  const from = toIsoDate(options.from) ?? fallback;
  const to = toIsoDate(options.to) ?? fallback;

  // A backwards range is a slip in the picker, not a request for no data.
  return from <= to
    ? { preset: "custom", from, to }
    : { preset: "custom", from: to, to: from };
}

export function isDateInRange(
  value: string | null | undefined,
  range: ReportRange,
): boolean {
  const date = toIsoDate(value);
  if (date == null) return false;

  return date >= range.from && date <= range.to;
}

/** Inclusive day count, for per-day and per-month averages. */
export function getReportRangeDayCount(range: ReportRange): number {
  const from = parseISO(range.from);
  const to = parseISO(range.to);
  if (!isValid(from) || !isValid(to)) return 0;

  return Math.max(0, differenceInCalendarDays(to, from) + 1);
}

/** The earliest date across a set of records, for resolving `all-time`. */
export function getEarliestDate(
  values: ReadonlyArray<string | null | undefined>,
): string | null {
  return values.reduce<string | null>((earliest, value) => {
    const date = toIsoDate(value);
    if (date == null) return earliest;
    return earliest == null || date < earliest ? date : earliest;
  }, null);
}
