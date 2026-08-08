import { describe, expect, it } from "vitest";
import {
  convertEvEfficiency,
  convertFuelEfficiency,
  getDefaultEvEfficiencyUnit,
  getDefaultFuelEfficiencyUnit,
  getEvEfficiencyPrecision,
  isEvEfficiencyUnit,
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

describe("EV efficiency units", () => {
  it("converts one segment into every supported display unit", () => {
    // 100 km on 4 kWh.
    expect(convertEvEfficiency(100, 4, "Wh/km", "km")).toBeCloseTo(40, 8);
    expect(convertEvEfficiency(100, 4, "km/kWh", "km")).toBeCloseTo(25, 8);
    expect(convertEvEfficiency(100, 4, "kWh/100km", "km")).toBeCloseTo(4, 8);
    expect(convertEvEfficiency(100, 4, "mi/kWh", "km")).toBeCloseTo(
      15.5342798,
      6,
    );
  });

  it("treats stored distance as the user's own unit", () => {
    // 100 miles on 4 kWh is 25 mi/kWh, and a mile is longer than a kilometre so
    // the Wh/km figure comes out lower.
    expect(convertEvEfficiency(100, 4, "mi/kWh", "miles")).toBeCloseTo(25, 8);
    expect(convertEvEfficiency(100, 4, "Wh/km", "miles")).toBeCloseTo(
      24.8548477,
      6,
    );
  });

  it("returns null for segments that cannot yield an efficiency", () => {
    expect(convertEvEfficiency(0, 4, "Wh/km", "km")).toBeNull();
    expect(convertEvEfficiency(100, 0, "Wh/km", "km")).toBeNull();
    expect(convertEvEfficiency(-100, 4, "Wh/km", "km")).toBeNull();
    expect(convertEvEfficiency(Number.NaN, 4, "Wh/km", "km")).toBeNull();
  });

  it("defaults to the unit that matches the distance preference", () => {
    expect(getDefaultEvEfficiencyUnit("km")).toBe("Wh/km");
    expect(getDefaultEvEfficiencyUnit("miles")).toBe("mi/kWh");
  });

  it("shows a decimal only where it carries meaning", () => {
    expect(getEvEfficiencyPrecision("Wh/km")).toBe(0);
    expect(getEvEfficiencyPrecision("km/kWh")).toBe(1);
  });

  it("guards unit picker values", () => {
    expect(isEvEfficiencyUnit("Wh/km")).toBe(true);
    expect(isEvEfficiencyUnit("km/L")).toBe(false);
  });
});
