import { describe, expect, it } from "vitest";

import type { FuelLog } from "@/types/database";
import {
  calculateSessionCost,
  estimateChargingLoss,
  getSocDelta,
  isFullChargeSession,
  measurePackCapacity,
  resolveSessionEnergy,
} from "@/utils/charge-session";

function makeChargeLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return {
    id: "charge-1",
    vehicle_id: "v-1",
    date: "2026-08-01",
    odometer: 5000,
    fuel_volume: 3,
    total_cost: 60,
    calculated_efficiency: null,
    energy_type: "charge",
    fill_type: null,
    estimated_range: null,
    charge_source: "home",
    start_soc: 20,
    end_soc: 100,
    is_estimated: false,
    charger_network: null,
    location: null,
    pricing_mode: "per_kwh",
    rate_per_unit: 20,
    duration_minutes: null,
    session_fee: null,
    idle_minutes: null,
    idle_rate_per_minute: null,
    tax_percent: null,
    charged_to_full: null,
    energy_basis: "metered",
    created_at: "2026-08-01T10:00:00Z",
    ...overrides,
  };
}

describe("getSocDelta", () => {
  it("returns the percentage a session added", () => {
    expect(getSocDelta(20, 80)).toBe(60);
  });

  it("rejects a delta that goes backwards or stays put", () => {
    expect(getSocDelta(80, 80)).toBeNull();
    expect(getSocDelta(80, 20)).toBeNull();
  });

  it("returns null when either end is missing", () => {
    expect(getSocDelta(null, 80)).toBeNull();
    expect(getSocDelta(20, null)).toBeNull();
  });
});

describe("resolveSessionEnergy", () => {
  it("prefers metered energy and labels it as such", () => {
    expect(
      resolveSessionEnergy({ pricingMode: "per_kwh", energyKwh: 4.2 }),
    ).toEqual({ energyKwh: 4.2, basis: "metered" });
  });

  it("derives energy from the SoC delta for a per-minute session", () => {
    // A per-minute charger never reports kWh, so the pack size is the only route.
    const result = resolveSessionEnergy({
      pricingMode: "per_minute",
      durationMinutes: 30,
      startSoc: 20,
      endSoc: 80,
      usableBatteryKwh: 3.7,
    });

    expect(result.basis).toBe("soc_derived");
    expect(result.energyKwh).toBeCloseTo(2.22, 5);
  });

  it("has no energy when neither a meter reading nor a pack size is available", () => {
    expect(
      resolveSessionEnergy({
        pricingMode: "per_minute",
        startSoc: 20,
        endSoc: 80,
        usableBatteryKwh: null,
      }),
    ).toEqual({ energyKwh: null, basis: null });
  });

  it("ignores a non-positive metered figure and falls back to SoC", () => {
    const result = resolveSessionEnergy({
      pricingMode: "per_kwh",
      energyKwh: 0,
      startSoc: 50,
      endSoc: 100,
      usableBatteryKwh: 4,
    });

    expect(result).toEqual({ energyKwh: 2, basis: "soc_derived" });
  });

  it("treats a charge-to-full session as ending at 100% even with no end reading typed", () => {
    const result = resolveSessionEnergy({
      pricingMode: "per_kwh",
      startSoc: 35,
      endSoc: undefined,
      chargedToFull: true,
      usableBatteryKwh: 4,
    });

    expect(result).toEqual({ energyKwh: 2.6, basis: "soc_derived" });
  });

  it("prefers an explicit end reading over the charged-to-full assumption", () => {
    const result = resolveSessionEnergy({
      pricingMode: "per_kwh",
      startSoc: 35,
      endSoc: 90,
      chargedToFull: true,
      usableBatteryKwh: 4,
    });

    expect(result).toEqual({ energyKwh: 2.2, basis: "soc_derived" });
  });

  it("still has no energy when charged-to-full is on but the start reading is missing", () => {
    expect(
      resolveSessionEnergy({
        pricingMode: "per_kwh",
        chargedToFull: true,
        usableBatteryKwh: 4,
      }),
    ).toEqual({ energyKwh: null, basis: null });
  });
});

describe("calculateSessionCost", () => {
  it("prices a per-kWh session from units and rate", () => {
    const cost = calculateSessionCost({
      pricingMode: "per_kwh",
      energyKwh: 3,
      ratePerUnit: 8,
    });

    expect(cost.energy).toBe(24);
    expect(cost.time).toBe(0);
    expect(cost.total).toBe(24);
  });

  it("prices a per-minute session and applies GST", () => {
    // Ather Grid: Rs 1.2/min + GST.
    const cost = calculateSessionCost({
      pricingMode: "per_minute",
      durationMinutes: 45,
      ratePerUnit: 1.2,
      taxPercent: 18,
    });

    expect(cost.time).toBeCloseTo(54, 5);
    expect(cost.tax).toBeCloseTo(9.72, 5);
    expect(cost.total).toBeCloseTo(63.72, 5);
  });

  it("does not charge for energy in a per-minute session", () => {
    const cost = calculateSessionCost({
      pricingMode: "per_minute",
      durationMinutes: 30,
      ratePerUnit: 2,
      energyKwh: 10,
    });

    expect(cost.energy).toBe(0);
    expect(cost.total).toBe(60);
  });

  it("adds session and idle fees on top of the metered dimension", () => {
    const cost = calculateSessionCost({
      pricingMode: "per_kwh",
      energyKwh: 10,
      ratePerUnit: 20,
      sessionFee: 15,
      idleMinutes: 12,
      idleRatePerMinute: 2,
    });

    expect(cost.flat).toBe(15);
    expect(cost.idle).toBe(24);
    expect(cost.total).toBe(239);
  });

  it("charges nothing for a free session but still honours an idle fee", () => {
    const cost = calculateSessionCost({
      pricingMode: "free",
      energyKwh: 5,
      ratePerUnit: 20,
      sessionFee: 10,
      idleMinutes: 5,
      idleRatePerMinute: 1,
    });

    expect(cost.energy).toBe(0);
    expect(cost.flat).toBe(0);
    expect(cost.idle).toBe(5);
    expect(cost.total).toBe(5);
  });

  it("prices a flat session from the session fee alone", () => {
    const cost = calculateSessionCost({
      pricingMode: "flat",
      sessionFee: 99,
      energyKwh: 8,
      ratePerUnit: 20,
    });

    expect(cost.total).toBe(99);
  });

  it("treats missing and negative inputs as zero rather than NaN", () => {
    const cost = calculateSessionCost({
      pricingMode: "per_kwh",
      energyKwh: -3,
      ratePerUnit: null,
      taxPercent: -5,
    });

    expect(cost.total).toBe(0);
  });
});

describe("isFullChargeSession", () => {
  it("reads the state of charge when it is present", () => {
    expect(isFullChargeSession({ end_soc: 100, charged_to_full: null })).toBe(true);
    expect(isFullChargeSession({ end_soc: 99, charged_to_full: null })).toBe(true);
    expect(isFullChargeSession({ end_soc: 80, charged_to_full: null })).toBe(false);
  });

  it("ignores the flag when a state of charge contradicts it", () => {
    expect(isFullChargeSession({ end_soc: 80, charged_to_full: true })).toBe(false);
  });

  it("falls back to the anchor flag when no percentage was logged", () => {
    expect(isFullChargeSession({ end_soc: null, charged_to_full: true })).toBe(true);
    expect(isFullChargeSession({ end_soc: null, charged_to_full: false })).toBe(false);
    expect(isFullChargeSession({ end_soc: null, charged_to_full: null })).toBe(false);
  });
});

describe("measurePackCapacity", () => {
  it("sizes the pack from a deep charge to full", () => {
    // 3 kWh replaced 80% of the pack, so the pack is about 3.75 kWh at the meter.
    const measurement = measurePackCapacity(makeChargeLog());

    expect(measurement?.apparentUsableKwh).toBeCloseTo(3.75, 5);
    expect(measurement?.socDelta).toBe(80);
  });

  it("rejects a session that did not reach full", () => {
    expect(measurePackCapacity(makeChargeLog({ end_soc: 80 }))).toBeNull();
  });

  it("rejects a shallow top-up, where gauge rounding dominates", () => {
    expect(measurePackCapacity(makeChargeLog({ start_soc: 70 }))).toBeNull();
  });

  it("rejects SoC-derived energy, which would just restate the pack size", () => {
    expect(
      measurePackCapacity(makeChargeLog({ energy_basis: "soc_derived" })),
    ).toBeNull();
  });

  it("ignores liquid fuel rows", () => {
    expect(measurePackCapacity(makeChargeLog({ energy_type: "fuel" }))).toBeNull();
  });
});

describe("estimateChargingLoss", () => {
  it("reports the share of metered energy that never reached the pack", () => {
    // 3 kWh metered, 80% of a 3 kWh pack = 2.4 kWh delivered, so 20% lost.
    expect(estimateChargingLoss(makeChargeLog(), 3)).toBeCloseTo(0.2, 5);
  });

  it("returns null when the pack size is unknown", () => {
    expect(estimateChargingLoss(makeChargeLog(), null)).toBeNull();
  });

  it("returns null rather than a negative loss when the numbers disagree", () => {
    // A pack this large would mean more energy arrived than was metered.
    expect(estimateChargingLoss(makeChargeLog(), 10)).toBeNull();
  });

  it("returns null for SoC-derived energy, where loss is unobservable", () => {
    expect(
      estimateChargingLoss(makeChargeLog({ energy_basis: "soc_derived" }), 3),
    ).toBeNull();
  });
});
