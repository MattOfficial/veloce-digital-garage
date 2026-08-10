import { Circle, G, Line, Path, Polyline, Rect, Svg, Text, View } from "@react-pdf/renderer";

import { ui } from "@/content/en/ui";
import { formatTableDate } from "@/utils/formatting";
import type {
  ReportCharts,
  ReportEfficiencySeries,
  ReportUnits,
} from "@/utils/reports/report-dataset";
import {
  buildLineChart,
  buildPieSlices,
  buildStackedBarChart,
  type ChartBox,
} from "@/utils/reports/report-charts";
import { formatPdfMoney, formatPdfNumber } from "@/utils/reports/report-format";
import {
  REPORT_COLORS,
  REPORT_SERIES_COLORS,
  SERIES_GAP,
  type ReportSeriesKey,
} from "@/components/reports/report-theme";

/**
 * The charts, drawn from the geometry `report-charts.ts` returns. Nothing here
 * computes a coordinate; this file only chooses colour, weight and text.
 */

const AXIS_LABEL_SIZE = 7;
const CHART_WIDTH = 515;

const BAR_BOX: ChartBox = {
  width: CHART_WIDTH,
  height: 170,
  padding: { top: 12, right: 8, bottom: 26, left: 56 },
};

const LINE_BOX: ChartBox = {
  width: CHART_WIDTH,
  height: 150,
  padding: { top: 12, right: 14, bottom: 26, left: 46 },
};

const PIE_SIZE = 150;

const SERIES_ORDER: ReportSeriesKey[] = ["fuel", "charge", "maintenance"];

function seriesLabel(key: ReportSeriesKey): string {
  const { summary } = ui.reports;
  if (key === "fuel") return summary.fuel;
  if (key === "charge") return summary.charging;
  return summary.service;
}

function ChartHeading({ title, caption }: { title: string; caption?: string }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: REPORT_COLORS.text }}>
        {title}
      </Text>
      {caption ? (
        <Text style={{ fontSize: 8, color: REPORT_COLORS.muted, marginTop: 2 }}>{caption}</Text>
      ) : null}
    </View>
  );
}

/**
 * Identity is never carried by colour alone: each swatch is named, and the
 * figure beside it is the same number the tables report.
 */
function Legend({
  entries,
  currency,
}: {
  entries: Array<{ key: ReportSeriesKey; value: number }>;
  currency: string;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 8 }}>
      {entries.map((entry) => (
        <View key={entry.key} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              backgroundColor: REPORT_SERIES_COLORS[entry.key],
            }}
          />
          <Text style={{ fontSize: 8, color: REPORT_COLORS.secondary }}>
            {seriesLabel(entry.key)}
          </Text>
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: REPORT_COLORS.text }}>
            {formatPdfMoney(entry.value, currency)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function MonthlySpendChart({
  charts,
  units,
}: {
  charts: ReportCharts;
  units: ReportUnits;
}) {
  const chart = buildStackedBarChart(
    charts.monthlySpend.map((point) => ({
      key: point.key,
      label: point.label,
      segments: SERIES_ORDER.map((key) => ({ key, value: point[key] })),
    })),
    BAR_BOX,
  );

  const totals = SERIES_ORDER.map((key) => ({
    key,
    value: charts.monthlySpend.reduce((sum, point) => sum + point[key], 0),
  })).filter((entry) => entry.value > 0);

  return (
    <View wrap={false} style={{ marginBottom: 18 }}>
      <ChartHeading
        title={ui.reports.pdf.charts.monthlySpend}
        caption={ui.reports.pdf.charts.monthlySpendCaption}
      />
      <Svg width={BAR_BOX.width} height={BAR_BOX.height}>
        <G>
          {chart.gridLines.map((line) => (
            <G key={line.value}>
              <Line
                x1={chart.plot.x}
                y1={line.y}
                x2={chart.plot.x + chart.plot.width}
                y2={line.y}
                strokeWidth={0.5}
                stroke={REPORT_COLORS.border}
              />
              <Text
                x={chart.plot.x - 6}
                y={line.y + 2.5}
                textAnchor="end"
                fill={REPORT_COLORS.muted}
                style={{ fontSize: AXIS_LABEL_SIZE }}
              >
                {formatPdfNumber(line.value, { notation: "compact" })}
              </Text>
            </G>
          ))}

          {chart.bars.map((bar, index) => (
            <G key={bar.key}>
              {bar.segments
                .filter((segment) => segment.height > 0)
                .map((segment) => (
                  <Rect
                    key={segment.key}
                    x={bar.x}
                    // The gap is taken off the top of each fill so stacked
                    // segments read as separate marks rather than one block.
                    y={segment.y}
                    width={bar.width}
                    height={Math.max(0.5, segment.height - SERIES_GAP)}
                    fill={REPORT_SERIES_COLORS[segment.key as ReportSeriesKey]}
                  />
                ))}
              {index % chart.labelEvery === 0 ? (
                <Text
                  x={bar.x + bar.width / 2}
                  y={chart.plot.y + chart.plot.height + 12}
                  textAnchor="middle"
                  fill={REPORT_COLORS.muted}
                style={{ fontSize: AXIS_LABEL_SIZE }}
                >
                  {bar.label}
                </Text>
              ) : null}
            </G>
          ))}
        </G>
      </Svg>
      <Legend entries={totals} currency={units.currency} />
    </View>
  );
}

export function CostMixChart({
  charts,
  units,
}: {
  charts: ReportCharts;
  units: ReportUnits;
}) {
  const radius = PIE_SIZE / 2 - 4;
  const slices = buildPieSlices(
    charts.costMix.map((slice) => ({ key: slice.key, value: slice.value })),
    { cx: PIE_SIZE / 2, cy: PIE_SIZE / 2, radius },
  );

  if (slices.length === 0) return null;

  return (
    <View wrap={false} style={{ marginBottom: 18 }}>
      <ChartHeading title={ui.reports.pdf.charts.costMix} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 22 }}>
        <Svg width={PIE_SIZE} height={PIE_SIZE}>
          <G>
            {slices.map((slice) => (
              <Path
                key={slice.key}
                d={slice.path}
                fill={REPORT_SERIES_COLORS[slice.key as ReportSeriesKey]}
                stroke={REPORT_COLORS.surface}
                strokeWidth={SERIES_GAP}
              />
            ))}
          </G>
        </Svg>
        <View style={{ gap: 7 }}>
          {slices.map((slice) => (
            <View key={slice.key} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: REPORT_SERIES_COLORS[slice.key as ReportSeriesKey],
                }}
              />
              <Text style={{ fontSize: 9, color: REPORT_COLORS.secondary, width: 96 }}>
                {seriesLabel(slice.key as ReportSeriesKey)}
              </Text>
              <Text
                style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: REPORT_COLORS.text }}
              >
                {formatPdfMoney(slice.value, units.currency)}
              </Text>
              <Text style={{ fontSize: 9, color: REPORT_COLORS.muted }}>
                {`${Math.round(slice.share * 100)}%`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function EfficiencyChart({ series }: { series: ReportEfficiencySeries }) {
  const chart = buildLineChart(
    series.points.map((point) => ({ date: point.date, value: point.value })),
    LINE_BOX,
  );

  if (chart.points.length === 0) return null;

  const caption = ui.reports.pdf.charts.efficiencyCaption(
    series.unit,
    series.vehicleLabels.join(", "),
  );

  return (
    <View wrap={false} style={{ marginBottom: 18 }}>
      <ChartHeading title={ui.reports.pdf.charts.efficiency} caption={caption} />
      <Svg width={LINE_BOX.width} height={LINE_BOX.height}>
        <G>
          {chart.gridLines.map((line) => (
            <G key={line.value}>
              <Line
                x1={chart.plot.x}
                y1={line.y}
                x2={chart.plot.x + chart.plot.width}
                y2={line.y}
                strokeWidth={0.5}
                stroke={REPORT_COLORS.border}
              />
              <Text
                x={chart.plot.x - 6}
                y={line.y + 2.5}
                textAnchor="end"
                fill={REPORT_COLORS.muted}
                style={{ fontSize: AXIS_LABEL_SIZE }}
              >
                {formatPdfNumber(line.value, { maximumFractionDigits: 1 })}
              </Text>
            </G>
          ))}

          {chart.polyline ? (
            <Polyline
              points={chart.polyline}
              fill="none"
              strokeWidth={2}
              stroke={REPORT_COLORS.accent}
            />
          ) : null}

          {chart.points.map((point) => (
            <Circle
              key={`${point.date}-${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r={2.5}
              fill={REPORT_COLORS.accent}
              stroke={REPORT_COLORS.surface}
              strokeWidth={SERIES_GAP / 2}
            />
          ))}

          {chart.xLabels.map((label) => (
            <Text
              key={label.date}
              x={label.x}
              y={chart.plot.y + chart.plot.height + 12}
              textAnchor="middle"
              fill={REPORT_COLORS.muted}
                style={{ fontSize: AXIS_LABEL_SIZE }}
            >
              {formatTableDate(label.date)}
            </Text>
          ))}
        </G>
      </Svg>
      {series.omittedVehicleCount > 0 ? (
        <Text style={{ fontSize: 8, color: REPORT_COLORS.muted, marginTop: 6 }}>
          {ui.reports.pdf.charts.efficiencyOmitted(series.omittedVehicleCount)}
        </Text>
      ) : null}
    </View>
  );
}
