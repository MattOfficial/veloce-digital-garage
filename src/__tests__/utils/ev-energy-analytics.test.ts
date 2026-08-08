import { describe, expect, it } from "vitest";

import type { FuelLog, VehicleSnapshot, VehicleWithLogs } from "@/types/database";
import {
  buildEvEnergySummary,
  buildEvLifetimeEnergySummary,
  deriveEnergyFromSocDelta,
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

describe("buildEvEnergySummary", () => {
  it("infers home charging as the energy that logged sessions do not explain", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog()],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    // 600 km at 40 Wh/km is 24 kWh; 6 kWh of that was bought at a fast charger.
    expect(summary.period.distance).toBe(600);
    expect(summary.period.loggedEnergyKwh).toBe(6);
    expect(summary.period.inferredHomeEnergyKwh).toBeCloseTo(18, 6);
    expect(summary.period.inferredHomeCost).toBeCloseTo(144, 6);
    expect(summary.period.totalEnergyKwh).toBeCloseTo(24, 6);
    expect(summary.period.totalCost).toBeCloseTo(234, 6);
    expect(summary.period.costPerDistance).toBeCloseTo(0.39, 6);
    expect(summary.period.basis).toBe("partially-inferred");
  });

  it("never infers negative home energy when logged sessions exceed the estimate", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog({ fuel_volume: 100 })],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.inferredHomeEnergyKwh).toBe(0);
    expect(summary.period.basis).toBe("measured");
  });

  it("reports a fully inferred basis when nothing was logged", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.basis).toBe("inferred");
    expect(summary.period.inferredHomeEnergyKwh).toBeCloseTo(24, 6);
    expect(summary.period.loggedEnergyKwh).toBe(0);
  });

  it("falls back to logged sessions alone when efficiency is unknown", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog()],
    });

    const summary = buildEvEnergySummary(vehicle, {
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.inferredHomeEnergyKwh).toBeNull();
    expect(summary.period.totalEnergyKwh).toBe(6);
    expect(summary.period.totalCost).toBe(90);
    expect(summary.period.basis).toBe("measured");
  });

  it("leaves home cost unknown without a tariff", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.inferredHomeEnergyKwh).toBeCloseTo(24, 6);
    expect(summary.period.inferredHomeCost).toBeNull();
    expect(summary.period.totalCost).toBeNull();
    expect(summary.period.costPerDistance).toBeNull();
  });

  it("splits the charging mix between inferred home energy and logged sessions", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog()],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    const home = summary.mix.entries.find((entry) => entry.source === "home");
    const dcFast = summary.mix.entries.find((entry) => entry.source === "dc_fast");

    expect(home?.energyKwh).toBeCloseTo(18, 6);
    expect(home?.share).toBeCloseTo(0.75, 6);
    expect(home?.isEstimated).toBe(true);
    expect(home?.sessionCount).toBe(0);
    expect(dcFast?.share).toBeCloseTo(0.25, 6);
    expect(dcFast?.sessionCount).toBe(1);
    expect(summary.mix.dcFastShare).toBeCloseTo(0.25, 6);
  });

  it("compares the running cost against the petrol equivalent", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog()],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      petrolPricePerUnit: 105,
      iceReferenceEfficiency: 45,
      currentDate: CURRENT_DATE,
    });

    // 600 km at 45 km/L is 13.33 L, at 105 a litre.
    expect(summary.savings.equivalentIceCost).toBeCloseTo(1400, 6);
    expect(summary.savings.savings).toBeCloseTo(1166, 6);
    expect(summary.savings.savingsPerDistance).toBeCloseTo(1.9433, 3);
  });

  it("leaves savings unknown without a petrol reference", () => {
    const vehicle = makeVehicle({ vehicle_snapshots: makeRidingHistory() });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.savings.equivalentIceCost).toBeNull();
    expect(summary.savings.savings).toBeNull();
  });

  it("scores battery care from discharge depth, full charges and fast charging", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog()],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      tariffPerKwh: 8,
      currentDate: CURRENT_DATE,
    });

    expect(summary.care.deepDischargeCount).toBe(1);
    expect(summary.care.fullChargeCount).toBe(0);
    // One deep discharge in six readings, plus a quarter of energy from DC fast.
    expect(summary.care.score).toBeCloseTo(88.75, 2);
    expect(summary.care.band).toBe("excellent");
  });

  it("counts a session that ends at a full charge", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog({ end_soc: 100 })],
    });

    const summary = buildEvEnergySummary(vehicle, {
      whPerKm: 40,
      currentDate: CURRENT_DATE,
    });

    expect(summary.care.fullChargeCount).toBe(1);
  });

  it("withholds a care score until there are enough observations", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: [
        makeSnapshot({ id: "s0", date: "2026-07-01", odometer: 1000, soc_percent: 90 }),
        makeSnapshot({ id: "s1", date: "2026-07-20", odometer: 1200, soc_percent: 40 }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.care.score).toBeNull();
    expect(summary.care.band).toBe("insufficient-data");
  });

  it("treats a charge row with no source as other", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog({ charge_source: null })],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });
    const other = summary.mix.entries.find((entry) => entry.source === "other");

    expect(other?.sessionCount).toBe(1);
    expect(other?.energyKwh).toBe(6);
  });

  it("ignores liquid fuel rows on a plug-in hybrid", () => {
    const vehicle = makeVehicle({
      powertrain: "phev",
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [
        makeChargeLog(),
        makeChargeLog({
          id: "fuel-1",
          energy_type: "fuel",
          fill_type: "full",
          charge_source: null,
          fuel_volume: 12,
          total_cost: 1200,
        }),
      ],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.loggedEnergyKwh).toBe(6);
    expect(summary.period.loggedCost).toBe(90);
  });

  it("excludes sessions outside the period", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog({ date: "2026-05-02" })],
    });

    const summary = buildEvEnergySummary(vehicle, { currentDate: CURRENT_DATE });

    expect(summary.period.loggedEnergyKwh).toBe(0);
  });
});

describe("buildEvLifetimeEnergySummary", () => {
  it("uses lifetime distance and every logged session", () => {
    const vehicle = makeVehicle({
      vehicle_snapshots: makeRidingHistory(),
      fuel_logs: [makeChargeLog({ date: "2026-05-02" }), makeChargeLog()],
    });

    const summary = buildEvLifetimeEnergySummary(vehicle, {
      whPerKm: 40,
      currentDate: CURRENT_DATE,
    });

    expect(summary.period.distance).toBe(600);
    expect(summary.period.loggedEnergyKwh).toBe(12);
    expect(summary.period.days).toBeNull();
    expect(summary.period.startDate).toBeNull();
  });
});

describe("deriveEnergyFromSocDelta", () => {
  it("converts a state-of-charge gain into kWh", () => {
    expect(deriveEnergyFromSocDelta(20, 80, 3.7)).toBeCloseTo(2.22, 6);
  });

  it("returns null when the delta or pack size is unusable", () => {
    expect(deriveEnergyFromSocDelta(null, 80, 3.7)).toBeNull();
    expect(deriveEnergyFromSocDelta(20, null, 3.7)).toBeNull();
    expect(deriveEnergyFromSocDelta(20, 80, null)).toBeNull();
    expect(deriveEnergyFromSocDelta(80, 20, 3.7)).toBeNull();
    expect(deriveEnergyFromSocDelta(50, 50, 3.7)).toBeNull();
  });
});
