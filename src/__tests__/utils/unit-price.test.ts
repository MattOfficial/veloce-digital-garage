import { describe, expect, it } from "vitest";
import { getUnitPriceSummary } from "@/utils/unit-price";

describe("getUnitPriceSummary", () => {
  it("compares the two latest valid session prices", () => {
    const summary = getUnitPriceSummary([
      { total_cost: 50, fuel_volume: 10 },
      { total_cost: 66, fuel_volume: 11 },
    ]);

    expect(summary.latest).toBeCloseTo(6, 8);
    expect(summary.previous).toBeCloseTo(5, 8);
    expect(summary.changePercent).toBeCloseTo(20, 8);
    expect(summary.direction).toBe("up");
  });

  it("reports falling and unchanged prices", () => {
    expect(
      getUnitPriceSummary([
        { total_cost: 60, fuel_volume: 10 },
        { total_cost: 50, fuel_volume: 10 },
      ]).direction,
    ).toBe("down");

    expect(
      getUnitPriceSummary([
        { total_cost: 50, fuel_volume: 10 },
        { total_cost: 25, fuel_volume: 5 },
      ]).direction,
    ).toBe("flat");
  });

  it("ignores sessions that cannot produce a meaningful unit price", () => {
    const summary = getUnitPriceSummary([
      { total_cost: 20, fuel_volume: 0 },
      { total_cost: Number.NaN, fuel_volume: 5 },
      { total_cost: 48, fuel_volume: 8 },
    ]);

    expect(summary.latest).toBe(6);
    expect(summary.previous).toBeNull();
    expect(summary.direction).toBe("unavailable");
  });

  it("handles comparison against a free previous session", () => {
    const summary = getUnitPriceSummary([
      { total_cost: 0, fuel_volume: 10 },
      { total_cost: 20, fuel_volume: 10 },
    ]);

    expect(summary.latest).toBe(2);
    expect(summary.previous).toBe(0);
    expect(summary.changePercent).toBeNull();
    expect(summary.direction).toBe("up");
  });

  it("returns an unavailable summary without valid sessions", () => {
    expect(getUnitPriceSummary([])).toEqual({
      latest: null,
      previous: null,
      changePercent: null,
      direction: "unavailable",
    });
  });
});
