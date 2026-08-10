import { ui } from "@/content/en/ui";
import { getCurrencySymbol } from "@/utils/formatting";
import type { ReportDataset } from "@/utils/reports/report-dataset";

/**
 * The CSV export: one flat, chronological ledger rather than a file per record
 * type, so it opens anywhere and sorts and pivots without preparation. Excel
 * gets the per-type sheets; this is the lowest common denominator on purpose.
 *
 * Values are raw numbers, never formatted money — a spreadsheet cannot sum
 * "₹1,200.00". The currency and distance units are named in the headers instead.
 */

/**
 * Excel on Windows reads a UTF-8 CSV as the system codepage unless the file
 * opens with a byte-order mark, which turns every ₹ into mojibake. This app is
 * India-first, so the BOM is not optional.
 */
export const UTF8_BOM = "\uFEFF";

/** RFC 4180 says CRLF, and it is the ending Excel is least surprised by. */
const ROW_SEPARATOR = "\r\n";

type CsvCell = string | number | null;

/**
 * Characters that make a spreadsheet treat a cell as a formula rather than
 * text. `notes`, `location`, `charger_network` and `service_type` are all free
 * text, so a value like `=HYPERLINK(...)` typed into a note would execute on
 * open. Prefixing with an apostrophe is the standard mitigation: the cell
 * renders as the literal text it always was.
 *
 * Only text cells go through this. Numbers are produced by this module rather
 * than by the user, so guarding them would corrupt every negative value.
 */
const FORMULA_TRIGGERS = ["=", "+", "-", "@", "\t", "\r"];

export function guardCsvText(value: string): string {
  return FORMULA_TRIGGERS.some((trigger) => value.startsWith(trigger))
    ? `'${value}`
    : value;
}

export function escapeCsvCell(cell: CsvCell): string {
  if (cell == null) return "";
  if (typeof cell === "number") {
    return Number.isFinite(cell) ? String(cell) : "";
  }

  const guarded = guardCsvText(cell);
  const needsQuoting =
    /[",\r\n]/.test(guarded) || guarded !== guarded.trim() || guarded.startsWith("'");

  return needsQuoting ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

function toCsvRow(cells: CsvCell[]): string {
  return cells.map(escapeCsvCell).join(",");
}

/** Rounds for display without dragging float noise into the file. */
function round(value: number | null | undefined, decimals: number): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Number(value.toFixed(decimals));
}

type LedgerRow = {
  date: string;
  vehicleLabel: string;
  recordType: string;
  cells: CsvCell[];
};

function buildHeader(dataset: ReportDataset): string[] {
  const { columns } = ui.reports;
  const currency = getCurrencySymbol(dataset.units.currency);
  const distance = dataset.units.distanceUnit;

  return [
    columns.vehicle,
    columns.date,
    columns.recordType,
    columns.detail,
    columns.odometer(distance),
    columns.quantity,
    columns.quantityUnit,
    columns.unitPrice(currency),
    columns.cost(currency),
    columns.efficiency,
    columns.efficiencyUnit,
    columns.batteryPercent,
    columns.displayedRange(distance),
    columns.network,
    columns.location,
    columns.estimated,
    columns.notes,
  ];
}

function buildEnergyRows(dataset: ReportDataset): LedgerRow[] {
  const { recordType, fillType, chargeSource, yes } = ui.reports;

  return dataset.energyRows.map((row) => {
    const isCharge = row.energyType === "charge";
    const detail = isCharge
      ? chargeSource[row.chargeSource ?? "other"]
      : fillType[row.fillType ?? "full"];

    return {
      date: row.date,
      vehicleLabel: row.vehicleLabel,
      recordType: isCharge ? recordType.charge : recordType.fuel,
      cells: [
        row.vehicleLabel,
        row.date,
        isCharge ? recordType.charge : recordType.fuel,
        detail,
        round(row.odometer, 0),
        round(row.quantity, 3),
        isCharge ? "kWh" : dataset.units.volumeUnit,
        round(row.unitPrice, 3),
        round(row.cost, 2),
        round(row.efficiency, 3),
        row.efficiency == null
          ? null
          : isCharge
            ? dataset.units.evEfficiencyUnit
            : dataset.units.fuelEfficiencyUnit,
        null,
        null,
        row.chargerNetwork,
        row.location,
        row.isEstimated ? yes : null,
        null,
      ],
    };
  });
}

function buildMaintenanceRows(dataset: ReportDataset): LedgerRow[] {
  const { recordType } = ui.reports;

  return dataset.maintenanceRows.map((row) => ({
    date: row.date,
    vehicleLabel: row.vehicleLabel,
    recordType: recordType.maintenance,
    cells: [
      row.vehicleLabel,
      row.date,
      recordType.maintenance,
      row.serviceType,
      round(row.odometer, 0),
      null,
      null,
      null,
      round(row.cost, 2),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      row.notes,
    ],
  }));
}

function buildSnapshotRows(dataset: ReportDataset): LedgerRow[] {
  const { recordType, snapshotSource } = ui.reports;

  return dataset.snapshotRows.map((row) => ({
    date: row.date,
    vehicleLabel: row.vehicleLabel,
    recordType: recordType.snapshot,
    cells: [
      row.vehicleLabel,
      row.date,
      recordType.snapshot,
      snapshotSource[row.source],
      round(row.odometer, 0),
      null,
      null,
      null,
      null,
      null,
      null,
      round(row.socPercent, 1),
      round(row.displayedRange, 0),
      null,
      null,
      null,
      row.notes,
    ],
  }));
}

export function buildReportCsv(dataset: ReportDataset): string {
  const rows = [
    ...buildEnergyRows(dataset),
    ...buildMaintenanceRows(dataset),
    ...buildSnapshotRows(dataset),
  ].sort(
    (left, right) =>
      left.date.localeCompare(right.date) ||
      left.vehicleLabel.localeCompare(right.vehicleLabel) ||
      left.recordType.localeCompare(right.recordType),
  );

  const lines = [
    toCsvRow(buildHeader(dataset)),
    ...rows.map((row) => toCsvRow(row.cells)),
  ];

  // A trailing newline: POSIX tools treat a file without one as truncated.
  return `${UTF8_BOM}${lines.join(ROW_SEPARATOR)}${ROW_SEPARATOR}`;
}
