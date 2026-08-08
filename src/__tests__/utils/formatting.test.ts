import { describe, expect, it } from "vitest";

import {
  formatDayLabel,
  formatDistance,
  formatMoney,
  formatMoneyCompact,
  formatMoneyExact,
  formatNumber,
  formatTableDate,
  getCurrencySymbol,
} from "@/utils/formatting";

describe("getCurrencySymbol", () => {
  it("maps a currency code to its symbol", () => {
    expect(getCurrencySymbol("INR")).toBe("₹");
    expect(getCurrencySymbol("usd")).toBe("$");
  });

  it("passes an unrecognised value through, so a raw symbol still works", () => {
    expect(getCurrencySymbol("€")).toBe("€");
    expect(getCurrencySymbol("XYZ")).toBe("XYZ");
  });

  it("defaults to the rupee for a missing or blank value", () => {
    expect(getCurrencySymbol(null)).toBe("₹");
    expect(getCurrencySymbol("   ")).toBe("₹");
  });
});

describe("formatMoney", () => {
  it("prefixes the symbol and trims to two decimals", () => {
    expect(formatMoney(1234.567, "INR")).toBe("₹1,234.57");
  });

  it("drops trailing zeros by default", () => {
    expect(formatMoney(1200, "USD")).toBe("$1,200");
  });

  it("keeps cents when asked to be exact", () => {
    expect(formatMoneyExact(1200, "USD")).toBe("$1,200.00");
  });

  it("abbreviates for chart axes", () => {
    expect(formatMoneyCompact(12000, "INR")).toBe("₹12K");
  });
});

describe("formatNumber", () => {
  it("rounds to whole numbers by default", () => {
    expect(formatNumber(1234.7)).toBe("1,235");
  });

  it("honours an explicit precision", () => {
    expect(formatNumber(1234.75, { maximumFractionDigits: 1 })).toBe("1,234.8");
  });
});

describe("formatDistance", () => {
  it("appends the unit when one is given", () => {
    expect(formatDistance(1234.6, "km")).toBe("1,235 km");
  });

  it("omits the unit when none is given", () => {
    expect(formatDistance(1234.6)).toBe("1,235");
  });

  it("shows a decimal where the figure is small enough to need one", () => {
    expect(formatDistance(2.44, "km", { decimals: 1 })).toBe("2.4 km");
  });
});

describe("date formatting", () => {
  it("renders a compact day label", () => {
    expect(formatDayLabel("2026-03-12T00:00:00Z")).toMatch(/Mar/);
  });

  it("renders a day-first table date regardless of locale", () => {
    expect(formatTableDate("2026-03-12T00:00:00Z")).toBe("12/03/2026");
  });
});
