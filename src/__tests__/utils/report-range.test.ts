import { describe, expect, it } from "vitest";

import {
  getEarliestDate,
  getReportRangeDayCount,
  isDateInRange,
  isReportRangePreset,
  isValidIsoDate,
  resolveReportRange,
  toIsoDate,
  type ReportRange,
} from "@/utils/reports/report-range";

const TODAY = new Date("2026-08-10T14:30:00Z");

describe("toIsoDate", () => {
  it("passes through a bare calendar date", () => {
    expect(toIsoDate("2026-03-01")).toBe("2026-03-01");
  });

  it("narrows a timestamp to its calendar day", () => {
    expect(toIsoDate("2026-03-01T23:45:00Z")).toBe("2026-03-01");
  });

  it("formats a Date", () => {
    expect(toIsoDate(new Date(2026, 2, 1))).toBe("2026-03-01");
  });

  it("rejects a date the calendar does not have", () => {
    expect(toIsoDate("2026-13-45")).toBeNull();
    expect(toIsoDate("2026-02-30")).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(toIsoDate("01/03/2026")).toBeNull();
    expect(toIsoDate("")).toBeNull();
    expect(toIsoDate(null)).toBeNull();
    expect(toIsoDate(undefined)).toBeNull();
    expect(toIsoDate(new Date("nonsense"))).toBeNull();
  });
});

describe("isValidIsoDate", () => {
  it("agrees with toIsoDate", () => {
    expect(isValidIsoDate("2026-03-01")).toBe(true);
    expect(isValidIsoDate("2026-02-30")).toBe(false);
  });
});

describe("isReportRangePreset", () => {
  it("accepts known presets and rejects anything else", () => {
    expect(isReportRangePreset("last-30-days")).toBe(true);
    expect(isReportRangePreset("all-time")).toBe(true);
    expect(isReportRangePreset("last-decade")).toBe(false);
  });
});

describe("resolveReportRange", () => {
  it("makes a 30-day window contain exactly 30 days", () => {
    const range = resolveReportRange("last-30-days", { today: TODAY });

    expect(range).toEqual({
      preset: "last-30-days",
      from: "2026-07-12",
      to: "2026-08-10",
    });
    expect(getReportRangeDayCount(range)).toBe(30);
  });

  it("starts a month-based window the day after the offset, so consecutive windows do not overlap", () => {
    const range = resolveReportRange("last-3-months", { today: TODAY });

    expect(range.from).toBe("2026-05-11");
    expect(range.to).toBe("2026-08-10");
  });

  it("resolves the longer month windows", () => {
    expect(resolveReportRange("last-6-months", { today: TODAY }).from).toBe("2026-02-11");
    expect(resolveReportRange("last-12-months", { today: TODAY }).from).toBe("2025-08-11");
  });

  it("starts year-to-date on 1 January", () => {
    expect(resolveReportRange("year-to-date", { today: TODAY }).from).toBe("2026-01-01");
  });

  it("anchors all-time to the earliest record", () => {
    const range = resolveReportRange("all-time", {
      today: TODAY,
      earliest: "2019-04-02T08:00:00Z",
    });

    expect(range.from).toBe("2019-04-02");
    expect(range.to).toBe("2026-08-10");
  });

  it("collapses all-time to a single day when there are no records", () => {
    const range = resolveReportRange("all-time", { today: TODAY, earliest: null });

    expect(range.from).toBe("2026-08-10");
    expect(range.to).toBe("2026-08-10");
  });

  it("keeps a custom window as given", () => {
    const range = resolveReportRange("custom", {
      today: TODAY,
      from: "2026-01-15",
      to: "2026-02-20",
    });

    expect(range).toEqual({ preset: "custom", from: "2026-01-15", to: "2026-02-20" });
  });

  it("swaps a backwards custom window rather than returning nothing", () => {
    const range = resolveReportRange("custom", {
      today: TODAY,
      from: "2026-02-20",
      to: "2026-01-15",
    });

    expect(range).toEqual({ preset: "custom", from: "2026-01-15", to: "2026-02-20" });
  });

  it("falls back to today when a custom bound is unusable", () => {
    const range = resolveReportRange("custom", {
      today: TODAY,
      from: "not-a-date",
      to: "2026-09-01",
    });

    expect(range.from).toBe("2026-08-10");
    expect(range.to).toBe("2026-09-01");
  });

  it("defaults to the current date when no clock is supplied", () => {
    const range = resolveReportRange("year-to-date");

    expect(range.to).toBe(toIsoDate(new Date()));
  });
});

describe("isDateInRange", () => {
  const range: ReportRange = {
    preset: "custom",
    from: "2026-03-01",
    to: "2026-03-31",
  };

  it("includes both endpoints", () => {
    expect(isDateInRange("2026-03-01", range)).toBe(true);
    expect(isDateInRange("2026-03-31", range)).toBe(true);
  });

  it("excludes days outside the window", () => {
    expect(isDateInRange("2026-02-28", range)).toBe(false);
    expect(isDateInRange("2026-04-01", range)).toBe(false);
  });

  it("compares the calendar day of a timestamp, not its instant", () => {
    // The hazard this guards: a late-evening timestamp on the first day of the
    // window must not fall out of it.
    expect(isDateInRange("2026-03-01T23:59:59Z", range)).toBe(true);
    expect(isDateInRange("2026-03-31T22:00:00Z", range)).toBe(true);
  });

  it("treats an unparseable date as outside", () => {
    expect(isDateInRange("garbage", range)).toBe(false);
    expect(isDateInRange(null, range)).toBe(false);
  });
});

describe("getReportRangeDayCount", () => {
  it("counts a single day as one", () => {
    expect(
      getReportRangeDayCount({ preset: "custom", from: "2026-03-01", to: "2026-03-01" }),
    ).toBe(1);
  });

  it("counts inclusively", () => {
    expect(
      getReportRangeDayCount({ preset: "custom", from: "2026-03-01", to: "2026-03-10" }),
    ).toBe(10);
  });

  it("returns zero for an unparseable window", () => {
    expect(
      getReportRangeDayCount({ preset: "custom", from: "bad", to: "2026-03-10" }),
    ).toBe(0);
  });
});

describe("getEarliestDate", () => {
  it("finds the earliest usable date and ignores the rest", () => {
    expect(
      getEarliestDate(["2026-05-01", null, "bad", "2024-11-30", "2025-01-01"]),
    ).toBe("2024-11-30");
  });

  it("returns null when nothing is usable", () => {
    expect(getEarliestDate([])).toBeNull();
    expect(getEarliestDate([null, undefined, "nope"])).toBeNull();
  });
});
