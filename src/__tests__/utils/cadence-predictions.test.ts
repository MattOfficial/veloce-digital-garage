import { afterEach, describe, expect, it } from "vitest";

import {
  calculateSmartNextRefill,
  calculateSmartNextRefillFromHistory,
  estimateRefillCadence,
  getRefillDisplayString,
  getStatusClassName,
  getStatusIcon,
  type SmartRefillPrediction,
} from "@/utils/cadence-predictions";

const ORIGINAL_TIME_ZONE = process.env.TZ;

afterEach(() => {
  if (ORIGINAL_TIME_ZONE == null) {
    delete process.env.TZ;
  } else {
    process.env.TZ = ORIGINAL_TIME_ZONE;
  }
});

function localDate(
  year: number,
  month: number,
  day: number,
  hour = 12,
): Date {
  return new Date(year, month - 1, day, hour);
}

describe("calculateSmartNextRefill", () => {
  it("returns insufficient data for missing or invalid inputs", () => {
    const today = localDate(2024, 6, 15);

    for (const result of [
      calculateSmartNextRefill(null, 7, today),
      calculateSmartNextRefill("2024-06-10", 0, today),
      calculateSmartNextRefill("2024-06-10", -1, today),
      calculateSmartNextRefill("2024-06-10", Number.NaN, today),
      calculateSmartNextRefill("2024-06-10", Number.POSITIVE_INFINITY, today),
      calculateSmartNextRefill(new Date("invalid"), 7, today),
    ]) {
      expect(result).toMatchObject({
        status: "insufficient-data",
        adjustedDate: null,
        originalDate: null,
        expectedDateKey: null,
        confidence: "none",
        sampleSize: 0,
      });
    }
  });

  it("returns on-track when the projection is more than two days away", () => {
    const result = calculateSmartNextRefill(
      "2024-06-05",
      14,
      localDate(2024, 6, 15),
    );

    expect(result).toMatchObject({
      status: "on-track",
      expectedDateKey: "2024-06-19",
      daysDifference: 4,
      intervalDays: 14,
      wasProjectionPast: false,
    });
  });

  it("returns refuelling-soon exactly two calendar days before the projection", () => {
    const result = calculateSmartNextRefill(
      "2024-06-01",
      16,
      localDate(2024, 6, 15),
    );

    expect(result.status).toBe("refuelling-soon");
    expect(result.daysDifference).toBe(2);
  });

  it("returns refuelling-imminent for both today and tomorrow", () => {
    const todayResult = calculateSmartNextRefill(
      "2024-06-01",
      14,
      localDate(2024, 6, 15, 23),
    );
    const tomorrowResult = calculateSmartNextRefill(
      "2024-06-02",
      14,
      localDate(2024, 6, 15, 23),
    );

    expect(todayResult).toMatchObject({
      status: "refuelling-imminent",
      daysDifference: 0,
    });
    expect(tomorrowResult).toMatchObject({
      status: "refuelling-imminent",
      daysDifference: 1,
    });
  });

  it("keeps an overdue expectation in the past instead of rolling it forward", () => {
    const today = localDate(2024, 6, 15);
    const result = calculateSmartNextRefill("2024-06-05", 7, today);

    expect(result).toMatchObject({
      status: "overdue",
      expectedDateKey: "2024-06-12",
      daysDifference: -3,
      wasProjectionPast: true,
      cyclesMissed: 1,
    });
    expect(result.adjustedDate!.getTime()).toBeLessThan(today.getTime());
    expect(result.originalDate?.getTime()).toBe(result.adjustedDate?.getTime());
    expect(getRefillDisplayString(result)).toContain("overdue by 3 days");
    expect(getRefillDisplayString(result)).not.toContain("missed");
  });

  it("rounds a positive fractional cadence to at least one calendar day", () => {
    const result = calculateSmartNextRefill(
      "2024-06-15",
      0.4,
      localDate(2024, 6, 15),
    );

    expect(result.intervalDays).toBe(1);
    expect(result.expectedDateKey).toBe("2024-06-16");
  });

  it.each(["Asia/Kolkata", "America/Los_Angeles"])(
    "does not mark a DATE due today as missed in %s",
    (timeZone) => {
      process.env.TZ = timeZone;
      const currentDate = localDate(2026, 7, 21, 23);
      const result = calculateSmartNextRefill(
        new Date("2026-07-16"),
        5,
        currentDate,
      );

      expect(result).toMatchObject({
        status: "refuelling-imminent",
        expectedDateKey: "2026-07-21",
        daysDifference: 0,
        wasProjectionPast: false,
      });
      expect(getRefillDisplayString(result)).toBe("Today - refuelling due");
    },
  );

  it("adds calendar days safely across a daylight-saving transition", () => {
    process.env.TZ = "America/Los_Angeles";
    const result = calculateSmartNextRefill(
      "2026-10-31",
      2,
      localDate(2026, 11, 1),
    );

    expect(result.expectedDateKey).toBe("2026-11-02");
    expect(result.daysDifference).toBe(1);
  });
});

describe("estimateRefillCadence", () => {
  it("uses the median of recent gaps so an isolated long gap is harmless", () => {
    const estimate = estimateRefillCadence(
      [
        "2026-01-01",
        "2026-01-08",
        "2026-01-15",
        "2026-03-16",
        "2026-03-23",
        "2026-03-30",
      ],
      localDate(2026, 4, 1),
    );

    expect(estimate).toMatchObject({
      intervalDays: 7,
      sampleSize: 5,
      eventCount: 6,
      madDays: 0,
      confidence: "high",
      lastEventDateKey: "2026-03-30",
    });
  });

  it("deduplicates dates and excludes invalid and future events", () => {
    const estimate = estimateRefillCadence(
      [
        "",
        "not-a-date",
        "2026-02-30",
        "2026-07-01T10:00:00Z",
        "2026-07-01",
        "2026-07-01",
        "2026-07-08",
        "2026-07-15",
        "2026-07-22",
      ],
      localDate(2026, 7, 21),
    );

    expect(estimate).toMatchObject({
      intervalDays: 7,
      sampleSize: 2,
      eventCount: 3,
      confidence: "medium",
      lastEventDateKey: "2026-07-15",
    });
  });

  it("uses at most the eight most recent intervals", () => {
    const estimate = estimateRefillCadence(
      [
        "2025-11-01",
        "2025-12-01",
        "2026-01-01",
        "2026-01-08",
        "2026-01-15",
        "2026-01-22",
        "2026-01-29",
        "2026-02-05",
        "2026-02-12",
        "2026-02-19",
        "2026-02-26",
      ],
      localDate(2026, 3, 1),
    );

    expect(estimate?.sampleSize).toBe(8);
    expect(estimate?.eventCount).toBe(9);
    expect(estimate?.intervalDays).toBe(7);
  });

  it("reports low confidence for a single observed interval", () => {
    const estimate = estimateRefillCadence(
      ["2026-07-11", "2026-07-16"],
      localDate(2026, 7, 21),
    );

    expect(estimate).toMatchObject({
      intervalDays: 5,
      sampleSize: 1,
      confidence: "low",
    });
  });

  it("returns null without two distinct valid historical dates", () => {
    expect(
      estimateRefillCadence(
        ["bad", "2026-07-21", "2026-07-21", "2026-07-22"],
        localDate(2026, 7, 21),
      ),
    ).toBeNull();
  });
});

describe("calculateSmartNextRefillFromHistory", () => {
  it("covers the exact July 21 regression without a synthetic July 26 date", () => {
    const result = calculateSmartNextRefillFromHistory(
      ["2026-07-11", "2026-07-16"],
      localDate(2026, 7, 21, 22),
    );

    expect(result).toMatchObject({
      status: "refuelling-imminent",
      expectedDateKey: "2026-07-21",
      daysDifference: 0,
      intervalDays: 5,
      sampleSize: 1,
      confidence: "low",
    });
    expect(getRefillDisplayString(result)).toBe("Today - refuelling due");
  });

  it("returns insufficient data when no cadence can be estimated", () => {
    const result = calculateSmartNextRefillFromHistory(
      ["2026-07-16"],
      localDate(2026, 7, 21),
    );

    expect(result.status).toBe("insufficient-data");
    expect(result.confidence).toBe("none");
  });
});

describe("getRefillDisplayString", () => {
  function makePrediction(
    overrides: Partial<SmartRefillPrediction>,
  ): SmartRefillPrediction {
    return {
      adjustedDate: localDate(2024, 6, 20, 0),
      originalDate: localDate(2024, 6, 20, 0),
      expectedDateKey: "2024-06-20",
      status: "on-track",
      message: "On track",
      daysDifference: 5,
      wasProjectionPast: false,
      cyclesMissed: 0,
      intervalDays: 7,
      sampleSize: 4,
      madDays: 0,
      confidence: "high",
      ...overrides,
    };
  }

  it("returns an insufficient-data message", () => {
    const prediction = makePrediction({
      status: "insufficient-data",
      adjustedDate: null,
      originalDate: null,
      expectedDateKey: null,
    });

    expect(getRefillDisplayString(prediction)).toBe(
      "Insufficient data to predict",
    );
  });

  it("returns an unable message when a non-insufficient prediction has no date", () => {
    const prediction = makePrediction({
      adjustedDate: null,
      originalDate: null,
      expectedDateKey: null,
    });

    expect(getRefillDisplayString(prediction)).toBe(
      "Unable to calculate prediction",
    );
  });

  it("returns only the date for an on-track prediction", () => {
    const display = getRefillDisplayString(makePrediction({}));

    expect(display).not.toContain("refuelling");
    expect(display.length).toBeGreaterThan(0);
  });

  it("uses mode-specific wording for a soon prediction", () => {
    const prediction = makePrediction({
      status: "refuelling-soon",
      daysDifference: 2,
    });

    expect(getRefillDisplayString(prediction, "fuel")).toContain(
      "refuelling in 2 days",
    );
    expect(getRefillDisplayString(prediction, "charge")).toContain(
      "charging in 2 days",
    );
  });

  it("formats due-today and due-tomorrow predictions", () => {
    expect(
      getRefillDisplayString(
        makePrediction({
          status: "refuelling-imminent",
          daysDifference: 0,
        }),
      ),
    ).toBe("Today - refuelling due");
    expect(
      getRefillDisplayString(
        makePrediction({
          status: "refuelling-imminent",
          daysDifference: 1,
        }),
      ),
    ).toBe("Tomorrow - refuelling due");
  });

  it("describes overdue predictions in days, never future cycles", () => {
    const singular = getRefillDisplayString(
      makePrediction({ status: "overdue", daysDifference: -1 }),
    );
    const plural = getRefillDisplayString(
      makePrediction({ status: "overdue", daysDifference: -3 }),
      "charge",
    );

    expect(singular).toContain("refuelling overdue by 1 day");
    expect(plural).toContain("charging overdue by 3 days");
    expect(`${singular} ${plural}`).not.toContain("missed");
  });
});

describe("status presentation helpers", () => {
  it.each([
    ["on-track", "emerald", "CheckCircle"],
    ["refuelling-soon", "amber", "Clock"],
    ["refuelling-imminent", "orange", "AlertCircle"],
    ["overdue", "rose", "AlertTriangle"],
    ["insufficient-data", "slate", "HelpCircle"],
  ] as const)("maps %s to its visual treatment", (status, colour, icon) => {
    expect(getStatusClassName(status)).toContain(colour);
    expect(getStatusIcon(status)).toBe(icon);
  });
});
