import ExcelJS from "exceljs";

import { ui } from "@/content/en/ui";
import { getCurrencySymbol } from "@/utils/formatting";
import type { ReportDataset } from "@/utils/reports/report-dataset";
import { getTyrePositionLabel } from "@/utils/reports/report-format";

/**
 * The Excel export: a sheet per record type, with real dates and real numbers
 * so the file sorts, filters and pivots like data rather than like a printout.
 *
 * No formula guard here, deliberately. A string written into a `.xlsx` cell is
 * stored as a shared string, and Excel never evaluates one — the injection that
 * makes CSV dangerous does not exist in this format. Prefixing an apostrophe
 * anyway would show it as part of the value, corrupting the very notes it was
 * meant to protect. `report-xlsx.test.ts` pins that behaviour.
 */

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1E293B" },
};

const SECTION_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF1F5F9" },
};

const INTEGER_FORMAT = "#,##0";
const QUANTITY_FORMAT = "#,##0.000";
const DECIMAL_FORMAT = "#,##0.00";
const DATE_FORMAT = "dd/mm/yyyy";

function currencyFormat(currency: string): string {
  return `"${getCurrencySymbol(currency)}"#,##0.00`;
}

/**
 * Excel stores a date as a day number, and the conversion runs through the
 * host's timezone. Anchoring at local noon means no offset within +/-12h can
 * push the value onto the day before or after — which for a fill logged at
 * midnight is otherwise a real, silent, off-by-one.
 */
function toExcelDate(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day, 12, 0, 0);
}

type ColumnSpec = {
  header: string;
  width: number;
  format?: string;
};

function addSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  columns: ColumnSpec[],
): ExcelJS.Worksheet {
  const sheet = workbook.addWorksheet(name);

  sheet.columns = columns.map((column) => ({
    header: column.header,
    width: column.width,
    style: column.format ? { numFmt: column.format } : undefined,
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = HEADER_FILL;
  headerRow.alignment = { vertical: "middle" };
  headerRow.height = 20;

  // The header has to stay put; a service history runs to hundreds of rows.
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columns.length },
  };

  return sheet;
}

/**
 * A live SUM rather than a baked number, so the total survives the user
 * deleting a row. The cached result keeps it correct in readers that do not
 * recalculate on open.
 */
function addTotalRow(
  sheet: ExcelJS.Worksheet,
  columnIndex: number,
  rowCount: number,
  total: number,
  label: string,
  format: string,
) {
  if (rowCount === 0) return;

  const letter = sheet.getColumn(columnIndex).letter;
  const row = sheet.addRow([]);
  row.getCell(1).value = label;
  row.getCell(columnIndex).value = {
    formula: `SUM(${letter}2:${letter}${rowCount + 1})`,
    result: total,
    date1904: false,
  };
  row.font = { bold: true };
  row.getCell(columnIndex).numFmt = format;
}

function buildSummarySheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { summary: copy } = ui.reports;
  const { summary, units } = dataset;
  const sheet = workbook.addWorksheet(ui.reports.sheets.summary);

  sheet.columns = [
    { width: 34 },
    { width: 22 },
  ];

  const titleRow = sheet.addRow([dataset.title]);
  titleRow.font = { bold: true, size: 16 };
  sheet.addRow([dataset.rangeLabel]).font = { color: { argb: "FF475569" } };
  sheet.addRow([
    copy.generated(new Date(dataset.generatedAt).toLocaleDateString("en-GB")),
  ]).font = { color: { argb: "FF475569" } };
  sheet.addRow([`${dataset.range.from} — ${dataset.range.to}`]).font = {
    color: { argb: "FF475569" },
  };

  if (dataset.isEmpty) {
    sheet.addRow([]);
    sheet.addRow([copy.noRecords]).font = { italic: true };
    return;
  }

  const money = currencyFormat(units.currency);

  const section = (heading: string) => {
    sheet.addRow([]);
    const row = sheet.addRow([heading]);
    row.font = { bold: true };
    row.fill = SECTION_FILL;
  };

  const entry = (label: string, value: number | string | null, format?: string) => {
    const row = sheet.addRow([label, value ?? ui.common.emptyValue]);
    if (format != null && typeof value === "number") {
      row.getCell(2).numFmt = format;
    }
  };

  section(copy.totalsHeading);
  entry(copy.totalSpent, summary.totalCost, money);
  sheet.addRow([copy.totalSpentNote]).font = {
    italic: true,
    size: 9,
    color: { argb: "FF64748B" },
  };
  entry(copy.fuel, summary.fuelCost, money);
  entry(copy.charging, summary.chargeCost, money);
  entry(copy.service, summary.maintenanceCost, money);

  section(copy.drivingHeading);
  entry(copy.distanceCovered, summary.distanceCovered, INTEGER_FORMAT);
  entry(copy.costPerDistance(units.distanceUnit), summary.costPerDistance, money);
  entry(
    `${copy.fuelEfficiency} (${units.fuelEfficiencyUnit})`,
    summary.fuelEfficiency,
    DECIMAL_FORMAT,
  );
  entry(
    `${copy.chargeEfficiency} (${units.evEfficiencyUnit})`,
    summary.chargeEfficiency,
    DECIMAL_FORMAT,
  );

  section(copy.recordsHeading);
  entry(copy.vehicles, summary.counts.vehicles, INTEGER_FORMAT);
  entry(copy.fuelLogs, summary.counts.fuelLogs, INTEGER_FORMAT);
  entry(copy.chargeLogs, summary.counts.chargeLogs, INTEGER_FORMAT);
  entry(copy.maintenanceLogs, summary.counts.maintenanceLogs, INTEGER_FORMAT);
  entry(copy.snapshots, summary.counts.snapshots, INTEGER_FORMAT);
}

function buildEnergySheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { columns, recordType, fillType, chargeSource, yes } = ui.reports;
  const { units } = dataset;
  const money = currencyFormat(units.currency);

  const sheet = addSheet(workbook, ui.reports.sheets.energy, [
    { header: columns.vehicle, width: 24 },
    { header: columns.date, width: 13, format: DATE_FORMAT },
    { header: columns.recordType, width: 10 },
    { header: columns.detail, width: 14 },
    { header: columns.odometer(units.distanceUnit), width: 14, format: INTEGER_FORMAT },
    { header: columns.quantity, width: 12, format: QUANTITY_FORMAT },
    { header: columns.quantityUnit, width: 12 },
    { header: columns.unitPrice(getCurrencySymbol(units.currency)), width: 14, format: money },
    { header: columns.cost(getCurrencySymbol(units.currency)), width: 14, format: money },
    { header: columns.efficiency, width: 12, format: DECIMAL_FORMAT },
    { header: columns.efficiencyUnit, width: 14 },
    { header: columns.network, width: 16 },
    { header: columns.location, width: 26 },
    { header: columns.estimated, width: 11 },
  ]);

  for (const row of dataset.energyRows) {
    const isCharge = row.energyType === "charge";

    sheet.addRow([
      row.vehicleLabel,
      toExcelDate(row.date),
      isCharge ? recordType.charge : recordType.fuel,
      isCharge
        ? chargeSource[row.chargeSource ?? "other"]
        : fillType[row.fillType ?? "full"],
      row.odometer,
      row.quantity,
      isCharge ? "kWh" : units.volumeUnit,
      row.unitPrice,
      row.cost,
      row.efficiency,
      row.efficiency == null
        ? null
        : isCharge
          ? units.evEfficiencyUnit
          : units.fuelEfficiencyUnit,
      row.chargerNetwork,
      row.location,
      row.isEstimated ? yes : null,
    ]);
  }

  addTotalRow(
    sheet,
    9,
    dataset.energyRows.length,
    dataset.summary.energyCost,
    ui.reports.summary.totalSpent,
    money,
  );
}

function buildMaintenanceSheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { columns } = ui.reports;
  const { units } = dataset;

  const sheet = addSheet(workbook, ui.reports.sheets.maintenance, [
    { header: columns.vehicle, width: 24 },
    { header: columns.date, width: 13, format: DATE_FORMAT },
    { header: columns.detail, width: 28 },
    { header: columns.odometer(units.distanceUnit), width: 14, format: INTEGER_FORMAT },
    {
      header: columns.cost(getCurrencySymbol(units.currency)),
      width: 14,
      format: currencyFormat(units.currency),
    },
    { header: columns.notes, width: 40 },
  ]);

  for (const row of dataset.maintenanceRows) {
    sheet.addRow([
      row.vehicleLabel,
      toExcelDate(row.date),
      row.serviceType,
      row.odometer,
      row.cost,
      row.notes,
    ]);
  }

  addTotalRow(
    sheet,
    5,
    dataset.maintenanceRows.length,
    dataset.summary.maintenanceCost,
    ui.reports.summary.totalSpent,
    currencyFormat(units.currency),
  );
}

function buildSnapshotSheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { columns, snapshotSource } = ui.reports;
  const { units } = dataset;

  const sheet = addSheet(workbook, ui.reports.sheets.snapshots, [
    { header: columns.vehicle, width: 24 },
    { header: columns.date, width: 13, format: DATE_FORMAT },
    { header: columns.odometer(units.distanceUnit), width: 14, format: INTEGER_FORMAT },
    { header: columns.batteryPercent, width: 12, format: DECIMAL_FORMAT },
    { header: columns.displayedRange(units.distanceUnit), width: 18, format: INTEGER_FORMAT },
    { header: columns.source, width: 16 },
    { header: columns.notes, width: 40 },
  ]);

  for (const row of dataset.snapshotRows) {
    sheet.addRow([
      row.vehicleLabel,
      toExcelDate(row.date),
      row.odometer,
      row.socPercent,
      row.displayedRange,
      snapshotSource[row.source],
      row.notes,
    ]);
  }
}

function buildVehicleSheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { columns, vehicleColumns, vehicleType } = ui.reports;
  const { units } = dataset;

  const sheet = addSheet(workbook, ui.reports.sheets.vehicles, [
    { header: columns.vehicle, width: 24 },
    { header: vehicleColumns.make, width: 16 },
    { header: vehicleColumns.model, width: 18 },
    { header: vehicleColumns.year, width: 8 },
    { header: vehicleColumns.registration, width: 16 },
    { header: vehicleColumns.vin, width: 22 },
    { header: vehicleColumns.color, width: 12 },
    { header: vehicleColumns.type, width: 13 },
    { header: vehicleColumns.powertrain, width: 17 },
    { header: vehicleColumns.engine, width: 16 },
    { header: vehicleColumns.transmission, width: 16 },
    { header: vehicleColumns.batteryCapacity, width: 14, format: DECIMAL_FORMAT },
    { header: vehicleColumns.usableBattery, width: 14, format: DECIMAL_FORMAT },
    { header: vehicleColumns.odometerStart(units.distanceUnit), width: 18, format: INTEGER_FORMAT },
    { header: vehicleColumns.odometerEnd(units.distanceUnit), width: 18, format: INTEGER_FORMAT },
    { header: vehicleColumns.distanceCovered(units.distanceUnit), width: 15, format: INTEGER_FORMAT },
  ]);

  for (const vehicle of dataset.vehicles) {
    sheet.addRow([
      vehicle.label,
      vehicle.make,
      vehicle.model,
      vehicle.year,
      vehicle.licensePlate,
      vehicle.vin,
      vehicle.color,
      vehicleType[vehicle.vehicleType],
      vehicle.energyDescription,
      vehicle.engineType,
      vehicle.transmission,
      vehicle.batteryCapacityKwh,
      vehicle.usableBatteryKwh,
      vehicle.odometerStart,
      vehicle.odometerEnd,
      vehicle.distanceCovered,
    ]);
  }
}

function buildTyreSheet(workbook: ExcelJS.Workbook, dataset: ReportDataset) {
  const { columns, tyreColumns } = ui.reports;
  const { units } = dataset;

  const sheet = addSheet(workbook, ui.reports.sheets.tyres, [
    { header: columns.vehicle, width: 24 },
    { header: tyreColumns.position, width: 14 },
    { header: tyreColumns.brand, width: 18 },
    { header: tyreColumns.fitted, width: 13, format: DATE_FORMAT },
    { header: tyreColumns.fittedOdometer(units.distanceUnit), width: 16, format: INTEGER_FORMAT },
    { header: tyreColumns.treadDepth, width: 12, format: DECIMAL_FORMAT },
    { header: tyreColumns.dotCode, width: 12 },
  ]);

  for (const vehicle of dataset.vehicles) {
    for (const tyre of vehicle.tyres) {
      sheet.addRow([
        vehicle.label,
        getTyrePositionLabel(tyre.position, vehicle.vehicleType),
        tyre.brand,
        tyre.installedDate == null ? null : toExcelDate(tyre.installedDate),
        tyre.installedOdometer,
        tyre.treadDepth,
        tyre.dotCode,
      ]);
    }
  }
}

export function buildReportWorkbook(dataset: ReportDataset): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Veloce Digital Garage";
  workbook.created = new Date(dataset.generatedAt);

  buildSummarySheet(workbook, dataset);

  if (dataset.sections.includes("energy")) {
    buildEnergySheet(workbook, dataset);
  }

  if (dataset.sections.includes("maintenance")) {
    buildMaintenanceSheet(workbook, dataset);
  }

  if (dataset.sections.includes("vehicle-profile")) {
    buildSnapshotSheet(workbook, dataset);
    buildVehicleSheet(workbook, dataset);

    // A tab of nothing but headings is worse than no tab.
    if (dataset.vehicles.some((vehicle) => vehicle.tyres.length > 0)) {
      buildTyreSheet(workbook, dataset);
    }
  }

  return workbook;
}

export async function renderReportWorkbook(dataset: ReportDataset): Promise<Buffer> {
  return Buffer.from(await buildReportWorkbook(dataset).xlsx.writeBuffer());
}
