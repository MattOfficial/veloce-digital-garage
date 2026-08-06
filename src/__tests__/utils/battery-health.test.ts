import { describe, expect, it } from "vitest";

import type { VehicleSnapshot } from "@/types/database";
import {
  buildDischargeSegments,
  estimateDaysOfRangeLeft,
  getLatestSocSnapshot,
  summarizeBatteryHealth,
} from "@/utils/battery-health";

function makeSnapshot(overrides: Partial<VehicleSnapshot> = {}): VehicleSnapshot {
  return {
    id: "snap-1",
    vehicle_id: "v-1",
    date: "2026-07-01",
    odometer: 1000,
    soc_percent: 100,
    displayed_range: null,
    source: "manual",
    notes: null,
    created_at: "2026-07-01T10:00:00Z",
    ...overrides,
  };
}

/**
 * Three clean discharge segments at exactly 1 km per percent, separated by
 * recharges. 60 km on a 60% drop, twice more at the same rate.
 */
function makeCleanHistory(): VehicleSnapshot[] {
  return [
    makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 100 }),
    makeSnapshot({ id: "s2", date: "2026-07-04", odometer: 1060, soc_percent: 40 }),
    makeSnapshot({ id: "s3", date: "2026-07-05", odometer: 1060, soc_percent: 100 }),
    makeSnapshot({ id: "s4", date: "2026-07-08", odometer: 1122, soc_percent: 38 }),
    makeSnapshot({ id: "s5", date: "2026-07-09", odometer: 1122, soc_percent: 100 }),
    makeSnapshot({ id: "s6", date: "2026-07-12", odometer: 1180, soc_percent: 42 }),
  ];
}

const CURRENT_DATE = new Date("2026-07-13T00:00:00Z");

describe("buildDischargeSegments", () => {
  it("derives km per percent from a discharge between two snapshots", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 100 }),
      makeSnapshot({ id: "s2", date: "2026-07-04", odometer: 1060, soc_percent: 40 }),
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0].usable).toBe(true);
    expect(segments[0].socDrop).toBe(60);
    expect(segments[0].distance).toBe(60);
    expect(segments[0].kmPerPercent).toBeCloseTo(1, 6);
  });

  it("rejects a segment where the battery level went up", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 40 }),
      makeSnapshot({ id: "s2", date: "2026-07-02", odometer: 1010, soc_percent: 90 }),
    ]);

    expect(segments[0].usable).toBe(false);
    expect(segments[0].rejection).toBe("charged-between");
  });

  it("rejects a segment with no distance covered", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 90 }),
      makeSnapshot({ id: "s2", date: "2026-07-02", odometer: 1000, soc_percent: 80 }),
    ]);

    expect(segments[0].usable).toBe(false);
    expect(segments[0].rejection).toBe("no-distance");
  });

  it("rejects a drop too small to survive whole-percent reporting", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 90 }),
      makeSnapshot({ id: "s2", date: "2026-07-02", odometer: 1003, soc_percent: 87 }),
    ]);

    expect(segments[0].usable).toBe(false);
    expect(segments[0].rejection).toBe("soc-drop-too-small");
  });

  it("rejects a segment spanning too long to trust", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-05-01", odometer: 1000, soc_percent: 100 }),
      makeSnapshot({ id: "s2", date: "2026-07-01", odometer: 1060, soc_percent: 40 }),
    ]);

    expect(segments[0].usable).toBe(false);
    expect(segments[0].rejection).toBe("span-too-long");
  });

  it("ignores snapshots with no state of charge", () => {
    const segments = buildDischargeSegments([
      makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 100 }),
      makeSnapshot({ id: "s2", date: "2026-07-02", odometer: 1030, soc_percent: null }),
      makeSnapshot({ id: "s3", date: "2026-07-04", odometer: 1060, soc_percent: 40 }),
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0].startSnapshotId).toBe("s1");
    expect(segments[0].endSnapshotId).toBe("s3");
  });

  it("flags a rate far from the median as an outlier even when the rest agree exactly", () => {
    const segments = buildDischargeSegments([
      ...makeCleanHistory(),
      makeSnapshot({ id: "s7", date: "2026-07-13", odometer: 1180, soc_percent: 100 }),
      // 300 km on a 60% drop is five times the established rate: almost
      // certainly an unlogged charge partway through.
      makeSnapshot({ id: "s8", date: "2026-07-16", odometer: 1480, soc_percent: 40 }),
    ]);

    const outliers = segments.filter((segment) => segment.rejection === "outlier");
    expect(outliers).toHaveLength(1);
    expect(outliers[0].endSnapshotId).toBe("s8");
  });
});

describe("summarizeBatteryHealth", () => {
  it("reports no measurement until there are enough usable segments", () => {
    const summary = summarizeBatteryHealth(
      [
        makeSnapshot({ id: "s1", date: "2026-07-01", odometer: 1000, soc_percent: 100 }),
        makeSnapshot({ id: "s2", date: "2026-07-04", odometer: 1060, soc_percent: 40 }),
      ],
      { currentDate: CURRENT_DATE },
    );

    expect(summary.usableSegmentCount).toBe(1);
    expect(summary.kmPerPercent).toBeNull();
    expect(summary.usableRangeKm).toBeNull();
    expect(summary.confidence).toBe("low");
  });

  it("returns an empty summary with no snapshots at all", () => {
    const summary = summarizeBatteryHealth([], { currentDate: CURRENT_DATE });

    expect(summary.usableSegmentCount).toBe(0);
    expect(summary.confidence).toBe("none");
    expect(summary.stateOfHealthPercent).toBeNull();
  });

  it("takes the median rate and projects it to a full charge", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      currentDate: CURRENT_DATE,
    });

    expect(summary.usableSegmentCount).toBe(3);
    expect(summary.kmPerPercent).toBeCloseTo(1, 6);
    expect(summary.usableRangeKm).toBeCloseTo(100, 6);
    expect(summary.confidence).toBe("medium");
  });

  it("measures state of health against a configured baseline", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      baselineRangeKm: 110,
      currentDate: CURRENT_DATE,
    });

    expect(summary.baselineSource).toBe("configured");
    expect(summary.stateOfHealthPercent).toBeCloseTo(90.909, 2);
  });

  it("falls back to the earliest readings as a baseline", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      currentDate: CURRENT_DATE,
    });

    expect(summary.baselineSource).toBe("earliest-segments");
    expect(summary.baselineRangeKm).toBeCloseTo(100, 6);
  });

  it("derives Wh per distance unit from the usable pack size", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      usableBatteryKwh: 3.7,
      currentDate: CURRENT_DATE,
    });

    // 3.7 kWh spread over a 100 km usable range.
    expect(summary.whPerKm).toBeCloseTo(37, 6);
  });

  it("leaves Wh per distance unit unknown without a pack size", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      currentDate: CURRENT_DATE,
    });

    expect(summary.whPerKm).toBeNull();
  });

  it("does not project a threshold crossing when range is not falling", () => {
    const summary = summarizeBatteryHealth(makeCleanHistory(), {
      currentDate: CURRENT_DATE,
    });

    expect(summary.yearsToSohThreshold).toBeNull();
  });
});

describe("estimateDaysOfRangeLeft", () => {
  it("converts charge left and typical daily distance into days", () => {
    // 60% remaining at 1.5 km per percent is 90 km, against 30 km a day.
    expect(estimateDaysOfRangeLeft(60, 1.5, 30)).toBeCloseTo(3, 6);
  });

  it("returns null when any input is missing or non-positive", () => {
    expect(estimateDaysOfRangeLeft(null, 1.5, 30)).toBeNull();
    expect(estimateDaysOfRangeLeft(60, null, 30)).toBeNull();
    expect(estimateDaysOfRangeLeft(60, 1.5, null)).toBeNull();
    expect(estimateDaysOfRangeLeft(0, 1.5, 30)).toBeNull();
    expect(estimateDaysOfRangeLeft(60, 1.5, 0)).toBeNull();
  });
});

describe("getLatestSocSnapshot", () => {
  it("returns the most recent snapshot carrying a battery level", () => {
    const latest = getLatestSocSnapshot([
      makeSnapshot({ id: "s1", date: "2026-07-01", soc_percent: 100 }),
      makeSnapshot({ id: "s2", date: "2026-07-06", odometer: 1200, soc_percent: 55 }),
      makeSnapshot({ id: "s3", date: "2026-07-08", odometer: 1240, soc_percent: null }),
    ]);

    expect(latest?.id).toBe("s2");
  });

  it("returns null when no snapshot has a battery level", () => {
    expect(
      getLatestSocSnapshot([makeSnapshot({ id: "s1", soc_percent: null })]),
    ).toBeNull();
  });
});
