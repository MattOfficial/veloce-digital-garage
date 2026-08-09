import { describe, expect, it } from "vitest";

import * as factories from "@/__tests__/factories";
import { getEvEfficiencyDisplay } from "@/utils/ev-efficiency-display";

/**
 * The dashboard and the Energy & Battery page both render this. The regression
 * it exists to prevent is the dashboard going blank for an owner who logs
 * charges but never records a state-of-charge check-in.
 */

function makeVehicle(logs: Parameters<typeof factories.makeEvVehicle>[0] = {}) {
  return factories.makeEvVehicle({
    baseline_odometer: 1_000,
    created_at: "2026-01-01T00:00:00Z",
    ...logs,
  });
}

describe("getEvEfficiencyDisplay", () => {
  it("falls back to the lifetime ratio when a single charge is all there is", () => {
    // Lifetime distance runs from the baseline odometer to the latest dated
    // reading: 500 km on the 5 kWh bought. Absurd for a car, entirely normal
    // for the scooter this app was built around.
    const vehicle = makeVehicle({
      fuel_logs: [
        factories.makeChargeLog({
          date: "2026-02-01",
          odometer: 1_500,
          fuel_volume: 5,
          total_cost: 40,
        }),
      ],
    });

    const display = getEvEfficiencyDisplay(vehicle, {
      unit: "km/kWh",
      distanceUnit: "km",
    });

    expect(display.value).toBeCloseTo(100, 5);
    expect(display.basis).toBe("lifetime");
    expect(display.precision).toBe(1);
  });

  it("prefers measured segments over the lifetime ratio", () => {
    // Two SoC-anchored segments of 100 km each. The lifetime ratio would count
    // the charge still in the battery, so the two figures must differ.
    const vehicle = makeVehicle({
      current_odometer: 2_000,
      fuel_logs: [
        factories.makeChargeLog({
          id: "c1",
          date: "2026-02-01",
          odometer: 1_000,
          fuel_volume: 2,
          total_cost: 20,
          start_soc: 20,
          end_soc: 100,
        }),
        factories.makeChargeLog({
          id: "c2",
          date: "2026-02-10",
          odometer: 1_100,
          fuel_volume: 2,
          total_cost: 20,
          start_soc: 20,
          end_soc: 100,
        }),
        factories.makeChargeLog({
          id: "c3",
          date: "2026-02-20",
          odometer: 1_200,
          fuel_volume: 2,
          total_cost: 20,
          start_soc: 20,
          end_soc: 100,
        }),
      ],
    });

    const display = getEvEfficiencyDisplay(vehicle, {
      unit: "km/kWh",
      distanceUnit: "km",
    });

    expect(display.value).toBeCloseTo(50, 5);
    expect(display.basis).toBe("soc-corrected");
  });

  it("reports no basis and no value when nothing has been logged", () => {
    const display = getEvEfficiencyDisplay(makeVehicle(), {
      unit: "km/kWh",
      distanceUnit: "km",
    });

    expect(display.value).toBeNull();
    expect(display.basis).toBeNull();
    expect(display.unanchoredSessionCount).toBe(0);
  });

  it("converts into the requested unit rather than assuming km/kWh", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        factories.makeChargeLog({
          date: "2026-02-01",
          odometer: 1_500,
          fuel_volume: 5,
          total_cost: 40,
        }),
      ],
    });

    const whPerKm = getEvEfficiencyDisplay(vehicle, {
      unit: "Wh/km",
      distanceUnit: "km",
    });

    // 100 km/kWh is 10 Wh/km, and Wh/km reads as a whole number.
    expect(whPerKm.value).toBeCloseTo(10, 5);
    expect(whPerKm.precision).toBe(0);
    expect(whPerKm.unit).toBe("Wh/km");
  });

  it("surfaces charges that nothing anchors, so the owner can fix them", () => {
    const vehicle = makeVehicle({
      current_odometer: 2_000,
      fuel_logs: [
        factories.makeChargeLog({
          id: "c1",
          date: "2026-02-01",
          odometer: 1_000,
          fuel_volume: 2,
        }),
        factories.makeChargeLog({
          id: "c2",
          date: "2026-02-10",
          odometer: 1_100,
          fuel_volume: 2,
        }),
        factories.makeChargeLog({
          id: "c3",
          date: "2026-02-20",
          odometer: 1_200,
          fuel_volume: 2,
        }),
      ],
    });

    const display = getEvEfficiencyDisplay(vehicle, {
      unit: "km/kWh",
      distanceUnit: "km",
    });

    // Nothing closes a segment, and the first session only opens one.
    expect(display.basis).toBe("lifetime");
    expect(display.unanchoredSessionCount).toBe(2);
  });
});
