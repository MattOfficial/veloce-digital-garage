/**
 * Palette for the PDF report.
 *
 * A printed report has one surface and no theme toggle, so these are the light
 * steps only. The three categorical hues are slots 1-3 of the validated
 * categorical order, assigned to the report's three fixed cost categories and
 * never reassigned — a report with no charging in it leaves the slot empty
 * rather than promoting service into it.
 *
 * Validated at three slots against a light surface: worst all-pairs CVD ΔE 9.2
 * (deutan), worst normal-vision ΔE 24.0. Aqua sits at 2.74:1 against the page,
 * below the 3:1 line, so it carries the relief the rule requires — every series
 * is named in a legend with its value, and the same numbers appear in the
 * tables further down the document.
 */
export const REPORT_SERIES_COLORS = {
  fuel: "#2a78d6",
  charge: "#eb6834",
  maintenance: "#1baf7a",
} as const;

export type ReportSeriesKey = keyof typeof REPORT_SERIES_COLORS;

export const REPORT_COLORS = {
  text: "#0b0b0b",
  secondary: "#52514e",
  muted: "#8a8985",
  border: "#e2e2df",
  surface: "#ffffff",
  surfaceMuted: "#f6f6f4",
  accent: "#2a78d6",
} as const;

/** A 2px gap in the page colour keeps adjacent fills from reading as one mark. */
export const SERIES_GAP = 2;

/**
 * Hues for the per-vehicle spend split, in the same fixed categorical order.
 *
 * Three is the cap the palette can actually carry: validated at four slots the
 * orange/yellow pair falls to a normal-vision ΔE of 13.7, below the floor of 15
 * that no amount of labelling excuses. Vehicles past the third fold into a
 * neutral residual, which is not a categorical slot and so does not compete.
 */
export const REPORT_VEHICLE_COLORS = ["#2a78d6", "#eb6834", "#1baf7a"] as const;

export const MAX_VEHICLE_SLICES = REPORT_VEHICLE_COLORS.length;

export const REPORT_OTHER_COLOR = "#8a8985";
