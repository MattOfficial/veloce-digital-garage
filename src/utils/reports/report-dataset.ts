import { eachMonthOfInterval, format, parseISO } from "date-fns";

import type {
  ChargeSource,
  FuelLog,
  FuelType,
  FuelLogEnergyType,
  FuelLogFillType,
  Powertrain,
  VehicleType,
  VehicleSnapshotSource,
  VehicleWithLogs,
} from "@/types/database";
import { isFullChargeSession } from "@/utils/charge-session";
import { getVehicleEnergySummary } from "@/utils/vehicle-energy";
import {
  convertEvEfficiency,
  convertFuelEfficiency,
  type EvEfficiencyUnit,
  type FuelEfficiencyUnit,
  type FuelVolumeUnit,
} from "@/utils/efficiency-units";
import { buildChargeSegments } from "@/utils/ev-energy-analytics";
import { buildFuelAnalytics } from "@/utils/fuel-analytics";
import {
  getEarliestDate,
  isDateInRange,
  toIsoDate,
  type ReportRange,
} from "@/utils/reports/report-range";

/**
 * The single derivation behind every exported report.
 *
 * CSV, Excel and PDF all walk this one structure rather than each reading the
 * vehicle graph themselves, because three independent readings of "total spent"
 * is three chances to disagree. The invariant that makes that work: **every
 * cost figure is derived from the rows this dataset emits**, never from the
 * source logs directly. A report therefore always totals exactly what it shows,
 * including when a section is switched off.
 *
 * Distance is the deliberate exception. It comes from every odometer reading in
 * the window, including ones on records the report does not list, because how
 * far the vehicle went is a fact about the window rather than about the sections
 * the owner happened to tick.
 */

export const REPORT_SCOPES = ["vehicle", "garage"] as const;
export type ReportScope = (typeof REPORT_SCOPES)[number];

export const REPORT_SECTIONS = ["energy", "maintenance", "vehicle-profile"] as const;
export type ReportSection = (typeof REPORT_SECTIONS)[number];

export function isReportScope(value: string): value is ReportScope {
  return REPORT_SCOPES.some((scope) => scope === value);
}

export function isReportSection(value: string): value is ReportSection {
  return REPORT_SECTIONS.some((section) => section === value);
}

export type ReportDistanceUnit = "km" | "miles";

export type ReportUnits = {
  currency: string;
  distanceUnit: ReportDistanceUnit;
  /** What `fuel_volume` is stored in for liquid rows. */
  volumeUnit: FuelVolumeUnit;
  fuelEfficiencyUnit: FuelEfficiencyUnit;
  evEfficiencyUnit: EvEfficiencyUnit;
};

export type ReportOptions = {
  scope: ReportScope;
  range: ReportRange;
  /** Display label for the window. Copy lives in `ui.ts`, not here. */
  rangeLabel: string;
  /** Report heading — the vehicle's name, or the garage's. */
  title: string;
  sections: readonly ReportSection[];
  units: ReportUnits;
  generatedAt?: Date;
};

export type ReportEnergyRow = {
  vehicleId: string;
  vehicleLabel: string;
  date: string;
  energyType: FuelLogEnergyType;
  /** ICE only; charge rows carry null. */
  fillType: FuelLogFillType | null;
  chargeSource: ChargeSource | null;
  odometer: number;
  /** In `units.volumeUnit` for fuel rows, kWh for charge rows. */
  quantity: number;
  unitPrice: number | null;
  cost: number;
  /** Set only on rows that close an efficiency segment, in the owner's unit. */
  efficiency: number | null;
  location: string | null;
  chargerNetwork: string | null;
  isEstimated: boolean;
};

export type ReportMaintenanceRow = {
  vehicleId: string;
  vehicleLabel: string;
  date: string;
  serviceType: string;
  odometer: number | null;
  cost: number;
  notes: string | null;
};

/**
 * Where a state reading came from. `charge` is derived rather than stored: a
 * charge session records an odometer and the percentage the owner stopped at,
 * which is the same reading a check-in captures.
 */
export type ReportSnapshotSource = VehicleSnapshotSource | "charge";

export type ReportSnapshotRow = {
  vehicleId: string;
  vehicleLabel: string;
  date: string;
  odometer: number;
  socPercent: number | null;
  displayedRange: number | null;
  source: ReportSnapshotSource;
  notes: string | null;
};

export type ReportTyre = {
  position: "all" | "front_left" | "front_right" | "rear_left" | "rear_right";
  brand: string | null;
  installedDate: string | null;
  installedOdometer: number | null;
  treadDepth: number | null;
  dotCode: string | null;
};

export type ReportVehicleProfile = {
  id: string;
  label: string;
  make: string;
  model: string;
  year: number;
  nickname: string | null;
  vin: string | null;
  licensePlate: string | null;
  color: string | null;
  vehicleType: VehicleType;
  powertrain: Powertrain;
  fuelType: FuelType | null;
  /** What to call the way this vehicle is powered: "Diesel", "EV", "PHEV · Petrol". */
  energyDescription: string;
  engineType: string | null;
  transmission: string | null;
  batteryCapacityKwh: number | null;
  usableBatteryKwh: number | null;
  /** Lowest and highest odometer reading recorded inside the window. */
  odometerStart: number | null;
  odometerEnd: number | null;
  distanceCovered: number | null;
  tyres: ReportTyre[];
  /**
   * This vehicle's own figures. A garage report cannot show one efficiency
   * across a hatchback and a scooter, so the per-vehicle number is the only
   * one that means anything once more than one vehicle is in scope.
   */
  totalCost: number;
  fuelEfficiency: number | null;
  chargeEfficiency: number | null;
};

export type ReportSummary = {
  fuelCost: number;
  chargeCost: number;
  energyCost: number;
  maintenanceCost: number;
  /** Only what this report contains — see the module note on the invariant. */
  totalCost: number;
  fuelVolume: number;
  chargeEnergyKwh: number;
  distanceCovered: number | null;
  costPerDistance: number | null;
  fuelEfficiency: number | null;
  chargeEfficiency: number | null;
  counts: {
    vehicles: number;
    fuelLogs: number;
    chargeLogs: number;
    maintenanceLogs: number;
    snapshots: number;
  };
};

export type ReportMonthlySpendPoint = {
  key: string;
  label: string;
  fuel: number;
  charge: number;
  maintenance: number;
  total: number;
};

export type ReportCostMixSlice = {
  key: "fuel" | "charge" | "maintenance";
  value: number;
};

export type ReportEfficiencyPoint = {
  date: string;
  value: number;
  vehicleId: string;
  vehicleLabel: string;
};

export type ReportEfficiencySeries = {
  mode: FuelLogEnergyType;
  unit: string;
  points: ReportEfficiencyPoint[];
};

export type ReportVehicleSpendSlice = {
  vehicleId: string;
  label: string;
  value: number;
};

export type ReportCharts = {
  monthlySpend: ReportMonthlySpendPoint[];
  /** Zero-valued slices are dropped rather than drawn as invisible wedges. */
  costMix: ReportCostMixSlice[];
  /**
   * Only meaningful once the report covers more than one vehicle, which is
   * exactly when the efficiency line stops being meaningful — a garage cannot
   * put km/L and km/kWh on one axis, but it can always compare spend.
   */
  spendByVehicle: ReportVehicleSpendSlice[];
  efficiency: ReportEfficiencySeries | null;
};

export type ReportDataset = {
  title: string;
  scope: ReportScope;
  range: ReportRange;
  rangeLabel: string;
  units: ReportUnits;
  generatedAt: string;
  sections: ReportSection[];
  vehicles: ReportVehicleProfile[];
  energyRows: ReportEnergyRow[];
  maintenanceRows: ReportMaintenanceRow[];
  snapshotRows: ReportSnapshotRow[];
  summary: ReportSummary;
  charts: ReportCharts;
  isEmpty: boolean;
};

/** Matches how the copilot names vehicles, so exports read like the app. */
export function getReportVehicleLabel(vehicle: {
  nickname: string | null;
  year: number;
  make: string;
  model: string;
}): string {
  return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

function finite(value: number | null | undefined): number {
  return value != null && Number.isFinite(value) ? value : 0;
}

function finiteOrNull(value: number | null | undefined): number | null {
  return value != null && Number.isFinite(value) ? value : null;
}

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Earliest record date anywhere in the selection, for resolving `all-time`. */
export function getEarliestRecordDate(vehicles: VehicleWithLogs[]): string | null {
  return getEarliestDate(
    vehicles.flatMap((vehicle) => [
      ...(vehicle.fuel_logs ?? []).map((log) => log.date),
      ...(vehicle.maintenance_logs ?? []).map((log) => log.date),
      ...(vehicle.vehicle_snapshots ?? []).map((snapshot) => snapshot.date),
      ...(vehicle.custom_logs ?? []).map((log) => log.date),
    ]),
  );
}

type SegmentEfficiency = {
  /** Efficiency already converted into the owner's display unit. */
  value: number;
  distance: number;
  quantity: number;
  mode: FuelLogEnergyType;
  vehicleId: string;
};

/**
 * Efficiency per closing log, for both energy modes.
 *
 * Segments are built over the vehicle's whole history and only then filtered by
 * closing date. Building them from the windowed logs alone would silently
 * restate every segment that straddles the window's start, because the
 * preceding fill — the one that sets the segment's odometer baseline — would be
 * missing.
 */
function buildEfficiencyByLogId(
  vehicle: VehicleWithLogs,
  units: ReportUnits,
): Map<string, SegmentEfficiency> {
  const byLogId = new Map<string, SegmentEfficiency>();

  const fuelStream = buildFuelAnalytics(
    vehicle.fuel_logs ?? [],
    vehicle.baseline_odometer,
  ).fuel;

  for (const segment of fuelStream.closed_segments) {
    const value = convertFuelEfficiency(
      segment.distance,
      segment.volume,
      units.fuelEfficiencyUnit,
      units.distanceUnit,
      units.volumeUnit,
    );
    if (value == null) continue;

    byLogId.set(segment.closing_log_id, {
      value,
      distance: segment.distance,
      quantity: segment.volume,
      mode: "fuel",
      vehicleId: vehicle.id,
    });
  }

  for (const segment of buildChargeSegments(vehicle.fuel_logs ?? [])) {
    if (!segment.usable) continue;

    const value = convertEvEfficiency(
      segment.distance,
      segment.energyKwh,
      units.evEfficiencyUnit,
      units.distanceUnit,
    );
    if (value == null) continue;

    byLogId.set(segment.endLogId, {
      value,
      distance: segment.distance,
      quantity: segment.energyKwh,
      mode: "charge",
      vehicleId: vehicle.id,
    });
  }

  return byLogId;
}

function buildEnergyRows(
  vehicles: VehicleWithLogs[],
  range: ReportRange,
  units: ReportUnits,
): { rows: ReportEnergyRow[]; efficiencyByRow: Map<string, SegmentEfficiency> } {
  const rows: ReportEnergyRow[] = [];
  const efficiencyByRow = new Map<string, SegmentEfficiency>();

  for (const vehicle of vehicles) {
    const label = getReportVehicleLabel(vehicle);
    const efficiencyByLogId = buildEfficiencyByLogId(vehicle, units);

    for (const log of vehicle.fuel_logs ?? []) {
      const date = toIsoDate(log.date);
      if (date == null || !isDateInRange(date, range)) continue;

      const quantity = finite(log.fuel_volume);
      const cost = finite(log.total_cost);
      const segment = efficiencyByLogId.get(log.id) ?? null;

      if (segment != null) {
        efficiencyByRow.set(log.id, segment);
      }

      rows.push({
        vehicleId: vehicle.id,
        vehicleLabel: label,
        date,
        energyType: log.energy_type === "charge" ? "charge" : "fuel",
        fillType: log.energy_type === "charge" ? null : (log.fill_type ?? "full"),
        chargeSource: log.energy_type === "charge" ? (log.charge_source ?? "other") : null,
        odometer: finite(log.odometer),
        quantity,
        unitPrice: quantity > 0 ? cost / quantity : null,
        cost,
        efficiency: segment?.value ?? null,
        location: nonEmpty(log.location),
        chargerNetwork: nonEmpty(log.charger_network),
        isEstimated: log.is_estimated === true,
      });
    }
  }

  return { rows: sortRows(rows), efficiencyByRow };
}

function buildMaintenanceRows(
  vehicles: VehicleWithLogs[],
  range: ReportRange,
): ReportMaintenanceRow[] {
  const rows: ReportMaintenanceRow[] = [];

  for (const vehicle of vehicles) {
    const label = getReportVehicleLabel(vehicle);

    for (const log of vehicle.maintenance_logs ?? []) {
      const date = toIsoDate(log.date);
      if (date == null || !isDateInRange(date, range)) continue;

      rows.push({
        vehicleId: vehicle.id,
        vehicleLabel: label,
        date,
        serviceType: log.service_type,
        odometer: finiteOrNull(log.odometer),
        cost: finite(log.cost),
        notes: nonEmpty(log.notes),
      });
    }
  }

  return sortRows(rows);
}

function buildSnapshotRows(
  vehicles: VehicleWithLogs[],
  range: ReportRange,
): ReportSnapshotRow[] {
  const rows: ReportSnapshotRow[] = [];

  for (const vehicle of vehicles) {
    const label = getReportVehicleLabel(vehicle);

    for (const snapshot of vehicle.vehicle_snapshots ?? []) {
      const date = toIsoDate(snapshot.date);
      if (date == null || !isDateInRange(date, range)) continue;

      rows.push({
        vehicleId: vehicle.id,
        vehicleLabel: label,
        date,
        odometer: finite(snapshot.odometer),
        socPercent: finiteOrNull(snapshot.soc_percent),
        displayedRange: finiteOrNull(snapshot.displayed_range),
        source: snapshot.source,
        notes: nonEmpty(snapshot.notes),
      });
    }

    for (const log of vehicle.fuel_logs ?? []) {
      const reading = toChargeStateReading(log);
      if (reading == null || !isDateInRange(reading.date, range)) continue;

      rows.push({
        vehicleId: vehicle.id,
        vehicleLabel: label,
        ...reading,
      });
    }
  }

  return sortRows(rows);
}

/**
 * The state reading a charge session already contains.
 *
 * Every session records an odometer, and the owner enters the percentage they
 * stopped charging at — together that is exactly what a check-in captures.
 * Without this the section listed only hand-entered rows, so an owner who logs
 * charges saw a table missing the odometer readings sitting one table above it.
 *
 * A session logged as charged-to-full without a percentage still pins the state
 * at 100, since that is what "full" means.
 */
function toChargeStateReading(
  log: FuelLog,
): Omit<ReportSnapshotRow, "vehicleId" | "vehicleLabel"> | null {
  if (log.energy_type !== "charge" || log.is_estimated) return null;

  const date = toIsoDate(log.date);
  const odometer = finiteOrNull(log.odometer);
  if (date == null || odometer == null) return null;

  const socPercent = finiteOrNull(log.end_soc) ?? (isFullChargeSession(log) ? 100 : null);

  return {
    date,
    odometer,
    socPercent,
    displayedRange: finiteOrNull(log.estimated_range),
    source: "charge",
    notes: null,
  };
}

function sortRows<T extends { date: string; vehicleLabel: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (left, right) =>
      left.date.localeCompare(right.date) ||
      left.vehicleLabel.localeCompare(right.vehicleLabel),
  );
}

const TYRE_POSITIONS = [
  "front_left",
  "front_right",
  "rear_left",
  "rear_right",
] as const;

function buildTyres(vehicle: VehicleWithLogs): ReportTyre[] {
  const info = vehicle.tyre_info;
  if (info == null) return [];

  const perCorner = TYRE_POSITIONS.flatMap<ReportTyre>((position) => {
    const tyre = info[position];
    if (tyre == null) return [];

    return [
      {
        position,
        brand: nonEmpty(tyre.brand),
        installedDate: toIsoDate(tyre.installed_date),
        installedOdometer: finiteOrNull(tyre.installed_odo),
        treadDepth: finiteOrNull(tyre.tread_depth),
        dotCode: nonEmpty(tyre.dot_code),
      },
    ];
  });

  if (perCorner.length > 0) return perCorner;

  // The older shape recorded one set for the whole vehicle.
  const hasSetLevel =
    info.brand != null || info.installed_date != null || info.installed_odo != null;

  return hasSetLevel
    ? [
        {
          position: "all",
          brand: nonEmpty(info.brand),
          installedDate: toIsoDate(info.installed_date),
          installedOdometer: finiteOrNull(info.installed_odo),
          treadDepth: finiteOrNull(info.tread_depth),
          dotCode: nonEmpty(info.dot_code),
        },
      ]
    : [];
}

/**
 * Distance is measured strictly inside the window: the lowest and highest
 * readings recorded in it. Reaching back to the last reading before the window
 * would fold driving that happened earlier into the total, which is the
 * difference between a report and a guess. The cost is that a window holding
 * fewer than two readings reports no distance at all, which is the honest answer.
 *
 * The vehicle's own starting odometer counts as one of those readings, dated to
 * when tracking began. So a window covering a vehicle's whole life measures
 * from zero and agrees with the lifetime figure the rest of the app shows; a
 * narrower window measures only what happened inside it, and will legitimately
 * read lower than the app's lifetime number.
 */
function buildVehicleProfile(
  vehicle: VehicleWithLogs,
  range: ReportRange,
  units: ReportUnits,
  energyRows: ReportEnergyRow[],
  maintenanceRows: ReportMaintenanceRow[],
  efficiencyByRow: Map<string, SegmentEfficiency>,
): ReportVehicleProfile {
  const readings = [
    // The vehicle's starting odometer is a reading like any other, dated when
    // tracking began. Leaving it out cost a new vehicle every kilometre before
    // its first logged fill or charge: a scooter at 159 km whose first charge
    // was logged at 46 reported 113 km, and then divided its whole energy bill
    // by that short distance.
    { date: vehicle.created_at, odometer: vehicle.baseline_odometer },
    ...(vehicle.fuel_logs ?? []).map((log) => ({ date: log.date, odometer: log.odometer })),
    ...(vehicle.maintenance_logs ?? []).map((log) => ({
      date: log.date,
      odometer: log.odometer,
    })),
    ...(vehicle.vehicle_snapshots ?? []).map((snapshot) => ({
      date: snapshot.date,
      odometer: snapshot.odometer,
    })),
  ]
    .filter((reading) => isDateInRange(reading.date, range))
    .map((reading) => finiteOrNull(reading.odometer))
    // A brand-new vehicle starts at zero, so the floor is zero, not one.
    .filter((odometer): odometer is number => odometer != null && odometer >= 0);

  const odometerStart = readings.length > 0 ? Math.min(...readings) : null;
  const odometerEnd = readings.length > 0 ? Math.max(...readings) : null;

  const ownSegments = new Map(
    [...efficiencyByRow].filter(([, segment]) => segment.vehicleId === vehicle.id),
  );
  const ownEnergyRows = energyRows.filter((row) => row.vehicleId === vehicle.id);
  const ownCost =
    sum(ownEnergyRows.map((row) => row.cost)) +
    sum(
      maintenanceRows.filter((row) => row.vehicleId === vehicle.id).map((row) => row.cost),
    );
  const ownChargeKwh = sum(
    ownEnergyRows.filter((row) => row.energyType === "charge").map((row) => row.quantity),
  );

  const distanceCovered =
    readings.length >= 2 && odometerEnd != null && odometerStart != null
      ? odometerEnd - odometerStart
      : null;

  return {
    id: vehicle.id,
    label: getReportVehicleLabel(vehicle),
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    nickname: nonEmpty(vehicle.nickname),
    vin: nonEmpty(vehicle.vin),
    licensePlate: nonEmpty(vehicle.license_plate),
    color: nonEmpty(vehicle.color),
    vehicleType: vehicle.vehicle_type,
    powertrain: vehicle.powertrain,
    fuelType: vehicle.fuel_type,
    energyDescription: getVehicleEnergySummary(vehicle).description,
    engineType: nonEmpty(vehicle.engine_type),
    transmission: nonEmpty(vehicle.transmission),
    batteryCapacityKwh: finiteOrNull(vehicle.battery_capacity_kwh),
    usableBatteryKwh: finiteOrNull(vehicle.usable_battery_kwh),
    odometerStart,
    odometerEnd,
    distanceCovered,
    tyres: buildTyres(vehicle),
    totalCost: ownCost,
    fuelEfficiency: averageEfficiency("fuel", ownSegments, units),
    chargeEfficiency:
      averageEfficiency("charge", ownSegments, units) ??
      wholePeriodChargeEfficiency(distanceCovered, ownChargeKwh, units),
  };
}

function buildSummary(
  vehicles: ReportVehicleProfile[],
  energyRows: ReportEnergyRow[],
  maintenanceRows: ReportMaintenanceRow[],
  snapshotRows: ReportSnapshotRow[],
  efficiencyByRow: Map<string, SegmentEfficiency>,
  units: ReportUnits,
): ReportSummary {
  const fuelRows = energyRows.filter((row) => row.energyType === "fuel");
  const chargeRows = energyRows.filter((row) => row.energyType === "charge");

  const fuelCost = sum(fuelRows.map((row) => row.cost));
  const chargeCost = sum(chargeRows.map((row) => row.cost));
  const maintenanceCost = sum(maintenanceRows.map((row) => row.cost));
  const energyCost = fuelCost + chargeCost;

  const distances = vehicles
    .map((vehicle) => vehicle.distanceCovered)
    .filter((distance): distance is number => distance != null);
  const distanceCovered = distances.length > 0 ? sum(distances) : null;
  const totalCost = energyCost + maintenanceCost;

  return {
    fuelCost,
    chargeCost,
    energyCost,
    maintenanceCost,
    totalCost,
    fuelVolume: sum(fuelRows.map((row) => row.quantity)),
    chargeEnergyKwh: sum(chargeRows.map((row) => row.quantity)),
    distanceCovered,
    costPerDistance:
      distanceCovered != null && distanceCovered > 0 ? totalCost / distanceCovered : null,
    fuelEfficiency: averageEfficiency("fuel", efficiencyByRow, units),
    chargeEfficiency:
      averageEfficiency("charge", efficiencyByRow, units) ??
      wholePeriodChargeEfficiency(
        distanceCovered,
        sum(chargeRows.map((row) => row.quantity)),
        units,
      ),
    counts: {
      vehicles: vehicles.length,
      fuelLogs: fuelRows.length,
      chargeLogs: chargeRows.length,
      maintenanceLogs: maintenanceRows.length,
      snapshots: snapshotRows.length,
    },
  };
}

/**
 * Distance over energy bought across the whole window — the same fallback the
 * app's own EV efficiency display uses when no segment can be measured.
 *
 * Segments need a state of charge at both ends of a stretch of riding, and an
 * owner who logs top-ups without percentages never produces one. That left the
 * efficiency card empty on a vehicle whose distance and kWh were both sitting
 * right there. It is a coarser figure — energy still in the battery counts
 * against distance not yet ridden — but it is the number the rest of the app
 * shows, and a coarse figure beats a dash.
 */
function wholePeriodChargeEfficiency(
  distance: number | null,
  energyKwh: number,
  units: ReportUnits,
): number | null {
  if (distance == null || distance <= 0 || energyKwh <= 0) return null;

  return convertEvEfficiency(distance, energyKwh, units.evEfficiencyUnit, units.distanceUnit);
}

/**
 * Distance-weighted rather than a mean of the per-segment figures: a 600 km
 * segment says more about the vehicle's economy than a 40 km one, and averaging
 * the ratios would weight them equally.
 */
function averageEfficiency(
  mode: FuelLogEnergyType,
  efficiencyByRow: Map<string, SegmentEfficiency>,
  units: ReportUnits,
): number | null {
  let totalDistance = 0;
  let totalQuantity = 0;

  for (const segment of efficiencyByRow.values()) {
    if (segment.mode !== mode) continue;
    totalDistance += segment.distance;
    totalQuantity += segment.quantity;
  }

  if (totalDistance <= 0 || totalQuantity <= 0) return null;

  return mode === "fuel"
    ? convertFuelEfficiency(
        totalDistance,
        totalQuantity,
        units.fuelEfficiencyUnit,
        units.distanceUnit,
        units.volumeUnit,
      )
    : convertEvEfficiency(
        totalDistance,
        totalQuantity,
        units.evEfficiencyUnit,
        units.distanceUnit,
      );
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function buildMonthlySpend(
  range: ReportRange,
  energyRows: ReportEnergyRow[],
  maintenanceRows: ReportMaintenanceRow[],
): ReportMonthlySpendPoint[] {
  const start = parseISO(range.from);
  const end = parseISO(range.to);
  if (start > end) return [];

  const months = eachMonthOfInterval({ start, end });
  // "Mar" twice over means nothing on a multi-year window.
  const spansYears = start.getFullYear() !== end.getFullYear();

  const points = months.map<ReportMonthlySpendPoint>((month) => ({
    key: format(month, "yyyy-MM"),
    label: format(month, spansYears ? "MMM yy" : "MMM"),
    fuel: 0,
    charge: 0,
    maintenance: 0,
    total: 0,
  }));
  const byKey = new Map(points.map((point) => [point.key, point]));

  for (const row of energyRows) {
    const point = byKey.get(row.date.slice(0, 7));
    if (point == null) continue;
    point[row.energyType] += row.cost;
    point.total += row.cost;
  }

  for (const row of maintenanceRows) {
    const point = byKey.get(row.date.slice(0, 7));
    if (point == null) continue;
    point.maintenance += row.cost;
    point.total += row.cost;
  }

  return points;
}

/**
 * Single-vehicle reports only — see the call site. A plug-in hybrid can still
 * produce both kinds of segment, and km/L and km/kWh share no axis, so the mode
 * with more measured segments wins.
 */
function buildEfficiencySeries(
  energyRows: ReportEnergyRow[],
  units: ReportUnits,
): ReportEfficiencySeries | null {
  const withEfficiency = energyRows.filter(
    (row): row is ReportEnergyRow & { efficiency: number } => row.efficiency != null,
  );
  if (withEfficiency.length === 0) return null;

  const fuelPoints = withEfficiency.filter((row) => row.energyType === "fuel");
  const chargePoints = withEfficiency.filter((row) => row.energyType === "charge");

  const mode: FuelLogEnergyType =
    fuelPoints.length >= chargePoints.length ? "fuel" : "charge";
  const selected = mode === "fuel" ? fuelPoints : chargePoints;

  return {
    mode,
    unit: mode === "fuel" ? units.fuelEfficiencyUnit : units.evEfficiencyUnit,
    points: selected.map((row) => ({
      date: row.date,
      value: row.efficiency,
      vehicleId: row.vehicleId,
      vehicleLabel: row.vehicleLabel,
    })),
  };
}

export function buildReportDataset(
  vehicles: VehicleWithLogs[],
  options: ReportOptions,
): ReportDataset {
  const { range, units, scope, rangeLabel, title } = options;
  const sections = REPORT_SECTIONS.filter((section) => options.sections.includes(section));
  const generatedAt = options.generatedAt ?? new Date();

  const includesEnergy = sections.includes("energy");
  const includesMaintenance = sections.includes("maintenance");
  const includesProfile = sections.includes("vehicle-profile");

  const { rows: energyRows, efficiencyByRow } = includesEnergy
    ? buildEnergyRows(vehicles, range, units)
    : { rows: [] as ReportEnergyRow[], efficiencyByRow: new Map<string, SegmentEfficiency>() };
  const maintenanceRows = includesMaintenance ? buildMaintenanceRows(vehicles, range) : [];
  const snapshotRows = includesProfile ? buildSnapshotRows(vehicles, range) : [];

  // Profiles come after the rows because each one carries its own spend and
  // efficiency, and those are derived from the rows the report emits.
  const profiles = vehicles.map((vehicle) =>
    buildVehicleProfile(vehicle, range, units, energyRows, maintenanceRows, efficiencyByRow),
  );

  const summary = buildSummary(
    profiles,
    energyRows,
    maintenanceRows,
    snapshotRows,
    efficiencyByRow,
    units,
  );

  const costMix: ReportCostMixSlice[] = (
    [
      { key: "fuel", value: summary.fuelCost },
      { key: "charge", value: summary.chargeCost },
      { key: "maintenance", value: summary.maintenanceCost },
    ] as ReportCostMixSlice[]
  ).filter((slice) => slice.value > 0);

  const spendByVehicle: ReportVehicleSpendSlice[] = profiles
    .map((vehicle) => ({
      vehicleId: vehicle.id,
      label: vehicle.label,
      value: vehicle.totalCost,
    }))
    .filter((slice) => slice.value > 0)
    .sort((left, right) => right.value - left.value);

  return {
    title,
    scope,
    range,
    rangeLabel,
    units,
    generatedAt: generatedAt.toISOString(),
    sections,
    vehicles: profiles,
    energyRows,
    maintenanceRows,
    snapshotRows,
    summary,
    charts: {
      monthlySpend: buildMonthlySpend(range, energyRows, maintenanceRows),
      costMix,
      spendByVehicle,
      // One vehicle is the only case where a single efficiency line is honest.
      // Past that the garage gets the spend split instead.
      efficiency: profiles.length === 1 ? buildEfficiencySeries(energyRows, units) : null,
    },
    isEmpty:
      energyRows.length === 0 && maintenanceRows.length === 0 && snapshotRows.length === 0,
  };
}
