import { describe, expect, it } from "vitest";

import {
  coefficientOfVariation,
  consistencyScore,
  getOutlierBounds,
  leastSquaresSlope,
  median,
  medianAbsoluteDeviation,
} from "@/utils/statistics";

describe("median", () => {
  it("takes the middle value of an odd-length set", () => {
    expect(median([5, 1, 3])).toBe(3);
  });

  it("averages the middle pair of an even-length set", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("returns null for an empty set", () => {
    expect(median([])).toBeNull();
  });

  it("does not mutate the input", () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});

describe("medianAbsoluteDeviation", () => {
  it("measures typical distance from the centre", () => {
    expect(medianAbsoluteDeviation([10, 12, 14, 16], 13)).toBe(2);
  });

  it("is zero when every value sits on the centre", () => {
    expect(medianAbsoluteDeviation([7, 7, 7], 7)).toBe(0);
  });

  it("is zero for an empty set rather than null", () => {
    expect(medianAbsoluteDeviation([], 5)).toBe(0);
  });
});

describe("coefficientOfVariation", () => {
  it("is zero for identical values", () => {
    expect(coefficientOfVariation([4, 4, 4])).toBe(0);
  });

  it("grows with spread", () => {
    const tight = coefficientOfVariation([10, 11, 12]) as number;
    const loose = coefficientOfVariation([2, 11, 30]) as number;

    expect(loose).toBeGreaterThan(tight);
  });

  it("needs at least two values", () => {
    expect(coefficientOfVariation([5])).toBeNull();
  });

  it("returns null when the mean is not positive", () => {
    expect(coefficientOfVariation([-4, 4])).toBeNull();
  });
});

describe("consistencyScore", () => {
  it("scores identical readings at 100", () => {
    expect(consistencyScore([9, 9, 9])).toBe(100);
  });

  it("clamps a wildly variable set to zero rather than going negative", () => {
    expect(consistencyScore([1, 1, 100])).toBe(0);
  });

  it("returns null when there is nothing to compare", () => {
    expect(consistencyScore([9])).toBeNull();
  });
});

describe("getOutlierBounds", () => {
  it("centres on the median", () => {
    expect(getOutlierBounds([10, 11, 12, 13])?.center).toBe(11.5);
  });

  it("keeps a floor under the limit so tight data does not reject everything", () => {
    // Zero deviation would otherwise make the limit zero.
    const bounds = getOutlierBounds([20, 20, 20]);

    expect(bounds?.limit).toBe(10);
  });

  it("widens the limit for genuinely spread data", () => {
    const bounds = getOutlierBounds([10, 30, 50, 70]);

    expect(bounds?.limit).toBeGreaterThan((bounds as { center: number }).center * 0.5);
  });

  it("respects a custom multiplier", () => {
    const bounds = getOutlierBounds([10, 30, 50, 70], {
      madMultiplier: 1,
      minRelativeSpread: 0,
    });

    expect(bounds?.limit).toBe(20);
  });

  it("returns null when there is no positive centre", () => {
    expect(getOutlierBounds([])).toBeNull();
    expect(getOutlierBounds([0, 0])).toBeNull();
  });
});

describe("leastSquaresSlope", () => {
  it("recovers the slope of a straight line", () => {
    const slope = leastSquaresSlope([
      { x: 0, y: 10 },
      { x: 1, y: 12 },
      { x: 2, y: 14 },
    ]);

    expect(slope).toBeCloseTo(2, 10);
  });

  it("is negative for a falling series", () => {
    const slope = leastSquaresSlope([
      { x: 0, y: 100 },
      { x: 1, y: 95 },
      { x: 2, y: 90 },
    ]);

    expect(slope).toBeCloseTo(-5, 10);
  });

  it("needs at least two points", () => {
    expect(leastSquaresSlope([{ x: 1, y: 1 }])).toBeNull();
  });

  it("returns null when every point shares the same x", () => {
    expect(
      leastSquaresSlope([
        { x: 3, y: 1 },
        { x: 3, y: 9 },
      ]),
    ).toBeNull();
  });
});
