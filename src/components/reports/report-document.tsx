import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { ui } from "@/content/en/ui";
import { isElectricPowertrain } from "@/types/database";
import { formatTableDate } from "@/utils/formatting";
import type {
  ReportDataset,
  ReportEnergyRow,
  ReportVehicleProfile,
} from "@/utils/reports/report-dataset";
import {
  formatPdfMoney,
  formatPdfNumber,
  getPdfCurrencyLabel,
  getTyrePositionLabel,
  toPdfText,
} from "@/utils/reports/report-format";
import {
  CostMixChart,
  EfficiencyChart,
  MonthlySpendChart,
  VehicleSpendChart,
} from "@/components/reports/report-charts-pdf";
import { REPORT_COLORS } from "@/components/reports/report-theme";

/**
 * The PDF report.
 *
 * Built with `@react-pdf/renderer` on the server. It reads the same
 * `ReportDataset` the CSV and Excel writers read, so the total on the cover
 * cannot disagree with the total in the tables.
 */

/**
 * Wrap on spaces, never mid-word. The default splits a word to fill a line,
 * which in a narrow stat tile turned "Plug-in hybrid" into "Plug-in hy-/brid".
 */
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 52,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: REPORT_COLORS.text,
    backgroundColor: REPORT_COLORS.surface,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: REPORT_COLORS.text,
    paddingBottom: 10,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 10, color: REPORT_COLORS.secondary, marginTop: 4 },
  meta: { fontSize: 8, color: REPORT_COLORS.muted, marginTop: 2 },
  statRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderColor: REPORT_COLORS.border,
    borderRadius: 4,
    padding: 8,
  },
  statLabel: { fontSize: 7, color: REPORT_COLORS.muted, textTransform: "uppercase" },
  statValue: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 3 },
  statNote: { fontSize: 7, color: REPORT_COLORS.muted, marginTop: 2 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
    marginBottom: 8,
  },
  vehicleHeading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: REPORT_COLORS.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: REPORT_COLORS.border,
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: REPORT_COLORS.secondary,
  },
  /**
   * Cells are a box with the text inside rather than a sized `Text`. Padding on
   * a width-constrained `Text` did not inset it, so a right-aligned figure sat
   * flush against the next column and read as one value — "14.35Shell, MG Road".
   */
  cellBox: { paddingHorizontal: 3 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: REPORT_COLORS.border,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  cell: { fontSize: 8 },
  emptyNote: { fontSize: 8, color: REPORT_COLORS.muted, fontStyle: "italic", marginBottom: 12 },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  detail: { width: "25%", marginBottom: 6 },
  detailLabel: { fontSize: 7, color: REPORT_COLORS.muted },
  detailValue: { fontSize: 9 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: REPORT_COLORS.border,
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: REPORT_COLORS.muted },
});

type Column = {
  label: string;
  width: number;
  align?: "left" | "right";
};

function Table({
  columns,
  rows,
}: {
  columns: Column[];
  rows: Array<Array<string | null>>;
}) {
  if (rows.length === 0) {
    return <Text style={styles.emptyNote}>{ui.reports.pdf.noRowsInSection}</Text>;
  }

  return (
    <View style={{ marginBottom: 14 }}>
      {/* `fixed` repeats the header when a long service history spans pages. */}
      <View style={styles.tableHeader} fixed>
        {columns.map((column) => (
          <View key={column.label} style={[styles.cellBox, { width: `${column.width}%` }]}>
            <Text style={[styles.tableHeaderCell, { textAlign: column.align ?? "left" }]}>
              {toPdfText(column.label)}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow} wrap={false}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[styles.cellBox, { width: `${columns[cellIndex].width}%` }]}
            >
              <Text style={[styles.cell, { textAlign: columns[cellIndex].align ?? "left" }]}>
                {toPdfText(cell ?? ui.common.emptyValue)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{toPdfText(label)}</Text>
      <Text style={styles.statValue}>{toPdfText(value)}</Text>
      {note ? <Text style={styles.statNote}>{toPdfText(note)}</Text> : null}
    </View>
  );
}

function SummaryStats({ dataset }: { dataset: ReportDataset }) {
  const { summary, units } = dataset;
  const copy = ui.reports.summary;

  const distance =
    summary.distanceCovered == null
      ? ui.common.emptyValue
      : `${formatPdfNumber(summary.distanceCovered)} ${units.distanceUnit}`;

  // The label has to follow the figure. An EV reporting km/kWh under a heading
  // reading "Fuel efficiency" is simply wrong.
  const efficiency =
    summary.fuelEfficiency != null
      ? {
          label: copy.fuelEfficiency,
          value: `${formatPdfNumber(summary.fuelEfficiency, { maximumFractionDigits: 1 })} ${units.fuelEfficiencyUnit}`,
        }
      : summary.chargeEfficiency != null
        ? {
            label: copy.chargeEfficiency,
            value: `${formatPdfNumber(summary.chargeEfficiency, { maximumFractionDigits: 1 })} ${units.evEfficiencyUnit}`,
          }
        : { label: copy.fuelEfficiency, value: ui.common.emptyValue };

  return (
    <View style={styles.statRow}>
      <Stat
        label={copy.totalSpent}
        value={formatPdfMoney(summary.totalCost, units.currency)}
        note={copy.totalSpentNote}
      />
      <Stat label={copy.distanceCovered} value={distance} />
      <Stat
        label={copy.costPerDistance(units.distanceUnit)}
        value={
          summary.costPerDistance == null
            ? ui.common.emptyValue
            : formatPdfMoney(summary.costPerDistance, units.currency)
        }
      />
      {/*
        A garage-wide efficiency figure would average a hatchback against a
        scooter and describe neither, so it only appears when the report covers
        a single vehicle. Per-vehicle efficiency lives on each vehicle's cards.
      */}
      {dataset.vehicles.length === 1 ? (
        <Stat label={efficiency.label} value={efficiency.value} />
      ) : null}
    </View>
  );
}

/**
 * Type, powertrain, distance and efficiency — the four things worth knowing at
 * a glance. Registration, VIN, colour, engine and transmission stay in the
 * Excel and CSV exports, where a wide row costs nothing; on the page they were
 * eight fields of mostly-static text between the reader and the records.
 */
function VehicleCards({
  vehicle,
  dataset,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
}) {
  const { vehicleColumns, vehicleType, summary } = ui.reports;
  const { distanceUnit, fuelEfficiencyUnit, evEfficiencyUnit } = dataset.units;

  const efficiencyCards = [
    vehicle.fuelEfficiency != null
      ? {
          label: `${summary.fuelEfficiency} (${fuelEfficiencyUnit})`,
          value: formatPdfNumber(vehicle.fuelEfficiency, { maximumFractionDigits: 1 }),
        }
      : null,
    vehicle.chargeEfficiency != null
      ? {
          label: `${summary.chargeEfficiency} (${evEfficiencyUnit})`,
          value: formatPdfNumber(vehicle.chargeEfficiency, { maximumFractionDigits: 1 }),
        }
      : null,
    // A plug-in hybrid legitimately has both; anything with neither still gets
    // one card, so the row does not reflow between vehicles.
  ].filter((card): card is { label: string; value: string } => card != null);

  // An empty card still has to be labelled for the right kind of energy — an
  // electric scooter reading "Fuel efficiency" is wrong even with no figure.
  const emptyEfficiencyCard = {
    label: isElectricPowertrain(vehicle.powertrain)
      ? summary.chargeEfficiency
      : summary.fuelEfficiency,
    value: ui.common.emptyValue,
  };

  const cards = [
    { label: vehicleColumns.type, value: vehicleType[vehicle.vehicleType] },
    // Names the fuel where the owner has said, rather than the old
    // "Petrol / Diesel", which asserted a distinction nothing recorded.
    { label: vehicleColumns.powertrain, value: vehicle.energyDescription },
    {
      label: vehicleColumns.distanceCovered(distanceUnit),
      value:
        vehicle.distanceCovered == null
          ? ui.common.emptyValue
          : formatPdfNumber(vehicle.distanceCovered),
    },
    ...(efficiencyCards.length > 0 ? efficiencyCards : [emptyEfficiencyCard]),
  ];

  return (
    <View style={styles.statRow}>
      {cards.map((card) => (
        <Stat key={card.label} label={card.label} value={card.value} />
      ))}
    </View>
  );
}

function VehicleExtras({
  vehicle,
  dataset,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
}) {
  const { tyreColumns } = ui.reports;
  const { distanceUnit } = dataset.units;

  return (
    <View>
      {vehicle.tyres.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{ui.reports.pdf.sections.tyres}</Text>
          <Table
            columns={[
              { label: tyreColumns.position, width: 20 },
              { label: tyreColumns.brand, width: 25 },
              { label: tyreColumns.fitted, width: 20 },
              { label: tyreColumns.fittedOdometer(distanceUnit), width: 20, align: "right" },
              { label: tyreColumns.treadDepth, width: 15, align: "right" },
            ]}
            rows={vehicle.tyres.map((tyre) => [
              getTyrePositionLabel(tyre.position, vehicle.vehicleType),
              tyre.brand,
              tyre.installedDate == null ? null : formatTableDate(tyre.installedDate),
              tyre.installedOdometer == null ? null : formatPdfNumber(tyre.installedOdometer),
              tyre.treadDepth == null ? null : String(tyre.treadDepth),
            ])}
          />
        </View>
      ) : null}
    </View>
  );
}

/**
 * The energy table takes its shape from what the vehicle actually logs.
 *
 * A petrol car's table is headed "Fuel" and has no use for a record-type
 * column that says "Fuel" on every row; an EV's is headed "Charging" and drops
 * efficiency, which is measured between fill-ups and has no per-session
 * meaning for a charge. Only a plug-in hybrid needs both, and it is the only
 * one that gets the wider layout. The shape follows the rows rather than the
 * `powertrain` field, so a vehicle mis-typed in the garage still reads right.
 */
function EnergyTable({
  vehicle,
  dataset,
  rows,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
  rows: ReportEnergyRow[];
}) {
  const { columns, recordType, fillType, chargeSource, pdf } = ui.reports;
  const { units } = dataset;
  const currency = getPdfCurrencyLabel(units.currency);

  const hasFuel = rows.some((row) => row.energyType === "fuel");
  const hasCharge = rows.some((row) => row.energyType === "charge");
  const isElectric = isElectricPowertrain(vehicle.powertrain);

  // With no rows at all, the powertrain is the only thing left to name it by.
  const title =
    hasFuel && hasCharge
      ? pdf.sections.energy
      : hasCharge || (!hasFuel && isElectric)
        ? pdf.sections.charging
        : pdf.sections.fuel;

  const showRecordType = hasFuel && hasCharge;
  // Efficiency comes from the full-tank method, so it belongs to liquid fuel.
  const showEfficiency = hasFuel;

  const columnSpec: Column[] = [
    { label: columns.date, width: showRecordType ? 13 : 15 },
    ...(showRecordType ? [{ label: columns.recordType, width: 11 }] : []),
    { label: columns.detail, width: showRecordType ? 15 : 18 },
    { label: columns.odometer(units.distanceUnit), width: 15, align: "right" as const },
    { label: columns.quantity, width: 16, align: "right" as const },
    { label: columns.cost(currency), width: showEfficiency ? 16 : 21, align: "right" as const },
    ...(showEfficiency
      ? [
          {
            label: `${columns.efficiency} (${units.fuelEfficiencyUnit})`,
            width: showRecordType ? 14 : 15,
            align: "right" as const,
          },
        ]
      : []),
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Table
        columns={columnSpec}
        rows={rows.map((row) => {
          const isCharge = row.energyType === "charge";

          return [
            formatTableDate(row.date),
            ...(showRecordType ? [isCharge ? recordType.charge : recordType.fuel] : []),
            isCharge
              ? chargeSource[row.chargeSource ?? "other"]
              : fillType[row.fillType ?? "full"],
            formatPdfNumber(row.odometer),
            `${formatPdfNumber(row.quantity, { maximumFractionDigits: 2 })} ${isCharge ? "kWh" : units.volumeUnit}`,
            formatPdfMoney(row.cost, units.currency),
            ...(showEfficiency
              ? [
                  row.efficiency == null || isCharge
                    ? null
                    : formatPdfNumber(row.efficiency, { maximumFractionDigits: 1 }),
                ]
              : []),
          ];
        })}
      />
    </View>
  );
}

function VehicleSection({
  vehicle,
  dataset,
  index,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
  index: number;
}) {
  const { columns, snapshotSource, pdf } = ui.reports;
  const { units } = dataset;
  const currency = units.currency;

  const energyRows = dataset.energyRows.filter((row) => row.vehicleId === vehicle.id);
  const maintenanceRows = dataset.maintenanceRows.filter(
    (row) => row.vehicleId === vehicle.id,
  );
  const snapshotRows = dataset.snapshotRows.filter((row) => row.vehicleId === vehicle.id);

  // Each vehicle gets a clean page, but the first follows the charts rather
  // than leaving half a page of nothing behind it.
  return (
    <View break={index > 0}>
      <Text style={styles.vehicleHeading}>{toPdfText(vehicle.label)}</Text>
      {vehicle.nickname ? (
        <Text style={styles.meta}>
          {toPdfText(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)}
        </Text>
      ) : null}

      <VehicleCards vehicle={vehicle} dataset={dataset} />

      {dataset.sections.includes("vehicle-profile") ? (
        <VehicleExtras vehicle={vehicle} dataset={dataset} />
      ) : null}

      {dataset.sections.includes("energy") ? (
        <EnergyTable vehicle={vehicle} dataset={dataset} rows={energyRows} />
      ) : null}

      {dataset.sections.includes("maintenance") ? (
        <View>
          <Text style={styles.sectionTitle}>{pdf.sections.maintenance}</Text>
          <Table
            columns={[
              { label: columns.date, width: 13 },
              { label: columns.detail, width: 28 },
              { label: columns.odometer(units.distanceUnit), width: 14, align: "right" },
              { label: columns.cost(getPdfCurrencyLabel(currency)), width: 15, align: "right" },
              { label: columns.notes, width: 30 },
            ]}
            rows={maintenanceRows.map((row) => [
              formatTableDate(row.date),
              row.serviceType,
              row.odometer == null ? null : formatPdfNumber(row.odometer),
              formatPdfMoney(row.cost, currency),
              row.notes,
            ])}
          />
        </View>
      ) : null}

      {/*
        Check-ins only — this is not the odometer history, and calling it that
        made an EV's report look like it had lost data, since a charge session
        carries an odometer reading but never becomes a check-in. Every reading
        the app holds is already on the rows above.
      */}
      {dataset.sections.includes("vehicle-profile") && snapshotRows.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{pdf.sections.snapshots}</Text>
          <Text style={styles.emptyNote}>{pdf.sections.snapshotsCaption}</Text>
          <Table
            columns={[
              { label: columns.date, width: 16 },
              { label: columns.odometer(units.distanceUnit), width: 18, align: "right" },
              { label: columns.batteryPercent, width: 16, align: "right" },
              { label: columns.source, width: 22 },
              { label: columns.notes, width: 28 },
            ]}
            rows={snapshotRows.map((row) => [
              formatTableDate(row.date),
              formatPdfNumber(row.odometer),
              row.socPercent == null ? null : `${formatPdfNumber(row.socPercent)}%`,
              snapshotSource[row.source],
              row.notes,
            ])}
          />
        </View>
      ) : null}
    </View>
  );
}

export function ReportDocument({ dataset }: { dataset: ReportDataset }) {
  const { pdf } = ui.reports;
  const generated = formatTableDate(dataset.generatedAt);

  return (
    <Document title={pdf.documentTitle(dataset.title)} author="Veloce Digital Garage">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{toPdfText(dataset.title)}</Text>
          <Text style={styles.subtitle}>{toPdfText(dataset.rangeLabel)}</Text>
          <Text style={styles.meta}>
            {toPdfText(
              `${formatTableDate(dataset.range.from)} to ${formatTableDate(dataset.range.to)} · ${ui.reports.summary.generated(generated)}`,
            )}
          </Text>
        </View>

        {dataset.isEmpty ? (
          <View>
            <Text style={styles.sectionTitle}>{pdf.emptyTitle}</Text>
            <Text style={styles.emptyNote}>{pdf.emptyDescription}</Text>
          </View>
        ) : (
          <View>
            <SummaryStats dataset={dataset} />
            <MonthlySpendChart charts={dataset.charts} units={dataset.units} />
            <CostMixChart charts={dataset.charts} units={dataset.units} />
            {/*
              The spend split is the multi-vehicle stand-in for the efficiency
              line, not a general fallback: on a single-vehicle report it is one
              slice at 100%, which says nothing. A lone vehicle with no
              measurable efficiency simply gets no third chart.
            */}
            {dataset.charts.efficiency ? (
              <EfficiencyChart series={dataset.charts.efficiency} />
            ) : dataset.vehicles.length > 1 ? (
              <VehicleSpendChart
                slices={dataset.charts.spendByVehicle}
                units={dataset.units}
              />
            ) : null}

            {dataset.vehicles.map((vehicle, index) => (
              <VehicleSection
                key={vehicle.id}
                vehicle={vehicle}
                dataset={dataset}
                index={index}
              />
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{pdf.footer}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => pdf.page(pageNumber, totalPages)}
          />
        </View>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(dataset: ReportDataset): Promise<Buffer> {
  return renderToBuffer(<ReportDocument dataset={dataset} />);
}
