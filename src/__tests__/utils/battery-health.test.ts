import { describe, expect, it } from "vitest";

import type { FuelLog, VehicleSnapshot } from "@/types/database";
import {
  buildDischargeSegments,
  collectSocObservations,
  estimateDaysOfRangeLeft,
  getLatestSocSnapshot,
  summarizeBatteryHealth,
  toChargeSocObservations,
} from "@/utils/battery-health";
import * as factories from "@/__tests__/factories";

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

/**
 * The same three clean segments, but recorded the way an owner who logs charge
 * sessions and never opens the check-in form actually records them: each
 * session carries the charge left on plugging in and the charge reached on
 * unplugging, both at the odometer where it happened.
 */
function makeChargeOnlyHistory(): FuelLog[] {
  return [
    factories.makeChargeLog({
      id: "c0",
      date: "2026-07-01",
      odometer: 1_000,
      start_soc: 45,
      end_soc: 100,
      created_at: "2026-07-01T20:00:00Z",
    }),
    factories.makeChargeLog({
      id: "c1",
      date: "2026-07-04",
      odometer: 1_060,
      start_soc: 40,
      end_soc: 100,
      created_at: "2026-07-04T20:00:00Z",
    }),
    factories.makeChargeLog({
      id: "c2",
      date: "2026-07-08",
      odometer: 1_122,
      start_soc: 38,
      end_soc: 100,
      created_at: "2026-07-08T20:00:00Z",
    }),
    factories.makeChargeLog({
      id: "c3",
      date: "2026-07-12",
      odometer: 1_180,
      start_soc: 42,
      end_soc: 100,
      created_at: "2026-07-12T20:00:00Z",
    }),
  ];
}

describe("toChargeSocObservations", () => {
  it("reads both ends of a charge session", () => {
    const observations = toChargeSocObservations([
      factories.makeChargeLog({ id: "c1", odometer: 1_060, start_soc: 40, end_soc: 100 }),
    ]);

    expect(observations).toHaveLength(2);
    expect(observations[0]).toMatchObject({ soc_percent: 40, odometer: 1_060 });
    expect(observations[1]).toMatchObject({ soc_percent: 100, odometer: 1_060 });
  });

  it("orders plug-in before unplug", () => {
    // They share a date and an odometer, so the created_at tiebreak is the only
    // thing keeping the session from reading backwards as a discharge.
    const [plugIn, unplug] = toChargeSocObservations([
      factories.makeChargeLog({ id: "c1", start_soc: 40, end_soc: 100 }),
    ]);

    expect(plugIn.created_at! < unplug.created_at!).toBe(true);
  });

  it("still orders a session with no created_at", () => {
    const [plugIn, unplug] = toChargeSocObservations([
      factories.makeChargeLog({ id: "c1", start_soc: 40, end_soc: 100, created_at: "" }),
    ]);

    expect(plugIn.created_at! < unplug.created_at!).toBe(true);
  });

  it("takes whichever end was recorded", () => {
    expect(
      toChargeSocObservations([
        factories.makeChargeLog({ id: "c1", start_soc: 40, end_soc: null }),
      ]),
    ).toHaveLength(1);

    expect(
      toChargeSocObservations([
        factories.makeChargeLog({ id: "c1", start_soc: null, end_soc: null }),
      ]),
    ).toHaveLength(0);
  });

  it("ignores fill-ups and the app's own estimates", () => {
    expect(
      toChargeSocObservations([
        factories.makeFuelLog({ id: "f1", start_soc: 40, end_soc: 100 }),
        factories.makeChargeLog({ id: "c1", start_soc: 40, end_soc: 100, is_estimated: true }),
      ]),
    ).toEqual([]);
  });
});

describe("collectSocObservations", () => {
  it("merges check-ins with charge sessions", () => {
    const merged = collectSocObservations(
      [makeSnapshot({ id: "s1" })],
      [factories.makeChargeLog({ id: "c1", start_soc: 40, end_soc: 100 })],
    );

    expect(merged).toHaveLength(3);
  });

  it("copes with either side missing", () => {
    expect(collectSocObservations()).toEqual([]);
    expect(collectSocObservations([makeSnapshot()])).toHaveLength(1);
  });
});

describe("battery health from charge sessions", () => {
  /**
   * The regression this guards. State of health was measured only from manual
   * check-ins, so an owner who logged every charge — odometer and both
   * percentages, everything the measurement needs — saw no figure at all.
   */
  it("measures discharge segments for an owner who only logs charges", () => {
    const observations = collectSocObservations([], makeChargeOnlyHistory());
    const usable = buildDischargeSegments(observations).filter((segment) => segment.usable);

    // Each session's unplug pairs with the next one's plug-in: 1,000 -> 1,060
    // on 100->40, then 1,060 -> 1,122 on 100->38, then 1,122 -> 1,180 on 100->42.
    expect(usable).toHaveLength(3);
    for (const segment of usable) {
      expect(segment.kmPerPercent).toBeCloseTo(1, 6);
    }
  });

  it("rejects the charge itself rather than counting it as a discharge", () => {
    const segments = buildDischargeSegments(
      collectSocObservations([], makeChargeOnlyHistory()),
    );

    // Plug-in to unplug is a rise at a standstill; both reasons are true, and
    // the rising charge is the one that must be caught.
    expect(
      segments.filter((segment) => segment.rejection === "charged-between").length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("produces a usable range where before there was none", () => {
    const chargeLogs = makeChargeOnlyHistory();

    const before = summarizeBatteryHealth([], { currentDate: CURRENT_DATE });
    const after = summarizeBatteryHealth(collectSocObservations([], chargeLogs), {
      currentDate: CURRENT_DATE,
      baselineRangeKm: 110,
    });

    expect(before.usableRangeKm).toBeNull();
    expect(after.kmPerPercent).toBeCloseTo(1, 6);
    expect(after.usableRangeKm).toBeCloseTo(100, 6);
    expect(after.stateOfHealthPercent).toBeCloseTo(90.9, 1);
  });

  it("combines check-ins and charges into one history", () => {
    const merged = collectSocObservations(
      [makeSnapshot({ id: "s0", date: "2026-06-28", odometer: 960, soc_percent: 100 })],
      makeChargeOnlyHistory(),
    );

    // The earlier check-in closes a further segment against the first plug-in,
    // so a check-in and a charge sit in one ordered history rather than two.
    const usable = buildDischargeSegments(merged).filter((segment) => segment.usable);

    expect(usable).toHaveLength(4);
    expect(usable[0]).toMatchObject({ startOdometer: 960, endOdometer: 1_000 });
  });

  it("reads the latest charge as the current state of charge", () => {
    const latest = getLatestSocSnapshot(collectSocObservations([], makeChargeOnlyHistory()));

    expect(latest?.soc_percent).toBe(100);
    expect(latest?.odometer).toBe(1_180);
  });
});

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
