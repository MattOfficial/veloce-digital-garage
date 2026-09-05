import { describe, expect, it } from "vitest";

import type { VehicleWithLogs } from "@/types/database";
import {
  REGIONAL_PETROL_COST_PER_KM,
  buildEvSavings,
  getPetrolBenchmark,
  getVehicleFuelCostPerDistance,
} from "@/utils/ev-savings";
import * as factories from "@/__tests__/factories";

/** A petrol vehicle with two full tanks, so one closed segment exists. */
function makePetrolVehicle(
  overrides: Partial<VehicleWithLogs> = {},
  {
    distance = 500,
    cost = 1_000,
  }: { distance?: number; cost?: number } = {},
): VehicleWithLogs {
  return factories.makeVehicle({
    id: "petrol-1",
    vehicle_type: "motorcycle",
    powertrain: "ice",
    baseline_odometer: 1_000,
    fuel_logs: [
      factories.makeFuelLog({
        id: "f1",
        date: "2026-01-01",
        odometer: 1_000,
        fill_type: "full",
        fuel_volume: 10,
        total_cost: 1_000,
      }),
      factories.makeFuelLog({
        id: "f2",
        date: "2026-02-01",
        odometer: 1_000 + distance,
        fill_type: "full",
        fuel_volume: 10,
        total_cost: cost,
      }),
    ],
    ...overrides,
  });
}

function makeEv(overrides: Partial<VehicleWithLogs> = {}): VehicleWithLogs {
  return factories.makeEvVehicle({
    id: "ev-1",
    baseline_odometer: 0,
    fuel_logs: [
      factories.makeChargeLog({
        id: "c1",
        date: "2026-01-01",
        odometer: 0,
        fuel_volume: 3,
        total_cost: 24,
      }),
      factories.makeChargeLog({
        id: "c2",
        date: "2026-02-01",
        odometer: 1_000,
        fuel_volume: 3,
        total_cost: 24,
      }),
    ],
    ...overrides,
  });
}

describe("getVehicleFuelCostPerDistance", () => {
  it("measures cost and distance from closed tank segments", () => {
    const measured = getVehicleFuelCostPerDistance(makePetrolVehicle());

    expect(measured).toEqual({ distance: 500, cost: 1_000 });
  });

  it("has nothing to report before a segment closes", () => {
    const vehicle = makePetrolVehicle({
      fuel_logs: [factories.makeFuelLog({ id: "f1", odometer: 1_000 })],
    });

    expect(getVehicleFuelCostPerDistance(vehicle)).toBeNull();
  });
});

describe("getPetrolBenchmark", () => {
  it("prefers the owner's own vehicle of the same type", () => {
    const ev = makeEv();
    const benchmark = getPetrolBenchmark(ev, [ev, makePetrolVehicle()], {
      currency: "INR",
    });

    expect(benchmark.source).toBe("garage");
    expect(benchmark.costPerDistance).toBeCloseTo(2, 5);
    expect(benchmark.vehicleCount).toBe(1);
  });

  it("never compares a two-wheeler with a car", () => {
    const ev = makeEv();
    const car = makePetrolVehicle({ id: "car-1", vehicle_type: "car" });

    const benchmark = getPetrolBenchmark(ev, [ev, car], { currency: "INR" });

    expect(benchmark.source).toBe("regional-default");
    expect(benchmark.costPerDistance).toBe(REGIONAL_PETROL_COST_PER_KM.motorcycle);
  });

  it("weights several peers by distance rather than averaging the rates", () => {
    const ev = makeEv();
    // 500 km at Rs 2/km and 2000 km at Rs 3/km pools to Rs 2.80/km, not Rs 2.50.
    const cheap = makePetrolVehicle({ id: "p1" }, { distance: 500, cost: 1_000 });
    const busy = makePetrolVehicle({ id: "p2" }, { distance: 2_000, cost: 6_000 });

    const benchmark = getPetrolBenchmark(ev, [ev, cheap, busy], { currency: "INR" });

    expect(benchmark.costPerDistance).toBeCloseTo(7_000 / 2_500, 5);
    expect(benchmark.vehicleCount).toBe(2);
  });

  it("ignores plug-in hybrids, whose cost is partly grid energy", () => {
    const ev = makeEv();
    const phev = makePetrolVehicle({ id: "phev-1", powertrain: "phev" });

    expect(getPetrolBenchmark(ev, [ev, phev], { currency: "INR" }).source).toBe(
      "regional-default",
    );
  });

  it("counts a self-charging hybrid, which burns only petrol", () => {
    const ev = makeEv();
    const hybrid = makePetrolVehicle({ id: "hev-1", powertrain: "hev" });

    expect(getPetrolBenchmark(ev, [ev, hybrid], { currency: "INR" }).source).toBe(
      "garage",
    );
  });

  it("excludes the EV itself from its own benchmark", () => {
    const ev = makeEv();

    expect(getPetrolBenchmark(ev, [ev], { currency: "INR" }).source).toBe(
      "regional-default",
    );
  });

  it("falls back to the profile reference before the regional default", () => {
    const ev = makeEv();
    const benchmark = getPetrolBenchmark(ev, [ev], {
      petrolPricePerUnit: 105,
      iceReferenceEfficiency: 42,
      currency: "INR",
    });

    expect(benchmark.source).toBe("profile-reference");
    expect(benchmark.costPerDistance).toBeCloseTo(2.5, 5);
  });

  it("withholds the rupee default from a garage priced in another currency", () => {
    const ev = makeEv();
    const benchmark = getPetrolBenchmark(ev, [ev], { currency: "USD" });

    expect(benchmark.source).toBe("unavailable");
    expect(benchmark.costPerDistance).toBeNull();
  });

  it("accepts the rupee symbol as well as the code", () => {
    const ev = makeEv();

    expect(getPetrolBenchmark(ev, [ev], { currency: "₹" }).source).toBe(
      "regional-default",
    );
  });
});

describe("buildEvSavings", () => {
  it("prices the same distance against the garage benchmark", () => {
    const ev = makeEv();
    // 1000 km driven, Rs 48 of charging, against Rs 2/km of petrol.
    const savings = buildEvSavings(ev, [ev, makePetrolVehicle()], { currency: "INR" });

    expect(savings.distance).toBe(1_000);
    expect(savings.evCostPerDistance).toBeCloseTo(0.048, 5);
    expect(savings.equivalentPetrolCost).toBeCloseTo(2_000, 5);
    expect(savings.savings).toBeCloseTo(1_952, 5);
    expect(savings.benchmark.source).toBe("garage");
  });

  it("still reports a saving from the regional default alone", () => {
    const ev = makeEv();
    const savings = buildEvSavings(ev, [ev], { currency: "INR" });

    expect(savings.savings).toBeCloseTo(2_250 - 48, 5);
    expect(savings.benchmark.source).toBe("regional-default");
  });

  it("has no figure when nothing has been charged", () => {
    const ev = makeEv({ fuel_logs: [] });
    const savings = buildEvSavings(ev, [ev], { currency: "INR" });

    expect(savings.savings).toBeNull();
    expect(savings.evCostPerDistance).toBeNull();
  });

  it("has no figure without a benchmark to compare against", () => {
    const ev = makeEv();
    const savings = buildEvSavings(ev, [ev], { currency: "USD" });

    expect(savings.savings).toBeNull();
    expect(savings.benchmark.source).toBe("unavailable");
  });
});

describe("costBasis: all-in", () => {
  /**
   * The dashboard's "saved vs petrol" pill has to reconcile against the two
   * all-in cost-per-km figures already on screen (one per vehicle), which the
   * default fuel-only basis does not — it reads closed tank segments and the
   * EV's charge cost alone, leaving maintenance out of both sides.
   */
  it("getPetrolBenchmark measures a peer's whole tracked cost, not just fuel segments", () => {
    const ev = makeEv();
    const peer = factories.makeVehicle({
      id: "petrol-1",
      vehicle_type: "motorcycle",
      powertrain: "ice",
      baseline_odometer: 1_000,
      fuel_logs: [
        factories.makeFuelLog({ id: "f1", odometer: 1_500, total_cost: 800 }),
      ],
      maintenance_logs: [
        factories.makeMaintenanceLog({ id: "m1", odometer: 1_500, cost: 200 }),
      ],
    });

    const fuelOnly = getPetrolBenchmark(ev, [ev, peer], { currency: "INR" });
    expect(fuelOnly.source).toBe("garage");
    // Fuel alone: 800 / 500 km. The 200 of maintenance never enters this rate.
    expect(fuelOnly.costPerDistance).toBeCloseTo(1.6, 5);

    const allIn = getPetrolBenchmark(ev, [ev, peer], {
      currency: "INR",
      costBasis: "all-in",
    });
    expect(allIn.source).toBe("garage");
    // (800 fuel + 200 maintenance) / 500 km.
    expect(allIn.costPerDistance).toBeCloseTo(2, 5);
  });

  it("does not fall back to the profile reference or regional default for all-in", () => {
    const ev = makeEv();
    const benchmark = getPetrolBenchmark(ev, [ev], {
      currency: "INR",
      petrolPricePerUnit: 105,
      iceReferenceEfficiency: 42,
      costBasis: "all-in",
    });

    expect(benchmark.source).toBe("unavailable");
    expect(benchmark.costPerDistance).toBeNull();
  });

  it("buildEvSavings compares whole tracked cost on both sides", () => {
    const ev = factories.makeEvVehicle({
      baseline_odometer: 0,
      fuel_logs: [
        factories.makeChargeLog({ id: "c1", odometer: 1_000, total_cost: 100 }),
      ],
      maintenance_logs: [
        factories.makeMaintenanceLog({ id: "m1", odometer: 1_000, cost: 50 }),
      ],
    });
    const peer = factories.makeVehicle({
      id: "petrol-1",
      vehicle_type: "motorcycle",
      powertrain: "ice",
      baseline_odometer: 1_000,
      fuel_logs: [
        factories.makeFuelLog({ id: "f1", odometer: 1_500, total_cost: 800 }),
      ],
      maintenance_logs: [
        factories.makeMaintenanceLog({ id: "m1", odometer: 1_500, cost: 200 }),
      ],
    });

    const savings = buildEvSavings(ev, [ev, peer], {
      currency: "INR",
      costBasis: "all-in",
    });

    // EV: (100 charge + 50 maintenance) over 1,000 km.
    expect(savings.distance).toBe(1_000);
    expect(savings.evCostPerDistance).toBeCloseTo(0.15, 5);
    // Peer: (800 + 200) over 500 km = Rs 2/km.
    expect(savings.benchmark.costPerDistance).toBeCloseTo(2, 5);
    expect(savings.equivalentPetrolCost).toBeCloseTo(2_000, 5);
    expect(savings.savings).toBeCloseTo(2_000 - 150, 5);
  });
});
