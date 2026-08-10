import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

import { ui } from "@/content/en/ui";
import { formatTableDate } from "@/utils/formatting";
import type {
  ReportDataset,
  ReportVehicleProfile,
} from "@/utils/reports/report-dataset";
import {
  formatPdfMoney,
  formatPdfNumber,
  getPdfCurrencyLabel,
} from "@/utils/reports/report-format";
import {
  CostMixChart,
  EfficiencyChart,
  MonthlySpendChart,
} from "@/components/reports/report-charts-pdf";
import { REPORT_COLORS } from "@/components/reports/report-theme";

/**
 * The PDF report.
 *
 * Built with `@react-pdf/renderer` on the server. It reads the same
 * `ReportDataset` the CSV and Excel writers read, so the total on the cover
 * cannot disagree with the total in the tables.
 */

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
              {column.label}
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
                {cell ?? ui.common.emptyValue}
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
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {note ? <Text style={styles.statNote}>{note}</Text> : null}
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value ?? ui.common.emptyValue}</Text>
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

  const efficiency =
    summary.fuelEfficiency != null
      ? `${formatPdfNumber(summary.fuelEfficiency, { maximumFractionDigits: 1 })} ${units.fuelEfficiencyUnit}`
      : summary.chargeEfficiency != null
        ? `${formatPdfNumber(summary.chargeEfficiency, { maximumFractionDigits: 1 })} ${units.evEfficiencyUnit}`
        : ui.common.emptyValue;

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
      <Stat label={copy.fuelEfficiency} value={efficiency} />
    </View>
  );
}

function VehicleDetails({
  vehicle,
  dataset,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
}) {
  const { vehicleColumns, vehicleType, powertrain, tyreColumns, tyrePosition } = ui.reports;
  const { distanceUnit } = dataset.units;

  return (
    <View>
      <View style={styles.detailGrid}>
        <Detail label={vehicleColumns.registration} value={vehicle.licensePlate} />
        <Detail label={vehicleColumns.vin} value={vehicle.vin} />
        <Detail label={vehicleColumns.type} value={vehicleType[vehicle.vehicleType]} />
        <Detail label={vehicleColumns.powertrain} value={powertrain[vehicle.powertrain]} />
        <Detail label={vehicleColumns.color} value={vehicle.color} />
        <Detail label={vehicleColumns.engine} value={vehicle.engineType} />
        <Detail label={vehicleColumns.transmission} value={vehicle.transmission} />
        <Detail
          label={vehicleColumns.distanceCovered(distanceUnit)}
          value={
            vehicle.distanceCovered == null
              ? null
              : formatPdfNumber(vehicle.distanceCovered)
          }
        />
      </View>

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
              tyrePosition[tyre.position],
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

function VehicleSection({
  vehicle,
  dataset,
  index,
}: {
  vehicle: ReportVehicleProfile;
  dataset: ReportDataset;
  index: number;
}) {
  const { columns, recordType, fillType, chargeSource, snapshotSource, pdf } = ui.reports;
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
      <Text style={styles.vehicleHeading}>{vehicle.label}</Text>
      {vehicle.nickname ? (
        <Text style={styles.meta}>
          {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        </Text>
      ) : null}

      {dataset.sections.includes("vehicle-profile") ? (
        <View>
          <Text style={styles.sectionTitle}>{pdf.sections.vehicle}</Text>
          <VehicleDetails vehicle={vehicle} dataset={dataset} />
        </View>
      ) : null}

      {dataset.sections.includes("energy") ? (
        <View>
          <Text style={styles.sectionTitle}>{pdf.sections.energy}</Text>
          <Table
            columns={[
              { label: columns.date, width: 12 },
              { label: columns.recordType, width: 10 },
              { label: columns.detail, width: 14 },
              { label: columns.odometer(units.distanceUnit), width: 12, align: "right" },
              { label: columns.quantity, width: 11, align: "right" },
              { label: columns.cost(getPdfCurrencyLabel(currency)), width: 15, align: "right" },
              { label: columns.efficiency, width: 12, align: "right" },
              { label: columns.location, width: 14 },
            ]}
            rows={energyRows.map((row) => {
              const isCharge = row.energyType === "charge";

              return [
                formatTableDate(row.date),
                isCharge ? recordType.charge : recordType.fuel,
                isCharge
                  ? chargeSource[row.chargeSource ?? "other"]
                  : fillType[row.fillType ?? "full"],
                formatPdfNumber(row.odometer),
                `${formatPdfNumber(row.quantity, { maximumFractionDigits: 2 })} ${isCharge ? "kWh" : units.volumeUnit}`,
                formatPdfMoney(row.cost, currency),
                row.efficiency == null
                  ? null
                  : formatPdfNumber(row.efficiency, { maximumFractionDigits: 1 }),
                row.location ?? row.chargerNetwork,
              ];
            })}
          />
        </View>
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

      {dataset.sections.includes("vehicle-profile") && snapshotRows.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>{pdf.sections.snapshots}</Text>
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
          <Text style={styles.title}>{dataset.title}</Text>
          <Text style={styles.subtitle}>{dataset.rangeLabel}</Text>
          <Text style={styles.meta}>
            {`${formatTableDate(dataset.range.from)} — ${formatTableDate(dataset.range.to)} · ${ui.reports.summary.generated(generated)}`}
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
            {dataset.charts.efficiency ? (
              <EfficiencyChart series={dataset.charts.efficiency} />
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
