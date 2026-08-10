/**
 * Chart geometry for the PDF report.
 *
 * Recharts renders to the DOM, so nothing in the app's charting stack can be
 * reused on the server — these figures are drawn with raw SVG primitives
 * instead. That makes the arithmetic the risky part: an arc that sweeps a full
 * turn draws nothing, a flat series divides by zero, and neither failure is
 * visible until someone opens the file. So the maths lives here, in one pure
 * module with tests, and the renderer only walks the shapes it returns.
 *
 * Every coordinate is in the SVG user space the caller describes. Nothing here
 * knows about colour, copy or fonts.
 */

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ChartBox = {
  width: number;
  height: number;
  padding: ChartPadding;
};

export type PlotArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AxisScale = {
  min: number;
  max: number;
  step: number;
  values: number[];
};

/** Two decimals is below the resolution of a printed page and keeps files small. */
function round(value: number): number {
  return Number(value.toFixed(2));
}

function getPlotArea(box: ChartBox): PlotArea {
  return {
    x: box.padding.left,
    y: box.padding.top,
    width: Math.max(0, box.width - box.padding.left - box.padding.right),
    height: Math.max(0, box.height - box.padding.top - box.padding.bottom),
  };
}

/**
 * Rounds a rough interval up to one a reader expects to see on an axis — 1, 2,
 * 2.5 or 5 times a power of ten. Without this the gridlines land on 3.7 and
 * 7.4, which nobody can read a value off.
 */
export function niceStep(rough: number): number {
  if (!Number.isFinite(rough) || rough <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;

  return nice * magnitude;
}

/**
 * A readable axis covering the data. A flat series — every fill at exactly the
 * same economy — has no range to scale, so it is given one rather than being
 * allowed to divide by zero.
 */
export function buildAxisScale(min: number, max: number, targetCount = 4): AxisScale {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 0;
  const low = Math.min(safeMin, safeMax);
  const high = Math.max(safeMin, safeMax);
  const count = Math.max(1, Math.floor(targetCount));

  if (high - low === 0) {
    const step = niceStep(Math.abs(high) / count || 1);
    const flatMin = high === 0 ? 0 : high - step;

    return {
      min: flatMin,
      max: flatMin + step * 2,
      step,
      values: [flatMin, flatMin + step, flatMin + step * 2].map(round),
    };
  }

  const step = niceStep((high - low) / count);
  const scaleMin = Math.floor(low / step) * step;
  const scaleMax = Math.ceil(high / step) * step;
  const values: number[] = [];

  // Built by multiplication rather than repeated addition: accumulating 0.1
  // eleven times produces 1.0999999999999999 and a gridline labelled as such.
  const steps = Math.round((scaleMax - scaleMin) / step);
  for (let index = 0; index <= steps; index += 1) {
    values.push(round(scaleMin + index * step));
  }

  return { min: round(scaleMin), max: round(scaleMax), step, values };
}

export type GridLine = { value: number; y: number };

function buildGridLines(scale: AxisScale, plot: PlotArea): GridLine[] {
  const span = scale.max - scale.min || 1;

  return scale.values.map((value) => ({
    value,
    y: round(plot.y + plot.height - ((value - scale.min) / span) * plot.height),
  }));
}

export type StackedBarInput = {
  key: string;
  label: string;
  segments: Array<{ key: string; value: number }>;
};

export type StackedBarSegment = {
  key: string;
  value: number;
  y: number;
  height: number;
};

export type StackedBar = {
  key: string;
  label: string;
  x: number;
  width: number;
  total: number;
  segments: StackedBarSegment[];
};

export type StackedBarChart = {
  plot: PlotArea;
  axis: AxisScale;
  gridLines: GridLine[];
  bars: StackedBar[];
  /** Render every nth label; a two-year window has more months than room. */
  labelEvery: number;
};

const MAX_AXIS_LABELS = 12;
const BAR_GAP_RATIO = 0.3;

export function buildStackedBarChart(
  input: StackedBarInput[],
  box: ChartBox,
  options: { maxLabels?: number } = {},
): StackedBarChart {
  const plot = getPlotArea(box);
  const totals = input.map((bar) =>
    bar.segments.reduce(
      (total, segment) => total + (Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0),
      0,
    ),
  );
  const axis = buildAxisScale(0, Math.max(0, ...totals));
  const span = axis.max - axis.min || 1;
  const slot = input.length > 0 ? plot.width / input.length : plot.width;
  const barWidth = slot * (1 - BAR_GAP_RATIO);

  const bars = input.map<StackedBar>((bar, index) => {
    const x = plot.x + slot * index + (slot - barWidth) / 2;
    let cursor = plot.y + plot.height;

    const segments = bar.segments.map<StackedBarSegment>((segment) => {
      const value = Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0;
      const height = (value / span) * plot.height;
      cursor -= height;

      return { key: segment.key, value, y: round(cursor), height: round(height) };
    });

    return {
      key: bar.key,
      label: bar.label,
      x: round(x),
      width: round(barWidth),
      total: round(totals[index]),
      segments,
    };
  });

  return {
    plot,
    axis,
    gridLines: buildGridLines(axis, plot),
    bars,
    labelEvery: Math.max(
      1,
      Math.ceil(input.length / Math.max(1, options.maxLabels ?? MAX_AXIS_LABELS)),
    ),
  };
}

export type PieInput = { key: string; value: number };

export type PieSlice = {
  key: string;
  value: number;
  /** Fraction of the whole, 0-1. */
  share: number;
  path: string;
  /** A point inside the slice, for a leader line or an inline label. */
  labelX: number;
  labelY: number;
};

export type PieGeometry = { cx: number; cy: number; radius: number };

const LABEL_RADIUS_RATIO = 0.65;

/**
 * Slices start at twelve o'clock and run clockwise.
 *
 * The case that matters: one category holding everything. An arc whose start
 * and end points are identical is a zero-length arc, and SVG draws nothing at
 * all — a garage that only ever buys petrol would get a blank circle. A full
 * turn is therefore emitted as two half-arcs instead.
 */
export function buildPieSlices(
  input: PieInput[],
  geometry: PieGeometry,
): PieSlice[] {
  const { cx, cy, radius } = geometry;
  const usable = input.filter(
    (slice) => Number.isFinite(slice.value) && slice.value > 0,
  );
  const total = usable.reduce((sum, slice) => sum + slice.value, 0);

  if (total <= 0 || radius <= 0) return [];

  if (usable.length === 1) {
    return [
      {
        key: usable[0].key,
        value: usable[0].value,
        share: 1,
        path: [
          `M ${round(cx)} ${round(cy - radius)}`,
          `A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy + radius)}`,
          `A ${round(radius)} ${round(radius)} 0 1 1 ${round(cx)} ${round(cy - radius)}`,
          "Z",
        ].join(" "),
        labelX: round(cx),
        labelY: round(cy),
      },
    ];
  }

  let angle = -Math.PI / 2;

  return usable.map((slice) => {
    const share = slice.value / total;
    const sweep = share * Math.PI * 2;
    const end = angle + sweep;

    const startX = cx + radius * Math.cos(angle);
    const startY = cy + radius * Math.sin(angle);
    const endX = cx + radius * Math.cos(end);
    const endY = cy + radius * Math.sin(end);
    const midAngle = angle + sweep / 2;

    const path = [
      `M ${round(cx)} ${round(cy)}`,
      `L ${round(startX)} ${round(startY)}`,
      `A ${round(radius)} ${round(radius)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${round(endX)} ${round(endY)}`,
      "Z",
    ].join(" ");

    angle = end;

    return {
      key: slice.key,
      value: slice.value,
      share,
      path,
      labelX: round(cx + radius * LABEL_RADIUS_RATIO * Math.cos(midAngle)),
      labelY: round(cy + radius * LABEL_RADIUS_RATIO * Math.sin(midAngle)),
    };
  });
}

export type LineInput = { date: string; value: number };

export type LinePoint = {
  date: string;
  value: number;
  x: number;
  y: number;
};

export type LineChart = {
  plot: PlotArea;
  axis: AxisScale;
  gridLines: GridLine[];
  points: LinePoint[];
  /** Empty for a single reading, which is drawn as a dot and nothing else. */
  polyline: string;
  /** Sparse date ticks along the x axis, unformatted. */
  xLabels: Array<{ x: number; date: string }>;
};

const MILLISECONDS_PER_DAY = 86_400_000;

function toDayNumber(date: string): number | null {
  const parsed = Date.parse(`${date.slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(parsed) ? parsed / MILLISECONDS_PER_DAY : null;
}

/**
 * Points sit at their true position in time rather than at even intervals.
 * Three fills in one week and a fourth six months later is a fact about the
 * driving, and spacing them evenly would hide it.
 */
export function buildLineChart(
  input: LineInput[],
  box: ChartBox,
  options: { maxLabels?: number } = {},
): LineChart {
  const plot = getPlotArea(box);
  const usable = input
    .map((point) => ({ ...point, day: toDayNumber(point.date) }))
    .filter(
      (point): point is LineInput & { day: number } =>
        point.day != null && Number.isFinite(point.value),
    )
    .sort((left, right) => left.day - right.day);

  const values = usable.map((point) => point.value);
  const axis = buildAxisScale(Math.min(...values, Infinity), Math.max(...values, -Infinity));

  if (usable.length === 0) {
    return { plot, axis, gridLines: buildGridLines(axis, plot), points: [], polyline: "", xLabels: [] };
  }

  const span = axis.max - axis.min || 1;
  const firstDay = usable[0].day;
  const lastDay = usable[usable.length - 1].day;
  const dayRange = lastDay - firstDay;

  const toX = (day: number) =>
    dayRange === 0
      ? plot.x + plot.width / 2
      : plot.x + ((day - firstDay) / dayRange) * plot.width;

  const points = usable.map<LinePoint>((point) => ({
    date: point.date,
    value: point.value,
    x: round(toX(point.day)),
    y: round(plot.y + plot.height - ((point.value - axis.min) / span) * plot.height),
  }));

  const maxLabels = Math.max(2, options.maxLabels ?? 5);
  const labelEvery = Math.max(1, Math.ceil(points.length / maxLabels));
  const xLabels = points
    .filter((_, index) => index % labelEvery === 0 || index === points.length - 1)
    .map((point) => ({ x: point.x, date: point.date }));

  return {
    plot,
    axis,
    gridLines: buildGridLines(axis, plot),
    points,
    // A one-point polyline renders nothing; the dot carries it instead.
    polyline: points.length > 1 ? points.map((point) => `${point.x},${point.y}`).join(" ") : "",
    xLabels,
  };
}
