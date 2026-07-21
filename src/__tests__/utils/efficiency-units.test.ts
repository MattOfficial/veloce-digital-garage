import { describe, expect, it } from "vitest";
import {
  convertFuelEfficiency,
  getDefaultFuelEfficiencyUnit,
  isFuelEfficiencyUnit,
} from "@/utils/efficiency-units";

describe("fuel efficiency units", () => {
  it("converts one metric segment into every supported display unit", () => {
    expect(convertFuelEfficiency(150, 10, "km/L", "km", "Liters")).toBeCloseTo(
      15,
      8,
    );
    expect(
      convertFuelEfficiency(150, 10, "L/100km", "km", "Liters"),
    ).toBeCloseTo(6.6666667, 7);
    expect(
      convertFuelEfficiency(150, 10, "MPG (US)", "km", "Liters"),
    ).toBeCloseTo(35.2821875, 7);
    expect(
      convertFuelEfficiency(150, 10, "MPG (UK)", "km", "Liters"),
    ).toBeCloseTo(42.3721404, 7);
  });

  it("does not double-convert US customary source data", () => {
    expect(
      convertFuelEfficiency(100, 4, "MPG (US)", "miles", "Gallons"),
    ).toBeCloseTo(25, 8);
  });

  it("does not double-convert UK customary source data", () => {
    expect(
      convertFuelEfficiency(100, 4, "MPG (UK)", "miles", "Gallons (UK)"),
    ).toBeCloseTo(25, 8);
  });

  it("returns no result for invalid or incomplete segments", () => {
    expect(convertFuelEfficiency(0, 10, "km/L", "km", "Liters")).toBeNull();
    expect(convertFuelEfficiency(100, 0, "km/L", "km", "Liters")).toBeNull();
    expect(
      convertFuelEfficiency(Number.NaN, 10, "km/L", "km", "Liters"),
    ).toBeNull();
  });

  it("selects the expected profile default", () => {
    expect(getDefaultFuelEfficiencyUnit("km", "Liters")).toBe("km/L");
    expect(getDefaultFuelEfficiencyUnit("miles", "Gallons")).toBe("MPG (US)");
    expect(getDefaultFuelEfficiencyUnit("miles", "Gallons (UK)")).toBe(
      "MPG (UK)",
    );
  });

  it("guards unit picker values", () => {
    expect(isFuelEfficiencyUnit("L/100km")).toBe(true);
    expect(isFuelEfficiencyUnit("MPG")).toBe(false);
  });
});
