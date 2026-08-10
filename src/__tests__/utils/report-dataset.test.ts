import { describe, expect, it } from "vitest";

import type { VehicleWithLogs } from "@/types/database";
import {
  buildReportDataset,
  getEarliestRecordDate,
  getReportVehicleLabel,
  isReportScope,
  isReportSection,
  type ReportOptions,
  type ReportSection,
  type ReportUnits,
} from "@/utils/reports/report-dataset";
import type { ReportRange } from "@/utils/reports/report-range";
import * as factories from "@/__tests__/factories";

const UNITS: ReportUnits = {
  currency: "INR",
  distanceUnit: "km",
  volumeUnit: "Liters",
  fuelEfficiencyUnit: "km/L",
  evEfficiencyUnit: "km/kWh",
};

const FULL_YEAR: ReportRange = {
  preset: "custom",
  from: "2026-01-01",
  to: "2026-12-31",
};

function makeOptions(overrides: Partial<ReportOptions> = {}): ReportOptions {
  return {
    scope: "vehicle",
    range: FULL_YEAR,
    rangeLabel: "2026",
    title: "Test report",
    sections: ["energy", "maintenance", "vehicle-profile"] satisfies ReportSection[],
    units: UNITS,
    generatedAt: new Date("2026-08-10T00:00:00Z"),
    ...overrides,
  };
}

/** Baseline 10,000 km; fills at 10,500 and 11,000 close two 500 km segments. */
function makePetrolVehicle(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
  return factories.makeVehicle({
    id: "v-petrol",
    make: "Honda",
    model: "City",
    year: 2024,
    baseline_odometer: 10_000,
    fuel_logs: [
      factories.makeFuelLog({
        id: "fuel-a",
        vehicle_id: "v-petrol",
        date: "2026-03-10",
        odometer: 10_500,
        fuel_volume: 20,
        total_cost: 2_000,
      }),
      factories.makeFuelLog({
        id: "fuel-b",
        vehicle_id: "v-petrol",
        date: "2026-06-15",
        odometer: 11_000,
        fuel_volume: 25,
        total_cost: 2_500,
      }),
    ],
    maintenance_logs: [
      factories.makeMaintenanceLog({
        id: "svc-a",
        vehicle_id: "v-petrol",
        date: "2026-04-01",
        service_type: "Oil change",
        odometer: 10_700,
        cost: 3_000,
      }),
    ],
    ...overrides,
  });
}

/** Two SoC-anchored charges 90 km apart on 3 kWh: exactly 30 km/kWh. */
function makeEvVehicle(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
  return factories.makeEvVehicle({
    id: "v-ev",
    baseline_odometer: 1_000,
    fuel_logs: [
      factories.makeChargeLog({
        id: "chg-a",
        vehicle_id: "v-ev",
        date: "2026-03-01",
        odometer: 1_000,
        fuel_volume: 3,
        total_cost: 30,
        start_soc: 20,
        end_soc: 100,
      }),
      factories.makeChargeLog({
        id: "chg-b",
        vehicle_id: "v-ev",
        date: "2026-03-20",
        odometer: 1_090,
        fuel_volume: 3,
        total_cost: 30,
        start_soc: 20,
        end_soc: 100,
      }),
    ],
    ...overrides,
  });
}

describe("getReportVehicleLabel", () => {
  it("prefers the nickname", () => {
    expect(
      getReportVehicleLabel({
        nickname: "Daily",
        year: 2024,
        make: "Honda",
        model: "City",
      }),
    ).toBe("Daily");
  });

  it("falls back to year, make and model", () => {
    expect(
      getReportVehicleLabel({ nickname: null, year: 2024, make: "Honda", model: "City" }),
    ).toBe("2024 Honda City");
  });
});

describe("scope and section guards", () => {
  it("accepts known values only", () => {
    expect(isReportScope("garage")).toBe(true);
    expect(isReportScope("fleet")).toBe(false);
    expect(isReportSection("energy")).toBe(true);
    expect(isReportSection("documents")).toBe(false);
  });
});

describe("getEarliestRecordDate", () => {
  it("reaches across every record type and every vehicle", () => {
    const vehicle = factories.makeVehicle({
      fuel_logs: [factories.makeFuelLog({ date: "2025-06-01" })],
      maintenance_logs: [factories.makeMaintenanceLog({ date: "2024-02-20" })],
      vehicle_snapshots: [factories.makeSnapshot({ date: "2025-01-01" })],
      custom_logs: [factories.makeCustomLog({ date: "2023-09-09" })],
    });

    expect(getEarliestRecordDate([vehicle])).toBe("2023-09-09");
  });

  it("returns null for an empty garage", () => {
    expect(getEarliestRecordDate([])).toBeNull();
  });
});

describe("buildReportDataset — row selection", () => {
  it("keeps only records inside the window", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions({
      range: { preset: "custom", from: "2026-04-01", to: "2026-12-31" },
    }));

    expect(dataset.energyRows.map((row) => row.date)).toEqual(["2026-06-15"]);
    expect(dataset.maintenanceRows.map((row) => row.date)).toEqual(["2026-04-01"]);
  });

  it("sorts rows by date", () => {
    const vehicle = makePetrolVehicle({
      fuel_logs: [
        factories.makeFuelLog({ id: "late", date: "2026-06-15", odometer: 11_000 }),
        factories.makeFuelLog({ id: "early", date: "2026-01-05", odometer: 10_200 }),
      ],
    });

    const dataset = buildReportDataset([vehicle], makeOptions());

    expect(dataset.energyRows.map((row) => row.date)).toEqual([
      "2026-01-05",
      "2026-06-15",
    ]);
  });

  it("derives a unit price and leaves it null when no quantity was recorded", () => {
    const vehicle = makePetrolVehicle({
      fuel_logs: [
        factories.makeFuelLog({ id: "priced", date: "2026-02-01", fuel_volume: 20, total_cost: 2_000 }),
        factories.makeFuelLog({ id: "unpriced", date: "2026-02-02", fuel_volume: 0, total_cost: 500 }),
      ],
    });

    const dataset = buildReportDataset([vehicle], makeOptions());

    expect(dataset.energyRows[0].unitPrice).toBe(100);
    expect(dataset.energyRows[1].unitPrice).toBeNull();
  });

  it("omits a section's rows when it is not selected", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle()],
      makeOptions({ sections: ["maintenance"] }),
    );

    expect(dataset.energyRows).toHaveLength(0);
    expect(dataset.snapshotRows).toHaveLength(0);
    expect(dataset.maintenanceRows).toHaveLength(1);
    expect(dataset.sections).toEqual(["maintenance"]);
  });

  it("reports an empty window rather than failing", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions({
      range: { preset: "custom", from: "2020-01-01", to: "2020-12-31" },
    }));

    expect(dataset.isEmpty).toBe(true);
    expect(dataset.summary.totalCost).toBe(0);
    expect(dataset.charts.costMix).toEqual([]);
  });
});

describe("buildReportDataset — efficiency", () => {
  it("attaches segment efficiency to the fill that closes it", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    // 10,000 -> 10,500 on 20 L, then 10,500 -> 11,000 on 25 L.
    expect(dataset.energyRows[0].efficiency).toBeCloseTo(25, 6);
    expect(dataset.energyRows[1].efficiency).toBeCloseTo(20, 6);
  });

  it("measures a segment from history outside the window, not from the window's first row", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions({
      range: { preset: "custom", from: "2026-05-01", to: "2026-12-31" },
    }));

    // The 10,500 fill sits outside the window but still sets the baseline. Were
    // it dropped, this would read 1,000 km / 25 L = 40 km/L.
    expect(dataset.energyRows).toHaveLength(1);
    expect(dataset.energyRows[0].efficiency).toBeCloseTo(20, 6);
  });

  it("weights the average by distance rather than averaging the ratios", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    // 1,000 km on 45 L is 22.22, not the 22.5 a mean of 25 and 20 would give.
    expect(dataset.summary.fuelEfficiency).toBeCloseTo(1_000 / 45, 6);
  });

  it("derives charge efficiency from state of charge", () => {
    const dataset = buildReportDataset([makeEvVehicle()], makeOptions());

    expect(dataset.summary.chargeEfficiency).toBeCloseTo(30, 6);
    expect(dataset.summary.fuelEfficiency).toBeNull();
  });

  it("falls back to distance over energy when no segment can be measured", () => {
    // Top-ups logged without percentages anchor no segment, which left the
    // efficiency card empty on a vehicle whose distance and kWh were both known.
    const scooter = factories.makeEvVehicle({
      id: "v-ev",
      baseline_odometer: 0,
      fuel_logs: [
        factories.makeChargeLog({ id: "c1", vehicle_id: "v-ev", date: "2026-08-04", odometer: 46, fuel_volume: 1.4 }),
        factories.makeChargeLog({ id: "c2", vehicle_id: "v-ev", date: "2026-08-07", odometer: 86, fuel_volume: 2.6 }),
        factories.makeChargeLog({ id: "c3", vehicle_id: "v-ev", date: "2026-08-08", odometer: 120, fuel_volume: 1 }),
        factories.makeChargeLog({ id: "c4", vehicle_id: "v-ev", date: "2026-08-10", odometer: 159, fuel_volume: 1 }),
      ],
    });

    const dataset = buildReportDataset([scooter], makeOptions());

    // 159 - 46 = 113 km on 6 kWh bought.
    expect(dataset.vehicles[0].distanceCovered).toBe(113);
    expect(dataset.vehicles[0].chargeEfficiency).toBeCloseTo(113 / 6, 6);
    expect(dataset.summary.chargeEfficiency).toBeCloseTo(113 / 6, 6);
  });

  it("prefers a measured segment over the whole-period ratio", () => {
    // The EV fixture's sessions carry percentages, so segments exist and win.
    const dataset = buildReportDataset([makeEvVehicle()], makeOptions());

    expect(dataset.vehicles[0].chargeEfficiency).toBeCloseTo(30, 6);
  });

  it("has no charge efficiency without distance to divide", () => {
    const scooter = factories.makeEvVehicle({
      id: "v-ev",
      baseline_odometer: 0,
      fuel_logs: [
        factories.makeChargeLog({ id: "c1", vehicle_id: "v-ev", date: "2026-08-04", odometer: 46, fuel_volume: 1.4 }),
      ],
    });

    expect(buildReportDataset([scooter], makeOptions()).vehicles[0].chargeEfficiency).toBeNull();
  });

  it("converts into the owner's chosen units", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle()],
      makeOptions({ units: { ...UNITS, fuelEfficiencyUnit: "L/100km" } }),
    );

    expect(dataset.summary.fuelEfficiency).toBeCloseTo(100 / (1_000 / 45), 6);
  });
});

describe("buildReportDataset — summary", () => {
  it("totals exactly what the report contains", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    expect(dataset.summary.fuelCost).toBe(4_500);
    expect(dataset.summary.maintenanceCost).toBe(3_000);
    expect(dataset.summary.totalCost).toBe(7_500);
    expect(dataset.summary.fuelVolume).toBe(45);
  });

  it("drops a deselected section from the total", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle()],
      makeOptions({ sections: ["energy"] }),
    );

    expect(dataset.summary.maintenanceCost).toBe(0);
    expect(dataset.summary.totalCost).toBe(4_500);
  });

  it("separates fuel spend from charge spend", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle(), makeEvVehicle()],
      makeOptions({ scope: "garage" }),
    );

    expect(dataset.summary.fuelCost).toBe(4_500);
    expect(dataset.summary.chargeCost).toBe(60);
    expect(dataset.summary.energyCost).toBe(4_560);
    expect(dataset.summary.counts.vehicles).toBe(2);
    expect(dataset.summary.counts.fuelLogs).toBe(2);
    expect(dataset.summary.counts.chargeLogs).toBe(2);
  });

  it("measures distance between the window's own readings", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    // 10,500 through 11,000, with the 10,700 service reading in between.
    expect(dataset.vehicles[0].odometerStart).toBe(10_500);
    expect(dataset.vehicles[0].odometerEnd).toBe(11_000);
    expect(dataset.summary.distanceCovered).toBe(500);
    expect(dataset.summary.costPerDistance).toBeCloseTo(15, 6);
  });

  it("counts from the vehicle's starting odometer when tracking began in the window", () => {
    // The reported case: a new scooter at 159 km whose first charge was logged
    // at 46 reported 113 km, dropping the first 46 km while still counting all
    // the energy. Its starting odometer is a reading, dated to when it was added.
    const newScooter = factories.makeEvVehicle({
      id: "v-new",
      baseline_odometer: 0,
      created_at: "2026-08-01T09:00:00Z",
      fuel_logs: [
        factories.makeChargeLog({ id: "c1", vehicle_id: "v-new", date: "2026-08-04", odometer: 46, fuel_volume: 1.4 }),
        factories.makeChargeLog({ id: "c2", vehicle_id: "v-new", date: "2026-08-10", odometer: 159, fuel_volume: 4.6 }),
      ],
    });

    const dataset = buildReportDataset([newScooter], makeOptions());

    expect(dataset.vehicles[0].odometerStart).toBe(0);
    expect(dataset.vehicles[0].distanceCovered).toBe(159);
    // 159 km on the 6 kWh bought — the same figure the app shows lifetime.
    expect(dataset.vehicles[0].chargeEfficiency).toBeCloseTo(159 / 6, 6);
  });

  it("ignores a starting odometer from before the window", () => {
    // Anchoring on a two-year-old baseline would charge the window with every
    // kilometre since the vehicle was bought.
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    expect(dataset.vehicles[0].odometerStart).toBe(10_500);
    expect(dataset.vehicles[0].distanceCovered).toBe(500);
  });

  it("reports no distance when the window holds a single reading", () => {
    const vehicle = makePetrolVehicle({ maintenance_logs: [] });
    const dataset = buildReportDataset([vehicle], makeOptions({
      range: { preset: "custom", from: "2026-05-01", to: "2026-12-31" },
    }));

    expect(dataset.vehicles[0].distanceCovered).toBeNull();
    expect(dataset.summary.distanceCovered).toBeNull();
    expect(dataset.summary.costPerDistance).toBeNull();
  });

  it("counts distance from records the report does not list", () => {
    // Energy is deselected, but the fills still say how far the vehicle went.
    const dataset = buildReportDataset(
      [makePetrolVehicle()],
      makeOptions({ sections: ["maintenance"] }),
    );

    expect(dataset.summary.distanceCovered).toBe(500);
  });
});

describe("buildReportDataset — charts", () => {
  it("buckets spend into every month of the window", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    expect(dataset.charts.monthlySpend).toHaveLength(12);
    const march = dataset.charts.monthlySpend.find((point) => point.key === "2026-03");
    const april = dataset.charts.monthlySpend.find((point) => point.key === "2026-04");
    expect(march).toMatchObject({ fuel: 2_000, maintenance: 0, total: 2_000 });
    expect(april).toMatchObject({ fuel: 0, maintenance: 3_000, total: 3_000 });
  });

  it("labels months with the year when the window crosses one", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions({
      range: { preset: "custom", from: "2025-11-01", to: "2026-02-28" },
    }));

    expect(dataset.charts.monthlySpend.map((point) => point.label)).toEqual([
      "Nov 25",
      "Dec 25",
      "Jan 26",
      "Feb 26",
    ]);
  });

  it("labels months without the year inside a single one", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions({
      range: { preset: "custom", from: "2026-03-01", to: "2026-05-31" },
    }));

    expect(dataset.charts.monthlySpend.map((point) => point.label)).toEqual([
      "Mar",
      "Apr",
      "May",
    ]);
  });

  it("drops empty slices instead of drawing invisible wedges", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    expect(dataset.charts.costMix).toEqual([
      { key: "fuel", value: 4_500 },
      { key: "maintenance", value: 3_000 },
    ]);
  });

  it("charts efficiency for a single vehicle", () => {
    const dataset = buildReportDataset([makePetrolVehicle()], makeOptions());

    expect(dataset.charts.efficiency?.mode).toBe("fuel");
    expect(dataset.charts.efficiency?.unit).toBe("km/L");
    expect(dataset.charts.efficiency?.points).toHaveLength(2);
  });

  it("drops the efficiency line once a second vehicle is in scope", () => {
    // A hatchback and a scooter share no efficiency axis, and averaging them
    // would produce a number that describes neither.
    const dataset = buildReportDataset(
      [makePetrolVehicle(), makeEvVehicle()],
      makeOptions({ scope: "garage" }),
    );

    expect(dataset.charts.efficiency).toBeNull();
  });

  it("splits spend by vehicle, largest first", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle(), makeEvVehicle()],
      makeOptions({ scope: "garage" }),
    );

    expect(dataset.charts.spendByVehicle).toEqual([
      { vehicleId: "v-petrol", label: "2024 Honda City", value: 7_500 },
      { vehicleId: "v-ev", label: "2024 Ather 450X", value: 60 },
    ]);
  });

  it("leaves a vehicle that cost nothing out of the split", () => {
    const idle = factories.makeVehicle({ id: "v-idle", make: "Tata", model: "Nexon" });
    const dataset = buildReportDataset(
      [makePetrolVehicle(), idle],
      makeOptions({ scope: "garage" }),
    );

    expect(dataset.charts.spendByVehicle.map((slice) => slice.vehicleId)).toEqual([
      "v-petrol",
    ]);
  });

  it("has no efficiency series when nothing closed a segment", () => {
    const vehicle = makePetrolVehicle({
      fuel_logs: [
        factories.makeFuelLog({ id: "partial", date: "2026-02-01", fill_type: "partial" }),
      ],
    });

    expect(buildReportDataset([vehicle], makeOptions()).charts.efficiency).toBeNull();
  });
});

describe("buildReportDataset — vehicle profile", () => {
  it("carries the identity fields a handover pack needs", () => {
    const vehicle = makePetrolVehicle({
      vin: "  MA3ERLF1S00123456 ",
      license_plate: "KA01AB1234",
      color: "",
      nickname: "Daily",
    });

    const profile = buildReportDataset([vehicle], makeOptions()).vehicles[0];

    expect(profile.label).toBe("Daily");
    expect(profile.vin).toBe("MA3ERLF1S00123456");
    expect(profile.licensePlate).toBe("KA01AB1234");
    expect(profile.color).toBeNull();
  });

  it("reads per-corner tyres", () => {
    const vehicle = makePetrolVehicle({
      tyre_info: {
        front_left: { brand: "Michelin", installed_date: "2025-04-01", installed_odo: 9_000 },
        rear_right: { brand: "Michelin", installed_date: "2025-04-01", installed_odo: 9_000 },
      },
    });

    const tyres = buildReportDataset([vehicle], makeOptions()).vehicles[0].tyres;

    expect(tyres).toHaveLength(2);
    expect(tyres.map((tyre) => tyre.position)).toEqual(["front_left", "rear_right"]);
    expect(tyres[0].brand).toBe("Michelin");
  });

  it("falls back to the set-level tyre shape", () => {
    const vehicle = makePetrolVehicle({
      tyre_info: { brand: "CEAT", installed_date: "2025-04-01", installed_odo: 9_000 },
    });

    const tyres = buildReportDataset([vehicle], makeOptions()).vehicles[0].tyres;

    expect(tyres).toEqual([
      {
        position: "all",
        brand: "CEAT",
        installedDate: "2025-04-01",
        installedOdometer: 9_000,
        treadDepth: null,
        dotCode: null,
      },
    ]);
  });

  it("carries each vehicle's own spend and efficiency", () => {
    const dataset = buildReportDataset(
      [makePetrolVehicle(), makeEvVehicle()],
      makeOptions({ scope: "garage" }),
    );

    const [petrol, ev] = dataset.vehicles;

    expect(petrol.totalCost).toBe(7_500);
    expect(petrol.fuelEfficiency).toBeCloseTo(1_000 / 45, 6);
    expect(petrol.chargeEfficiency).toBeNull();

    // The scooter's figures must not be contaminated by the car's.
    expect(ev.totalCost).toBe(60);
    expect(ev.fuelEfficiency).toBeNull();
    expect(ev.chargeEfficiency).toBeCloseTo(30, 6);
  });

  it("has no tyres to report when none were recorded", () => {
    expect(buildReportDataset([makePetrolVehicle()], makeOptions()).vehicles[0].tyres).toEqual(
      [],
    );
  });

  it("treats each charge session as a check-in", () => {
    // The odometer and the level charged to are already recorded; listing only
    // hand-entered rows made an EV look like it had lost its readings.
    const dataset = buildReportDataset([makeEvVehicle()], makeOptions());

    expect(dataset.snapshotRows).toHaveLength(2);
    expect(dataset.snapshotRows[0]).toMatchObject({
      date: "2026-03-01",
      odometer: 1_000,
      socPercent: 100,
      source: "charge",
    });
  });

  it("reads a full charge as 100% even with no percentage typed", () => {
    const vehicle = factories.makeEvVehicle({
      id: "v-ev",
      fuel_logs: [
        factories.makeChargeLog({
          id: "chg-full",
          vehicle_id: "v-ev",
          date: "2026-02-01",
          odometer: 1_200,
          end_soc: null,
          charged_to_full: true,
        }),
      ],
    });

    expect(buildReportDataset([vehicle], makeOptions()).snapshotRows[0]).toMatchObject({
      socPercent: 100,
      source: "charge",
    });
  });

  it("leaves the battery blank when the session says nothing about it", () => {
    const vehicle = factories.makeEvVehicle({
      id: "v-ev",
      fuel_logs: [
        factories.makeChargeLog({
          id: "chg-quiet",
          vehicle_id: "v-ev",
          date: "2026-02-01",
          odometer: 1_200,
          end_soc: null,
          charged_to_full: null,
        }),
      ],
    });

    expect(buildReportDataset([vehicle], makeOptions()).snapshotRows[0]).toMatchObject({
      socPercent: null,
      odometer: 1_200,
    });
  });

  it("does not derive check-ins from fill-ups or from its own estimates", () => {
    const vehicle = factories.makeVehicle({
      id: "v-mixed",
      baseline_odometer: 0,
      fuel_logs: [
        factories.makeFuelLog({ id: "f1", vehicle_id: "v-mixed", date: "2026-02-01" }),
        factories.makeChargeLog({
          id: "c1",
          vehicle_id: "v-mixed",
          date: "2026-02-02",
          end_soc: 90,
          is_estimated: true,
        }),
      ],
    });

    expect(buildReportDataset([vehicle], makeOptions()).snapshotRows).toEqual([]);
  });

  it("interleaves derived and hand-entered check-ins by date", () => {
    const vehicle = factories.makeEvVehicle({
      ...makeEvVehicle(),
      vehicle_snapshots: [
        factories.makeSnapshot({
          id: "snap-a",
          vehicle_id: "v-ev",
          date: "2026-03-10",
          odometer: 1_050,
          soc_percent: 55,
        }),
      ],
    });

    const dataset = buildReportDataset([vehicle], makeOptions());

    expect(dataset.snapshotRows.map((row) => [row.date, row.source])).toEqual([
      ["2026-03-01", "charge"],
      ["2026-03-10", "manual"],
      ["2026-03-20", "charge"],
    ]);
  });

  it("includes odometer snapshots with the profile section", () => {
    const vehicle = makePetrolVehicle({
      vehicle_snapshots: [
        factories.makeSnapshot({
          id: "snap-a",
          vehicle_id: "v-petrol",
          date: "2026-05-01",
          odometer: 10_900,
          soc_percent: null,
        }),
      ],
    });

    const dataset = buildReportDataset([vehicle], makeOptions());

    expect(dataset.snapshotRows).toHaveLength(1);
    expect(dataset.snapshotRows[0]).toMatchObject({
      date: "2026-05-01",
      odometer: 10_900,
      source: "manual",
    });
  });
});
