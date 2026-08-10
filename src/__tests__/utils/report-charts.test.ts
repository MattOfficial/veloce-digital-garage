import { describe, expect, it } from "vitest";

import {
  buildAxisScale,
  buildLineChart,
  buildPieSlices,
  buildStackedBarChart,
  niceStep,
  type ChartBox,
} from "@/utils/reports/report-charts";

const BOX: ChartBox = {
  width: 400,
  height: 200,
  padding: { top: 10, right: 10, bottom: 30, left: 40 },
};

// Derived from BOX: x 40, y 10, 350 wide, 160 tall.
const PLOT = { x: 40, y: 10, width: 350, height: 160 };

describe("niceStep", () => {
  it("rounds up to a step a reader can read a value off", () => {
    expect(niceStep(1)).toBe(1);
    expect(niceStep(1.7)).toBe(2);
    expect(niceStep(2.3)).toBe(2.5);
    expect(niceStep(3.7)).toBe(5);
    expect(niceStep(7.4)).toBe(10);
  });

  it("scales across magnitudes", () => {
    expect(niceStep(370)).toBe(500);
    expect(niceStep(0.037)).toBe(0.05);
  });

  it("falls back to 1 for nonsense", () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(-5)).toBe(1);
    expect(niceStep(Number.NaN)).toBe(1);
  });
});

describe("buildAxisScale", () => {
  it("covers the data with round gridlines", () => {
    expect(buildAxisScale(0, 100)).toEqual({
      min: 0,
      max: 100,
      step: 25,
      values: [0, 25, 50, 75, 100],
    });
  });

  it("extends past the data rather than clipping it", () => {
    const scale = buildAxisScale(0, 4_300);

    expect(scale.max).toBeGreaterThanOrEqual(4_300);
    expect(scale.values[0]).toBe(0);
  });

  it("gives a flat series a range instead of dividing by zero", () => {
    const scale = buildAxisScale(18.5, 18.5);

    expect(scale.max).toBeGreaterThan(scale.min);
    expect(scale.values).toHaveLength(3);
    expect(scale.values[1]).toBeCloseTo(18.5, 6);
  });

  it("handles an all-zero series", () => {
    const scale = buildAxisScale(0, 0);

    expect(scale.min).toBe(0);
    expect(scale.max).toBeGreaterThan(0);
  });

  it("does not produce float noise in the labels", () => {
    // Repeated addition of 0.1 gives 1.0999999999999999 by the eleventh step.
    for (const value of buildAxisScale(0, 1).values) {
      expect(String(value)).not.toMatch(/\d{6,}$/);
    }
  });

  it("survives non-finite input", () => {
    const scale = buildAxisScale(Number.NaN, Infinity);

    expect(Number.isFinite(scale.min)).toBe(true);
    expect(Number.isFinite(scale.max)).toBe(true);
  });

  it("copes with a reversed domain", () => {
    expect(buildAxisScale(100, 0).max).toBe(100);
  });
});

describe("buildStackedBarChart", () => {
  const input = [
    {
      key: "2026-01",
      label: "Jan",
      segments: [
        { key: "fuel", value: 50 },
        { key: "maintenance", value: 50 },
      ],
    },
    {
      key: "2026-02",
      label: "Feb",
      segments: [
        { key: "fuel", value: 100 },
        { key: "maintenance", value: 0 },
      ],
    },
  ];

  it("stacks segments upward from the baseline", () => {
    const chart = buildStackedBarChart(input, BOX);
    const [fuel, maintenance] = chart.bars[0].segments;

    // Plot floor is y 170. Half of 160px for each half of a 100 total.
    expect(fuel).toEqual({ key: "fuel", value: 50, y: 90, height: 80 });
    expect(maintenance).toEqual({ key: "maintenance", value: 50, y: 10, height: 80 });
  });

  it("centres each bar in its slot with a gap between them", () => {
    const chart = buildStackedBarChart(input, BOX);

    expect(chart.bars[0].x).toBe(66.25);
    expect(chart.bars[0].width).toBe(122.5);
    expect(chart.bars[1].x).toBe(241.25);
  });

  it("scales every bar against one axis", () => {
    const chart = buildStackedBarChart(input, BOX);

    expect(chart.axis.max).toBe(100);
    expect(chart.bars[0].total).toBe(100);
    expect(chart.bars[1].total).toBe(100);
  });

  it("gives a zero segment no height", () => {
    const chart = buildStackedBarChart(input, BOX);

    expect(chart.bars[1].segments[1].height).toBe(0);
  });

  it("treats a negative value as nothing rather than drawing upside down", () => {
    const chart = buildStackedBarChart(
      [{ key: "a", label: "A", segments: [{ key: "fuel", value: -50 }] }],
      BOX,
    );

    expect(chart.bars[0].segments[0].height).toBe(0);
  });

  it("thins labels once there are more months than room", () => {
    const many = Array.from({ length: 24 }, (_, index) => ({
      key: `m-${index}`,
      label: `M${index}`,
      segments: [{ key: "fuel", value: 10 }],
    }));

    expect(buildStackedBarChart(many, BOX).labelEvery).toBe(2);
    expect(buildStackedBarChart(input, BOX).labelEvery).toBe(1);
  });

  it("returns an empty chart rather than throwing on no data", () => {
    const chart = buildStackedBarChart([], BOX);

    expect(chart.bars).toEqual([]);
    expect(chart.plot).toEqual(PLOT);
  });

  it("puts a gridline at every axis value", () => {
    const chart = buildStackedBarChart(input, BOX);

    expect(chart.gridLines).toHaveLength(chart.axis.values.length);
    expect(chart.gridLines[0]).toEqual({ value: 0, y: 170 });
    expect(chart.gridLines[chart.gridLines.length - 1]).toEqual({ value: 100, y: 10 });
  });
});

describe("buildPieSlices", () => {
  const geometry = { cx: 50, cy: 50, radius: 40 };

  it("starts at twelve o'clock and runs clockwise", () => {
    const slices = buildPieSlices(
      [
        { key: "fuel", value: 50 },
        { key: "maintenance", value: 50 },
      ],
      geometry,
    );

    expect(slices[0].path).toBe("M 50 50 L 50 10 A 40 40 0 0 1 50 90 Z");
    expect(slices[1].path).toBe("M 50 50 L 50 90 A 40 40 0 0 1 50 10 Z");
  });

  it("sets the large-arc flag past a half turn", () => {
    const slices = buildPieSlices(
      [
        { key: "fuel", value: 75 },
        { key: "maintenance", value: 25 },
      ],
      geometry,
    );

    expect(slices[0].path).toContain("A 40 40 0 1 1");
    expect(slices[1].path).toContain("A 40 40 0 0 1");
  });

  it("draws a whole circle when one category holds everything", () => {
    // A single arc sweeping a full turn ends where it began, and SVG renders
    // nothing at all — a petrol-only garage would get a blank space.
    const slices = buildPieSlices([{ key: "fuel", value: 4_500 }], geometry);

    expect(slices).toHaveLength(1);
    expect(slices[0].share).toBe(1);
    expect(slices[0].path).toBe(
      "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 Z",
    );
  });

  it("reports each slice's share of the whole", () => {
    const slices = buildPieSlices(
      [
        { key: "fuel", value: 30 },
        { key: "charge", value: 10 },
        { key: "maintenance", value: 10 },
      ],
      geometry,
    );

    expect(slices.map((slice) => slice.share)).toEqual([0.6, 0.2, 0.2]);
  });

  it("drops slices with nothing in them", () => {
    const slices = buildPieSlices(
      [
        { key: "fuel", value: 100 },
        { key: "charge", value: 0 },
        { key: "maintenance", value: -5 },
      ],
      geometry,
    );

    expect(slices.map((slice) => slice.key)).toEqual(["fuel"]);
  });

  it("draws nothing when there is nothing to draw", () => {
    expect(buildPieSlices([], geometry)).toEqual([]);
    expect(buildPieSlices([{ key: "fuel", value: 0 }], geometry)).toEqual([]);
    expect(buildPieSlices([{ key: "fuel", value: 10 }], { ...geometry, radius: 0 })).toEqual([]);
  });

  it("places the label inside the slice", () => {
    const [slice] = buildPieSlices(
      [
        { key: "fuel", value: 50 },
        { key: "maintenance", value: 50 },
      ],
      geometry,
    );

    const distance = Math.hypot(slice.labelX - 50, slice.labelY - 50);
    expect(distance).toBeLessThan(40);
    expect(distance).toBeGreaterThan(0);
  });
});

describe("buildLineChart", () => {
  it("places points at their true position in time", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-01", value: 20 },
        { date: "2026-01-11", value: 22 },
        { date: "2026-01-31", value: 24 },
      ],
      BOX,
    );

    // A third of the elapsed days, not a half of the readings.
    expect(chart.points[0].x).toBe(40);
    expect(chart.points[1].x).toBeCloseTo(40 + 350 / 3, 1);
    expect(chart.points[2].x).toBe(390);
  });

  it("sorts readings that arrive out of order", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-31", value: 24 },
        { date: "2026-01-01", value: 20 },
      ],
      BOX,
    );

    expect(chart.points.map((point) => point.date)).toEqual([
      "2026-01-01",
      "2026-01-31",
    ]);
  });

  it("draws a lone reading as a dot with no line", () => {
    const chart = buildLineChart([{ date: "2026-01-01", value: 20 }], BOX);

    expect(chart.points).toHaveLength(1);
    expect(chart.polyline).toBe("");
    // Nowhere sensible to put a single point but the middle.
    expect(chart.points[0].x).toBe(215);
  });

  it("joins two or more readings into a polyline", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-01", value: 20 },
        { date: "2026-01-31", value: 24 },
      ],
      BOX,
    );

    expect(chart.polyline.split(" ")).toHaveLength(2);
    expect(chart.polyline).toMatch(/^40,\d/);
  });

  it("survives every reading landing on the same day", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-01", value: 20 },
        { date: "2026-01-01", value: 24 },
      ],
      BOX,
    );

    expect(chart.points.every((point) => point.x === 215)).toBe(true);
  });

  it("survives a perfectly flat series", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-01", value: 18.5 },
        { date: "2026-01-31", value: 18.5 },
      ],
      BOX,
    );

    for (const point of chart.points) {
      expect(Number.isFinite(point.y)).toBe(true);
      expect(point.y).toBeGreaterThanOrEqual(PLOT.y);
      expect(point.y).toBeLessThanOrEqual(PLOT.y + PLOT.height);
    }
  });

  it("puts a higher reading higher up the page", () => {
    const chart = buildLineChart(
      [
        { date: "2026-01-01", value: 20 },
        { date: "2026-01-31", value: 24 },
      ],
      BOX,
    );

    expect(chart.points[1].y).toBeLessThan(chart.points[0].y);
  });

  it("discards readings with an unusable date", () => {
    const chart = buildLineChart(
      [
        { date: "not-a-date", value: 20 },
        { date: "2026-01-31", value: 24 },
      ],
      BOX,
    );

    expect(chart.points).toHaveLength(1);
  });

  it("returns an empty chart for no readings", () => {
    const chart = buildLineChart([], BOX);

    expect(chart.points).toEqual([]);
    expect(chart.polyline).toBe("");
    expect(chart.xLabels).toEqual([]);
    expect(Number.isFinite(chart.axis.max)).toBe(true);
  });

  it("thins x labels but always keeps the last", () => {
    const many = Array.from({ length: 20 }, (_, index) => ({
      date: `2026-01-${String(index + 1).padStart(2, "0")}`,
      value: 20 + index,
    }));

    const chart = buildLineChart(many, BOX);

    expect(chart.xLabels.length).toBeLessThanOrEqual(6);
    expect(chart.xLabels[chart.xLabels.length - 1].date).toBe("2026-01-20");
  });
});
