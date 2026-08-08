import { describe, expect, it } from "vitest";

import type { FuelLog, VehicleSnapshot, VehicleWithLogs } from "@/types/database";
import {
  buildChargeSegments,
  buildEvEnergySummary,
  buildEvLifetimeEnergySummary,
  summarizeChargeEfficiency,
  summarizeChargingLoss,
  summarizePackCapacity,
} from "@/utils/ev-energy-analytics";
import * as factories from "@/__tests__/factories";

const CURRENT_DATE = new Date("2026-07-31T00:00:00Z");

function makeSnapshot(overrides: Partial<VehicleSnapshot> = {}): VehicleSnapshot {
  return factories.makeSnapshot({
    id: "snap-1",
    date: "2026-07-01",
    odometer: 1000,
    created_at: "2026-07-01T10:00:00Z",
    ...overrides,
  });
}

function makeChargeLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return factories.makeChargeLog({
    date: "2026-07-10",
    odometer: 1250,
    fuel_volume: 6,
    total_cost: 90,
    charge_source: "dc_fast",
    rate_per_unit: 15,
    start_soc: 20,
    end_soc: 80,
    charger_network: "Ather Grid",
    location: "Indiranagar",
    created_at: "2026-07-10T10:00:00Z",
    ...overrides,
  });
}

function makeVehicle(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
  return factories.makeEvVehicle({
    current_odometer: 1600,
    rated_range_km: 150,
    baseline_range_km: 110,
    battery_warranty_years: 3,
    battery_warranty_km: 30000,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  });
}

/** 600 km covered across the trailing 30 days, with one deep discharge. */
function makeRidingHistory(): VehicleSnapshot[] {
  return [
    makeSnapshot({ id: "s0", date: "2026-06-25", odometer: 1000, soc_percent: 100 }),
    makeSnapshot({ id: "s1", date: "2026-07-02", odometer: 1100, soc_percent: 50 }),
    makeSnapshot({ id: "s2", date: "2026-07-08", odometer: 1200, soc_percent: 15 }),
    makeSnapshot({ id: "s3", date: "2026-07-14", odometer: 1350, soc_percent: 60 }),
    makeSnapshot({ id: "s4", date: "2026-07-22", odometer: 1480, soc_percent: 45 }),
    makeSnapshot({ id: "s5", date: "2026-07-30", odometer: 1600, soc_percent: 30 }),
  ];
}

describe("buildChargeSegments", () => {
  it("attributes energy by the state of charge the driving consumed", () => {
    // Session 2 replaced 50% but the ride had used 70%, so 1.4x its energy is
    // what that 100 km actually cost.
    const segments = buildChargeSegments([
      makeChargeLog({
        id: "c1",
        date: "2026-07-01",
        odometer: 1000,
        start_soc: 20,
        end_soc: 100,
        fuel_volume: 3.2,
        total_cost: 25.6,
      }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-06",
        odometer: 1100,
        start_soc: 30,
        end_soc: 80,
        fuel_volume: 2,
        total_cost: 16,
      }),
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0].method).toBe("soc-corrected");
    expect(segments[0].distance).toBe(100);
    expect(segments[0].energyKwh).toBeCloseTo(2.8, 5);
    expect(segments[0].cost).toBeCloseTo(22.4, 5);
    expect(segments[0].distancePerKwh).toBeCloseTo(35.714, 3);
    expect(segments[0].usable).toBe(true);
  });

  it("collapses to the full-tank method when both sessions end at 100%", () => {
    // The whole argument for not requiring a full charge: it is the special
    // case where the correction ratio is exactly 1.
    const segments = buildChargeSegments([
      makeChargeLog({ id: "c1", date: "2026-07-01", odometer: 1000, start_soc: 20, end_soc: 100 }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-08",
        odometer: 1150,
        start_soc: 25,
        end_soc: 100,
        fuel_volume: 3,
        total_cost: 24,
      }),
    ]);

    expect(segments[0].energyKwh).toBeCloseTo(3, 10);
    expect(segments[0].distancePerKwh).toBeCloseTo(150 / 3, 10);
  });

  it("falls back to full-charge anchors when no percentages were logged", () => {
    // Classic full-tank method: the partial in the middle accumulates into the
    // segment that the second full charge closes.
    const noSoc = { start_soc: null, end_soc: null } as const;
    const segments = buildChargeSegments([
      makeChargeLog({
        id: "c1",
        date: "2026-07-01",
        odometer: 1000,
        charged_to_full: true,
        fuel_volume: 3,
        total_cost: 24,
        ...noSoc,
      }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-05",
        odometer: 1100,
        charged_to_full: false,
        fuel_volume: 1,
        total_cost: 8,
        ...noSoc,
      }),
      makeChargeLog({
        id: "c3",
        date: "2026-07-11",
        odometer: 1250,
        charged_to_full: true,
        fuel_volume: 2.5,
        total_cost: 20,
        ...noSoc,
      }),
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0].method).toBe("full-charge-anchor");
    expect(segments[0].startLogId).toBe("c1");
    expect(segments[0].endLogId).toBe("c3");
    expect(segments[0].distance).toBe(250);
    // The opening session's own energy went in before the driving started.
    expect(segments[0].energyKwh).toBeCloseTo(3.5, 5);
    expect(segments[0].cost).toBeCloseTo(28, 5);
  });

  it("produces nothing when there is neither a percentage nor a full charge", () => {
    const segments = buildChargeSegments([
      makeChargeLog({
        id: "c1",
        date: "2026-07-01",
        odometer: 1000,
        start_soc: null,
        end_soc: null,
        charged_to_full: false,
      }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-05",
        odometer: 1100,
        start_soc: null,
        end_soc: null,
        charged_to_full: false,
      }),
    ]);

    expect(segments).toHaveLength(0);
  });

  it("refuses to credit a session with implausibly more driving than it replaced", () => {
    // 75% used against 5% added means a charge went unlogged in between.
    const segments = buildChargeSegments([
      makeChargeLog({ id: "c1", date: "2026-07-01", odometer: 1000, start_soc: 20, end_soc: 80 }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-20",
        odometer: 1900,
        start_soc: 5,
        end_soc: 10,
        charged_to_full: false,
      }),
    ]);

    expect(segments).toHaveLength(0);
  });

  it("marks a segment unusable when the odometer did not move", () => {
    const segments = buildChargeSegments([
      makeChargeLog({ id: "c1", date: "2026-07-01", odometer: 1000, start_soc: 20, end_soc: 100 }),
      makeChargeLog({ id: "c2", date: "2026-07-02", odometer: 1000, start_soc: 90, end_soc: 100 }),
    ]);

    expect(segments[0].usable).toBe(false);
    expect(segments[0].rejection).toBe("no-distance");
  });

  it("rejects a segment whose efficiency is far off the rest", () => {
    const base = [1000, 1100, 1200, 1300].map((odometer, index) =>
      makeChargeLog({
        id: `c${index}`,
        date: `2026-07-0${index + 1}`,
        odometer,
        start_soc: 20,
        end_soc: 100,
        fuel_volume: 3,
        total_cost: 24,
      }),
    );

    // A 900 km jump on the same charge could only come from an unlogged session.
    const withOutlier = [
      ...base,
      makeChargeLog({
        id: "c-outlier",
        date: "2026-07-09",
        odometer: 2200,
        start_soc: 20,
        end_soc: 100,
        fuel_volume: 3,
        total_cost: 24,
      }),
    ];

    const segments = buildChargeSegments(withOutlier);
    const outlier = segments.find((segment) => segment.endLogId === "c-outlier");

    expect(outlier?.usable).toBe(false);
    expect(outlier?.rejection).toBe("outlier");
    expect(segments.filter((segment) => segment.usable)).toHaveLength(3);
  });

  it("ignores liquid fuel rows", () => {
    const segments = buildChargeSegments([
      factories.makeFuelLog({ id: "f1", odometer: 1000 }),
      factories.makeFuelLog({ id: "f2", odometer: 1100 }),
    ]);

    expect(segments).toHaveLength(0);
  });
});

describe("summarizeChargeEfficiency", () => {
  function evenlySpacedSessions(count: number): FuelLog[] {
    return Array.from({ length: count }, (_, index) =>
      makeChargeLog({
        id: `c${index}`,
        date: `2026-07-${String(index * 2 + 1).padStart(2, "0")}`,
        odometer: 1000 + index * 100,
        start_soc: 20,
        end_soc: 100,
        fuel_volume: 3,
        total_cost: 24,
      }),
    );
  }

  it("reports the median rate across usable segments", () => {
    const summary = summarizeChargeEfficiency(evenlySpacedSessions(4));

    expect(summary.usableSegmentCount).toBe(3);
    expect(summary.distancePerKwh).toBeCloseTo(100 / 3, 5);
    expect(summary.costPerDistance).toBeCloseTo(0.24, 5);
    expect(summary.method).toBe("soc-corrected");
  });

  it("withholds a figure until there are enough segments", () => {
    const summary = summarizeChargeEfficiency(evenlySpacedSessions(2));

    expect(summary.usableSegmentCount).toBe(1);
    expect(summary.distancePerKwh).toBeNull();
    expect(summary.confidence).toBe("low");
  });

  it("has no confidence and no rate with nothing logged", () => {
    const summary = summarizeChargeEfficiency([]);

    expect(summary.confidence).toBe("none");
    expect(summary.distancePerKwh).toBeNull();
    expect(summary.unanchoredSessionCount).toBe(0);
  });

  it("reaches high confidence on a long, consistent history", () => {
    const summary = summarizeChargeEfficiency(evenlySpacedSessions(8));

    expect(summary.confidence).toBe("high");
    expect(summary.consistencyScore).toBeGreaterThan(60);
  });

  it("falls back to lifetime distance over lifetime energy with one session", () => {
    // The case that showed an empty card: a single charge produces no segment.
    const summary = summarizeChargeEfficiency(
      [makeChargeLog({ id: "c1", fuel_volume: 2.6 })],
      { lifetimeDistance: 91 },
    );

    expect(summary.usableSegmentCount).toBe(0);
    expect(summary.basis).toBe("lifetime");
    expect(summary.distancePerKwh).toBeCloseTo(35, 5);
    expect(summary.confidence).toBe("low");
    expect(summary.method).toBeNull();
  });

  it("divides lifetime cost by lifetime distance for the running cost", () => {
    const summary = summarizeChargeEfficiency(
      [makeChargeLog({ id: "c1", fuel_volume: 2.6, total_cost: 16.38 })],
      { lifetimeDistance: 100 },
    );

    expect(summary.costPerDistance).toBeCloseTo(0.1638, 5);
  });

  it("prefers measured segments over the lifetime ratio once they exist", () => {
    const summary = summarizeChargeEfficiency(evenlySpacedSessions(4), {
      lifetimeDistance: 10_000,
    });

    expect(summary.basis).toBe("segments");
    expect(summary.distancePerKwh).toBeCloseTo(100 / 3, 5);
  });

  it("reports no basis at all when there is no distance to divide by", () => {
    const summary = summarizeChargeEfficiency([makeChargeLog({ id: "c1" })], {
      lifetimeDistance: null,
    });

    expect(summary.basis).toBe("none");
    expect(summary.distancePerKwh).toBeNull();
  });

  it("counts sessions that never anchored a segment", () => {
    const summary = summarizeChargeEfficiency([
      makeChargeLog({
        id: "c1",
        date: "2026-07-01",
        odometer: 1000,
        start_soc: null,
        end_soc: null,
        charged_to_full: false,
      }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-05",
        odometer: 1100,
        start_soc: null,
        end_soc: null,
        charged_to_full: false,
      }),
      makeChargeLog({
        id: "c3",
        date: "2026-07-09",
        odometer: 1200,
        start_soc: null,
        end_soc: null,
        charged_to_full: false,
      }),
    ]);

    expect(summary.unanchoredSessionCount).toBe(2);
  });
});

describe("summarizePackCapacity", () => {
  it("tracks apparent pack size across full charges", () => {
    const summary = summarizePackCapacity([
      makeChargeLog({
        id: "c1",
        date: "2026-01-05",
        start_soc: 10,
        end_soc: 100,
        fuel_volume: 3.6,
      }),
      makeChargeLog({
        id: "c2",
        date: "2026-07-05",
        start_soc: 10,
        end_soc: 100,
        fuel_volume: 3.42,
      }),
    ]);

    expect(summary.measurements).toHaveLength(2);
    expect(summary.baselineApparentKwh).toBeCloseTo(4, 5);
    expect(summary.latestApparentKwh).toBeCloseTo(3.8, 5);
    expect(summary.stateOfHealthPercent).toBeCloseTo(95, 5);
  });

  it("holds back state of health until there is something to compare", () => {
    const summary = summarizePackCapacity([
      makeChargeLog({ id: "c1", start_soc: 10, end_soc: 100, fuel_volume: 3.6 }),
    ]);

    expect(summary.latestApparentKwh).toBeCloseTo(4, 5);
    expect(summary.stateOfHealthPercent).toBeNull();
  });

  it("has nothing to say without a full charge", () => {
    const summary = summarizePackCapacity([makeChargeLog({ start_soc: 20, end_soc: 80 })]);

    expect(summary.measurements).toHaveLength(0);
    expect(summary.latestApparentKwh).toBeNull();
  });
});

describe("summarizeChargingLoss", () => {
  it("takes the median loss across sessions that recorded both figures", () => {
    // 2 kWh metered against 50% of a 3 kWh pack (1.5 kWh) is a 25% loss.
    const loss = summarizeChargingLoss(
      [
        makeChargeLog({ id: "c1", start_soc: 20, end_soc: 70, fuel_volume: 2 }),
        makeChargeLog({ id: "c2", start_soc: 20, end_soc: 70, fuel_volume: 2 }),
      ],
      3,
    );

    expect(loss).toBeCloseTo(0.25, 5);
  });

  it("is unavailable when no session carries both a meter reading and a percentage", () => {
    expect(
      summarizeChargingLoss(
        [makeChargeLog({ start_soc: null, end_soc: null })],
        3,
      ),
    ).toBeNull();
  });

  it("is unavailable without a pack size", () => {
    expect(summarizeChargingLoss([makeChargeLog()], null)).toBeNull();
  });
});

describe("buildEvEnergySummary", () => {
  it("totals what was logged and does not top it up with a guess", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({ id: "c1", date: "2026-07-05", odometer: 1150, fuel_volume: 2, total_cost: 30 }),
        makeChargeLog({ id: "c2", date: "2026-07-20", odometer: 1450, fuel_volume: 3, total_cost: 45 }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 30,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.sessionCount).toBe(2);
    expect(summary.period.loggedEnergyKwh).toBeCloseTo(5, 5);
    expect(summary.period.loggedCost).toBeCloseTo(75, 5);
    // The old model would have added distance x Wh/km on top of this.
    expect(summary.period.inferredEnergyKwh).toBeNull();
    expect(summary.period.totalEnergyKwh).toBeCloseTo(5, 5);
    expect(summary.period.totalCost).toBeCloseTo(75, 5);
    expect(summary.period.basis).toBe("measured");
  });

  it("falls back to inference only when nothing at all was logged", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 30,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.distance).toBe(600);
    expect(summary.period.inferredEnergyKwh).toBeCloseTo(18, 5);
    expect(summary.period.inferredCost).toBeCloseTo(144, 5);
    expect(summary.period.basis).toBe("inferred");
  });

  it("has no cost basis at all without efficiency or sessions", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.basis).toBe("unavailable");
    expect(summary.period.totalCost).toBeNull();
    expect(summary.period.costPerDistance).toBeNull();
  });

  it("divides logged cost by distance for the running cost", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({ id: "c1", date: "2026-07-05", odometer: 1150, fuel_volume: 4, total_cost: 120 }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.costPerDistance).toBeCloseTo(120 / 600, 5);
  });

  it("splits the charging mix by source and shares out the energy", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({
          id: "c1",
          date: "2026-07-05",
          odometer: 1150,
          charge_source: "home",
          fuel_volume: 6,
          total_cost: 48,
        }),
        makeChargeLog({
          id: "c2",
          date: "2026-07-20",
          odometer: 1450,
          charge_source: "dc_fast",
          fuel_volume: 2,
          total_cost: 40,
        }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });
    const home = summary.mix.entries.find((entry) => entry.source === "home");

    expect(summary.mix.totalEnergyKwh).toBeCloseTo(8, 5);
    expect(home?.share).toBeCloseTo(0.75, 5);
    expect(home?.isEstimated).toBe(false);
    expect(summary.mix.dcFastShare).toBeCloseTo(0.25, 5);
  });

  it("labels inferred home energy as an estimate in the mix", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 30,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });
    const home = summary.mix.entries.find((entry) => entry.source === "home");

    expect(home?.isEstimated).toBe(true);
    expect(home?.sessionCount).toBe(0);
  });

  it("counts a full charge logged without percentages towards battery care", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({
          id: "c1",
          date: "2026-07-05",
          odometer: 1150,
          start_soc: null,
          end_soc: null,
          charged_to_full: true,
        }),
        makeChargeLog({
          id: "c2",
          date: "2026-07-20",
          odometer: 1450,
          start_soc: null,
          end_soc: null,
          charged_to_full: false,
        }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.care.fullChargeCount).toBe(1);
    expect(summary.care.deepDischargeCount).toBe(1);
    expect(summary.care.score).not.toBeNull();
  });

  it("withholds a care score until there are enough observations", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: [makeSnapshot({ soc_percent: 50 })],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.care.band).toBe("insufficient-data");
    expect(summary.care.score).toBeNull();
  });

  it("reads efficiency from the whole history, not just the window", () => {
    // A segment that opened before the window still describes this vehicle.
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({ id: "c1", date: "2026-03-01", odometer: 500, start_soc: 20, end_soc: 100 }),
        makeChargeLog({ id: "c2", date: "2026-04-01", odometer: 600, start_soc: 20, end_soc: 100 }),
        makeChargeLog({ id: "c3", date: "2026-05-01", odometer: 700, start_soc: 20, end_soc: 100 }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.sessionCount).toBe(0);
    expect(summary.efficiency.usableSegmentCount).toBe(2);
    expect(summary.efficiency.distancePerKwh).toBeCloseTo(100 / 6, 5);
  });
});

describe("buildEvLifetimeEnergySummary", () => {
  it("totals every session ever logged", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog({ id: "c1", date: "2026-01-05", odometer: 200, fuel_volume: 3, total_cost: 24 }),
        makeChargeLog({ id: "c2", date: "2026-07-20", odometer: 1450, fuel_volume: 2, total_cost: 40 }),
      ],
    });

    const summary = buildEvLifetimeEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.days).toBeNull();
    expect(summary.period.startDate).toBeNull();
    expect(summary.period.loggedEnergyKwh).toBeCloseTo(5, 5);
    expect(summary.period.loggedCost).toBeCloseTo(64, 5);
  });
});
