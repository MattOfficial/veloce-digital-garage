import { describe, expect, it } from "vitest";

import type { VehicleWithLogs } from "@/types/database";
import {
  buildReportCsv,
  escapeCsvCell,
  guardCsvText,
  UTF8_BOM,
} from "@/utils/reports/report-csv";
import {
  buildReportDataset,
  type ReportOptions,
  type ReportUnits,
} from "@/utils/reports/report-dataset";
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
    title: "Test report",
    sections: ["energy", "maintenance", "vehicle-profile"],
    units: UNITS,
    generatedAt: new Date("2026-08-10T00:00:00Z"),
    ...overrides,
  };
}

function csvFor(vehicles: VehicleWithLogs[], overrides: Partial<ReportOptions> = {}) {
  return buildReportCsv(buildReportDataset(vehicles, makeOptions(overrides)));
}

function bodyLines(csv: string): string[] {
  return csv.replace(UTF8_BOM, "").trimEnd().split("\r\n");
}

describe("guardCsvText", () => {
  it("neutralises every formula trigger", () => {
    expect(guardCsvText("=1+1")).toBe("'=1+1");
    expect(guardCsvText("+44 7700 900000")).toBe("'+44 7700 900000");
    expect(guardCsvText("-500 refund")).toBe("'-500 refund");
    expect(guardCsvText("@import")).toBe("'@import");
    expect(guardCsvText("\tstart")).toBe("'\tstart");
  });

  it("leaves ordinary text untouched", () => {
    expect(guardCsvText("Oil change")).toBe("Oil change");
    expect(guardCsvText("Shell, MG Road")).toBe("Shell, MG Road");
    // A trigger anywhere but the first character is inert.
    expect(guardCsvText("Service = done")).toBe("Service = done");
  });
});

describe("escapeCsvCell", () => {
  it("writes an empty cell for nothing", () => {
    expect(escapeCsvCell(null)).toBe("");
    expect(escapeCsvCell(Number.NaN)).toBe("");
  });

  it("writes numbers bare, so a spreadsheet can sum them", () => {
    expect(escapeCsvCell(1200.5)).toBe("1200.5");
    // The guard must never reach a number, or every negative becomes text.
    expect(escapeCsvCell(-500)).toBe("-500");
  });

  it("quotes fields holding a separator, a quote or a newline", () => {
    expect(escapeCsvCell("Shell, MG Road")).toBe('"Shell, MG Road"');
    expect(escapeCsvCell('He said "hi"')).toBe('"He said ""hi"""');
    expect(escapeCsvCell("line one\nline two")).toBe('"line one\nline two"');
  });

  it("quotes a guarded value so the apostrophe survives the round trip", () => {
    expect(escapeCsvCell("=1+1")).toBe("\"'=1+1\"");
  });

  it("quotes padded text, which a parser would otherwise trim", () => {
    expect(escapeCsvCell(" leading")).toBe('" leading"');
  });
});

describe("buildReportCsv", () => {
  const vehicle = factories.makeVehicle({
    id: "v-1",
    make: "Honda",
    model: "City",
    year: 2024,
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
    ],
    maintenance_logs: [
      factories.makeMaintenanceLog({
        id: "svc-a",
        vehicle_id: "v-1",
        date: "2026-04-01",
        service_type: "Oil change",
        odometer: 10_700,
        cost: 3_000,
        notes: "Synthetic",
      }),
    ],
  });

  it("opens with a byte-order mark so Excel reads UTF-8", () => {
    expect(csvFor([vehicle]).startsWith(UTF8_BOM)).toBe(true);
  });

  it("separates rows with CRLF and ends the file with one", () => {
    const csv = csvFor([vehicle]);

    expect(csv.endsWith("\r\n")).toBe(true);
    expect(csv).toContain("\r\n");
  });

  it("names the currency and distance units in the headers", () => {
    const header = bodyLines(csvFor([vehicle]))[0];

    expect(header).toContain("Odometer (km)");
    expect(header).toContain("Cost (₹)");
    expect(header).toContain("Unit price (₹)");
  });

  it("writes one chronological ledger across record types", () => {
    const lines = bodyLines(csvFor([vehicle]));

    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain("2026-03-10");
    expect(lines[1]).toContain("Fuel");
    expect(lines[2]).toContain("2026-04-01");
    expect(lines[2]).toContain("Service");
  });

  it("writes costs as raw numbers rather than formatted money", () => {
    const fuelLine = bodyLines(csvFor([vehicle]))[1];

    expect(fuelLine).toContain("2000");
    expect(fuelLine).not.toContain("₹2,000");
  });

  it("quotes a location holding a comma without splitting the row", () => {
    const fuelLine = bodyLines(csvFor([vehicle]))[1];

    expect(fuelLine).toContain('"Shell, MG Road"');
  });

  it("neutralises a formula typed into a free-text field", () => {
    const attacker = factories.makeVehicle({
      id: "v-2",
      baseline_odometer: 0,
      maintenance_logs: [
        factories.makeMaintenanceLog({
          id: "svc-evil",
          vehicle_id: "v-2",
          date: "2026-05-01",
          service_type: "=HYPERLINK(\"http://evil\",\"click\")",
          cost: 10,
          notes: "@SUM(A1:A9)",
        }),
      ],
    });

    const line = bodyLines(csvFor([attacker]))[1];

    expect(line).toContain("\"'=HYPERLINK");
    expect(line).toContain("\"'@SUM(A1:A9)\"");
  });

  it("labels a charge row with its source and energy unit", () => {
    const ev = factories.makeEvVehicle({
      id: "v-ev",
      baseline_odometer: 1_000,
      fuel_logs: [
        factories.makeChargeLog({
          id: "chg-a",
          vehicle_id: "v-ev",
          date: "2026-02-01",
          odometer: 1_100,
          fuel_volume: 3,
          total_cost: 30,
          charge_source: "dc_fast",
          charger_network: "Statiq",
        }),
      ],
    });

    const line = bodyLines(csvFor([ev]))[1];

    expect(line).toContain("Charge");
    expect(line).toContain("DC fast");
    expect(line).toContain("kWh");
    expect(line).toContain("Statiq");
  });

  it("carries odometer snapshots with their battery reading", () => {
    const ev = factories.makeEvVehicle({
      id: "v-ev",
      baseline_odometer: 1_000,
      vehicle_snapshots: [
        factories.makeSnapshot({
          id: "snap-a",
          vehicle_id: "v-ev",
          date: "2026-02-05",
          odometer: 1_150,
          soc_percent: 64,
          source: "manual",
        }),
      ],
    });

    const line = bodyLines(csvFor([ev]))[1];

    expect(line).toContain("Odometer reading");
    expect(line).toContain("Manual entry");
    expect(line).toContain("64");
  });

  it("flags a row the app generated rather than the owner", () => {
    const withEstimate = factories.makeVehicle({
      id: "v-3",
      baseline_odometer: 0,
      fuel_logs: [
        factories.makeFuelLog({
          id: "fuel-est",
          vehicle_id: "v-3",
          date: "2026-01-02",
          is_estimated: true,
        }),
      ],
    });

    expect(bodyLines(csvFor([withEstimate]))[1]).toContain("Yes");
  });

  it("writes a header-only file for an empty window", () => {
    const lines = bodyLines(
      csvFor([vehicle], { range: { preset: "custom", from: "2020-01-01", to: "2020-12-31" } }),
    );

    expect(lines).toHaveLength(1);
  });
});
