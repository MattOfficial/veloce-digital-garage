import type { ReportRange } from "@/utils/reports/report-range";
import type { ReportScope } from "@/utils/reports/report-dataset";

export const REPORT_FORMATS = ["pdf", "xlsx", "csv"] as const;
export type ReportFormat = (typeof REPORT_FORMATS)[number];

export function isReportFormat(value: string): value is ReportFormat {
  return REPORT_FORMATS.some((format) => format === value);
}

export const REPORT_MIME_TYPES: Record<ReportFormat, string> = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv; charset=utf-8",
};

const MAX_SLUG_LENGTH = 48;

/**
 * A filename fragment safe to put in a `Content-Disposition` header.
 *
 * The character class is an allowlist rather than a denylist, which is what
 * makes this safe: a nickname holding a quote, a newline or `../` cannot travel
 * into the header or the filesystem, because nothing outside `[a-z0-9-]`
 * survives. A title with no Latin characters at all — a nickname in Devanagari,
 * say — slugs to nothing, so the scope stands in rather than the file arriving
 * called `-`.
 */
export function slugifyReportTitle(title: string, scope: ReportScope): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");

  return slug || (scope === "garage" ? "garage" : "vehicle");
}

export function buildReportFilename(
  options: { title: string; scope: ReportScope; range: ReportRange },
  format: ReportFormat,
): string {
  const slug = slugifyReportTitle(options.title, options.scope);

  return `veloce-${slug}-${options.range.from}-to-${options.range.to}.${format}`;
}
