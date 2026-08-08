import { describe, expect, it } from "vitest";

import { toNumericFields, toOptionalNumber } from "@/utils/form-values";

describe("toOptionalNumber", () => {
  it("parses the strings a number input actually produces", () => {
    // The regression this exists for: Number.isFinite("2.6") is false, so an
    // uncoerced watched value read as "no units entered".
    expect(toOptionalNumber("2.6")).toBe(2.6);
    expect(toOptionalNumber("0")).toBe(0);
    expect(toOptionalNumber("-3")).toBe(-3);
  });

  it("passes real numbers straight through", () => {
    expect(toOptionalNumber(2.6)).toBe(2.6);
  });

  it("treats a blank field as absent, not as zero", () => {
    expect(toOptionalNumber("")).toBeUndefined();
    expect(toOptionalNumber(null)).toBeUndefined();
    expect(toOptionalNumber(undefined)).toBeUndefined();
  });

  it("rejects anything that is not a finite number", () => {
    expect(toOptionalNumber("abc")).toBeUndefined();
    expect(toOptionalNumber(Number.NaN)).toBeUndefined();
    expect(toOptionalNumber(Infinity)).toBeUndefined();
    expect(toOptionalNumber({})).toBeUndefined();
  });

  it("does not let booleans become 0 or 1", () => {
    expect(toOptionalNumber(true)).toBeUndefined();
    expect(toOptionalNumber(false)).toBeUndefined();
  });
});

describe("toNumericFields", () => {
  it("coerces only the named keys", () => {
    const result = toNumericFields(
      { units: "2.6", rate: "6.3", note: "home", full: true },
      ["units", "rate"],
    );

    expect(result).toEqual({ units: 2.6, rate: 6.3, note: "home", full: true });
  });

  it("turns blank fields into undefined", () => {
    const result = toNumericFields({ units: "", rate: "6.3" }, ["units", "rate"]);

    expect(result.units).toBeUndefined();
    expect(result.rate).toBe(6.3);
  });

  it("leaves the original object alone", () => {
    const original = { units: "2.6" };
    toNumericFields(original, ["units"]);

    expect(original.units).toBe("2.6");
  });
});
