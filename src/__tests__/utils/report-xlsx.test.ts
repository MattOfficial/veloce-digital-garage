import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import type { VehicleWithLogs } from "@/types/database";
import {
  buildReportDataset,
  type ReportOptions,
  type ReportUnits,
} from "@/utils/reports/report-dataset";
import {
  buildReportWorkbook,
  renderReportWorkbook,
} from "@/utils/reports/report-xlsx";
import * as factories from "@/__tests__/factories";

const UNITS: ReportUnits = {
  currency: "INR",
  distanceUnit: "km",
  volumeUnit: "Liters",
  fuelEfficiencyUnit: "km/L",
  evEfficiencyUnit: "km/kWh",
};

function makeOptions(overrides: Partial<ReportOptions> = {}): ReportOptions {
  return {
    scope: "vehicle",
    range: { preset: "custom", from: "2026-01-01", to: "2026-12-31" },
    rangeLabel: "2026",
    title: "2024 Honda City",
    sections: ["energy", "maintenance", "vehicle-profile"],
    units: UNITS,
    generatedAt: new Date("2026-08-10T00:00:00Z"),
    ...overrides,
  };
}

const VEHICLE = factories.makeVehicle({
  id: "v-1",
  make: "Honda",
  model: "City",
  year: 2024,
  license_plate: "KA01AB1234",
  baseline_odometer: 10_000,
  fuel_logs: [
    factories.makeFuelLog({
      id: "fuel-a",
      vehicle_id: "v-1",
      date: "2026-03-10",
      odometer: 10_500,
      fuel_volume: 20,
      total_cost: 2_000,
      location: "Shell, MG Road",
    }),
    factories.makeFuelLog({
      id: "fuel-b",
      vehicle_id: "v-1",
      date: "2026-06-15",
      odometer: 11_000,
      fuel_volume: 25,
      total_cost: 2_500,
    }),
  ],
  maintenance_logs: [
    factories.makeMaintenanceLog({
      id: "svc-a",
      vehicle_id: "v-1",
      date: "2026-04-01",
      service_type: "Oil change",
      odometer: 10_700,
      cost: 3_000,
    }),
  ],
});

function workbookFor(
  vehicles: VehicleWithLogs[] = [VEHICLE],
  overrides: Partial<ReportOptions> = {},
) {
  return buildReportWorkbook(buildReportDataset(vehicles, makeOptions(overrides)));
}

function sheetNames(workbook: ExcelJS.Workbook): string[] {
  return workbook.worksheets.map((sheet) => sheet.name);
}

describe("buildReportWorkbook — structure", () => {
  it("opens with a summary and gives each record type its own sheet", () => {
    expect(sheetNames(workbookFor())).toEqual([
      "Summary",
      "Fuel & Charging",
      "Maintenance",
      "Odometer",
      "Vehicles",
    ]);
  });

  it("omits the sheets for sections that were not selected", () => {
    expect(sheetNames(workbookFor([VEHICLE], { sections: ["maintenance"] }))).toEqual([
      "Summary",
      "Maintenance",
    ]);
  });

  it("adds a tyre sheet only when there are tyres to put on it", () => {
    expect(sheetNames(workbookFor())).not.toContain("Tyres");

    const shod = factories.makeVehicle({
      ...VEHICLE,
      tyre_info: { brand: "Michelin", installed_date: "2025-04-01", installed_odo: 9_000 },
    });

    expect(sheetNames(workbookFor([shod]))).toContain("Tyres");
  });

  it("keeps every sheet name within the 31 characters Excel allows", () => {
    for (const name of sheetNames(workbookFor())) {
      expect(name.length).toBeLessThanOrEqual(31);
      expect(name).not.toMatch(/[[\]:*?/\\]/);
    }
  });

  it("freezes the header row and turns on filtering", () => {
    const sheet = workbookFor().getWorksheet("Fuel & Charging");

    expect(sheet?.views?.[0]).toMatchObject({ state: "frozen", ySplit: 1 });
    expect(sheet?.autoFilter).toBeTruthy();
    expect(sheet?.getRow(1).font?.bold).toBe(true);
  });
});

describe("buildReportWorkbook — values", () => {
  it("writes dates as real dates, anchored so no timezone can shift the day", () => {
    const cell = workbookFor().getWorksheet("Fuel & Charging")?.getRow(2).getCell(2);
    const value = cell?.value as Date;

    expect(value).toBeInstanceOf(Date);
    expect(value.getFullYear()).toBe(2026);
    expect(value.getMonth()).toBe(2);
    expect(value.getDate()).toBe(10);
    expect(cell?.numFmt).toBe("dd/mm/yyyy");
  });

  it("writes money as a number carrying a currency format, not as text", () => {
    const cell = workbookFor().getWorksheet("Fuel & Charging")?.getRow(2).getCell(9);

    expect(cell?.value).toBe(2_000);
    expect(cell?.numFmt).toBe('"₹"#,##0.00');
  });

  it("totals the cost column with a live formula and a cached result", () => {
    const sheet = workbookFor().getWorksheet("Fuel & Charging");
    const totalRow = sheet?.getRow(4);

    expect(totalRow?.getCell(9).value).toMatchObject({
      formula: "SUM(I2:I3)",
      result: 4_500,
    });
  });

  it("writes no total row when the sheet has no rows to total", () => {
    const sheet = workbookFor([VEHICLE], {
      range: { preset: "custom", from: "2020-01-01", to: "2020-12-31" },
    }).getWorksheet("Fuel & Charging");

    expect(sheet?.rowCount).toBe(1);
  });

  it("carries the vehicle identity fields", () => {
    const row = workbookFor().getWorksheet("Vehicles")?.getRow(2);

    expect(row?.getCell(1).value).toBe("2024 Honda City");
    expect(row?.getCell(5).value).toBe("KA01AB1234");
    expect(row?.getCell(8).value).toBe("Car");
    expect(row?.getCell(9).value).toBe("Petrol / Diesel");
  });

  it("says what the headline total does and does not count", () => {
    const summary = workbookFor().getWorksheet("Summary");
    const labels = (summary?.getColumn(1).values ?? []).map(String);

    expect(labels).toContain("Total spent");
    expect(labels).toContain("Fuel, charging and service records only");
  });

  it("says so plainly when the window is empty", () => {
    const summary = workbookFor([VEHICLE], {
      range: { preset: "custom", from: "2020-01-01", to: "2020-12-31" },
    }).getWorksheet("Summary");
    const labels = (summary?.getColumn(1).values ?? []).map(String);

    expect(labels).toContain("No records in this period.");
  });
});

describe("buildReportWorkbook — formula injection", () => {
  /**
   * Pins the reasoning behind there being no apostrophe guard in this writer:
   * a string reaches the file as a shared string, which Excel never evaluates.
   * If exceljs ever started promoting a leading `=` into a formula cell, this
   * fails and the guard becomes necessary.
   */
  it("stores a leading = as literal text rather than promoting it to a formula", () => {
    const attacker = factories.makeVehicle({
      id: "v-evil",
      baseline_odometer: 0,
      maintenance_logs: [
        factories.makeMaintenanceLog({
          id: "svc-evil",
          vehicle_id: "v-evil",
          date: "2026-05-01",
          service_type: '=HYPERLINK("http://evil","click")',
          cost: 10,
        }),
      ],
    });

    const cell = workbookFor([attacker]).getWorksheet("Maintenance")?.getRow(2).getCell(3);

    expect(cell?.type).toBe(ExcelJS.ValueType.String);
    expect(cell?.value).toBe('=HYPERLINK("http://evil","click")');
  });

  it("does not add an apostrophe that would corrupt the note", () => {
    const cell = workbookFor().getWorksheet("Fuel & Charging")?.getRow(2).getCell(13);

    expect(cell?.value).toBe("Shell, MG Road");
  });
});

describe("renderReportWorkbook", () => {
  it("serialises to a real xlsx file", async () => {
    const buffer = await renderReportWorkbook(
      buildReportDataset([VEHICLE], makeOptions()),
    );

    expect(buffer.length).toBeGreaterThan(0);
    // xlsx is a zip container; "PK" is its magic number.
    expect(buffer.subarray(0, 2).toString()).toBe("PK");
  });

  it("round-trips through a reader with its values intact", async () => {
    const buffer = await renderReportWorkbook(
      buildReportDataset([VEHICLE], makeOptions()),
    );

    const reopened = new ExcelJS.Workbook();
    await reopened.xlsx.load(buffer);

    expect(sheetNames(reopened)).toContain("Fuel & Charging");
    expect(reopened.getWorksheet("Fuel & Charging")?.getRow(2).getCell(9).value).toBe(2_000);
  });
});
