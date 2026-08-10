import { ui } from "@/content/en/ui";
import { formatTableDate, getCurrencyCode, getCurrencySymbol } from "@/utils/formatting";
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

/**
 * What the window is called on the cover. A preset says what was asked for
 * ("Last 6 months"); a custom window has to state its own dates, because
 * "Custom range" tells the reader nothing.
 */
export function getReportRangeLabel(range: ReportRange): string {
  if (range.preset === "custom") {
    return ui.reports.customRangeLabel(
      formatTableDate(range.from),
      formatTableDate(range.to),
    );
  }

  return ui.reports.rangeLabels[range.preset];
}

/**
 * Currency symbols the PDF's built-in Helvetica can actually draw.
 *
 * The standard PDF fonts carry the WinAnsi character set, which predates the
 * rupee sign — U+20B9 falls through to .notdef and renders as nothing at all,
 * which on an India-first app means every amount in the report loses its
 * currency. Verified against a Devanagari glyph Helvetica certainly lacks: the
 * rupee behaves like that one, not like the euro. Rather than bundle a whole
 * typeface for one character, unsupported currencies fall back to their ISO
 * code, which is what a financial document would print anyway.
 */
const PDF_SAFE_CURRENCY_SYMBOLS = new Set(["$", "£", "€", "¥"]);

export function getPdfCurrencyLabel(currency?: string | null): string {
  const symbol = getCurrencySymbol(currency);

  return PDF_SAFE_CURRENCY_SYMBOLS.has(symbol) ? symbol : getCurrencyCode(currency);
}

/**
 * Substitutes for characters the built-in PDF fonts cannot draw.
 *
 * Same root cause as the rupee sign: the standard 14 fonts carry WinAnsi, and
 * anything outside it is dropped silently rather than shown as a box. That made
 * every em dash vanish — including `ui.common.emptyValue`, so every empty cell
 * in every report rendered blank rather than as a dash.
 *
 * Typography stays correct everywhere else; only the PDF degrades, and only to
 * the nearest character that actually exists.
 */
const PDF_TEXT_SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/[‐-―]/g, "-"], // hyphens and dashes of every width
  [/[‘’‛]/g, "'"],
  [/[“”]/g, '"'],
  [/•/g, "*"],
  [/…/g, "..."],
  [/₹/g, "INR "],
];

/**
 * Makes a string safe to render in the PDF. Applied at the leaves — table
 * cells, stat tiles, headings — so user-typed notes and nicknames go through it
 * too, not just the app's own copy.
 */
export function toPdfText(value: string): string {
  return PDF_TEXT_SUBSTITUTIONS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

/**
 * Grouping is pinned rather than left to the host. This runs on a server whose
 * locale is an accident of deployment, and a report whose thousands separators
 * change between environments is a report nobody trusts.
 */
const PDF_LOCALE = "en-GB";

export function formatPdfNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(PDF_LOCALE, {
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

export function formatPdfMoney(value: number, currency?: string | null): string {
  const label = getPdfCurrencyLabel(currency);
  const amount = formatPdfNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // A code needs air around it; a symbol reads as part of the number.
  return label.length > 1 ? `${label} ${amount}` : `${label}${amount}`;
}
