import { describe, expect, it } from "vitest";

import { getCurrencySymbol } from "@/utils/formatting";

describe("getCurrencySymbol", () => {
  it.each([
    ["USD", "$"],
    ["$", "$"],
    ["EUR", "€"],
    ["£", "£"],
    ["JPY", "¥"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(getCurrencySymbol(input)).toBe(expected);
  });

  it("keeps an unknown configured symbol instead of falling back to rupees", () => {
    expect(getCurrencySymbol("₩")).toBe("₩");
  });
});
