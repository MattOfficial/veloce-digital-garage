import { describe, expect, it } from "vitest";

import { buildVehicleDistanceTrends } from "@/utils/distance-trends";
import type {
  FuelLog,
  MaintenanceLog,
  VehicleWithLogs,
} from "@/types/database";

function makeFuelLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return {
    id: "fuel-1",
    vehicle_id: "vehicle-1",
    date: "2026-07-05",
    odometer: 1_050,
    fuel_volume: 10,
    total_cost: 20,
    calculated_efficiency: null,
    energy_type: "fuel",
    fill_type: "full",
    charge_source: null,
    start_soc: null,
    end_soc: null,
    is_estimated: false,
    charger_network: null,
    location: null,
    estimated_range: null,
    created_at: "2026-07-05T10:00:00Z",
    ...overrides,
  };
}

function makeMaintenanceLog(
  overrides: Partial<MaintenanceLog> = {},
): MaintenanceLog {
  return {
    id: "maintenance-1",
    vehicle_id: "vehicle-1",
    date: "2026-07-10",
    service_type: "Inspection",
    cost: 50,
    odometer: 1_100,
    notes: null,
    created_at: "2026-07-10T10:00:00Z",
    ...overrides,
  };
}

function makeVehicle(
  overrides: Partial<VehicleWithLogs> = {},
): VehicleWithLogs {
  return {
    id: "vehicle-1",
    user_id: "user-1",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    baseline_odometer: 1_000,
    current_odometer: null,
    image_url: null,
    vin: null,
    license_plate: null,
    color: null,
    nickname: null,
    engine_type: null,
    transmission: null,
    notes: null,
    custom_fields: null,
    tyre_info: null,
    vehicle_type: "car",
    powertrain: "ice",
    battery_capacity_kwh: null,
    usable_battery_kwh: null,
    rated_range_km: null,
    baseline_range_km: null,
    battery_warranty_years: null,
    battery_warranty_km: null,
    created_at: "2026-06-30T10:00:00Z",
    fuel_logs: [],
    maintenance_logs: [],
    custom_logs: [],
    service_reminders: [],
    vehicle_snapshots: [],
    ...overrides,
  };
}

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12);
}

describe("buildVehicleDistanceTrends", () => {
  it("merges fuel and maintenance readings into defensible daily estimates", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog({ id: "fuel-5", date: "2026-07-05", odometer: 1_050 }),
        makeFuelLog({ id: "fuel-15", date: "2026-07-15", odometer: 1_200 }),
      ],
      maintenance_logs: [
        makeMaintenanceLog({ date: "2026-07-10", odometer: 1_100 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 15),
    });
    const month = result.selectedMonth;

    expect(month).toMatchObject({
      key: "2026-07",
      totalDistance: 200,
      value: 200,
      coverage: "full",
      coverageRatio: 1,
      coveredDays: 15,
      totalDays: 15,
      readingCount: 3,
      isEstimated: true,
    });
    expect(month.dailyPoints).toHaveLength(15);
    expect(month.dailyPoints[0]).toMatchObject({
      key: "2026-07-01",
      distance: 10,
      isEstimated: true,
      estimateKind: "interpolated",
      interpolationSpanDays: 5,
    });
    expect(month.dailyPoints[10]).toMatchObject({
      key: "2026-07-11",
      distance: 20,
      estimateKind: "interpolated",
    });
    expect(month.kpis.averageCoveredDayDistance).toBeCloseTo(200 / 15);
    expect(month.kpis.averageDrivingDayDistance).toBeCloseTo(200 / 15);
    expect(month.kpis.medianDrivingDayDistance).toBe(10);
    expect(month.kpis.estimatedDrivingDays).toBe(15);
    expect(month.kpis.peakDay).toMatchObject({
      key: "2026-07-11",
      distance: 20,
    });
    expect(month.kpis.consistencyBand).toBe("mixed");
    expect(month.kpis.largestInterpolationSpanDays).toBe(5);
    expect(result.dataQuality).toMatchObject({
      fuelObservations: 2,
      maintenanceObservations: 1,
      baselineIncluded: true,
      usableReadingDays: 4,
      segmentCount: 3,
    });
  });

  it("collapses same-day readings to the highest odometer", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog({ id: "fuel-5", date: "2026-07-05", odometer: 1_050 }),
        makeFuelLog({ id: "fuel-10", date: "2026-07-10", odometer: 1_100 }),
      ],
      maintenance_logs: [
        makeMaintenanceLog({ date: "2026-07-05", odometer: 1_060 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 10),
    });

    expect(result.selectedMonth.totalDistance).toBe(100);
    expect(result.selectedMonth.coverage).toBe("full");
    expect(result.dataQuality.collapsedSameDayObservations).toBe(1);
    expect(result.dataQuality.usableReadingDays).toBe(3);
    expect(result.dataQuality.segmentCount).toBe(2);
  });

  it("discards decreasing readings rather than double counting their recovery", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog({ id: "fuel-5", date: "2026-07-05", odometer: 1_100 }),
        makeFuelLog({ id: "fuel-15", date: "2026-07-15", odometer: 1_150 }),
      ],
      maintenance_logs: [
        makeMaintenanceLog({ date: "2026-07-10", odometer: 1_050 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 15),
    });

    expect(result.selectedMonth.totalDistance).toBe(150);
    expect(result.selectedMonth.coverage).toBe("full");
    expect(result.dataQuality.discardedDecreasingReadings).toBe(1);
    expect(result.dataQuality.usableReadingDays).toBe(3);
  });

  it("builds chronological monthly totals and a full-quality comparison", () => {
    const vehicle = makeVehicle({
      created_at: "2025-12-31T10:00:00Z",
      baseline_odometer: 1_000,
      fuel_logs: [
        makeFuelLog({ id: "jan", date: "2026-01-31", odometer: 1_310 }),
        makeFuelLog({ id: "feb", date: "2026-02-28", odometer: 1_590 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 2,
      endDate: localDate(2026, 2, 28),
      selectedMonthKey: "2026-02",
    });

    expect(result.months.map((month) => month.key)).toEqual([
      "2026-01",
      "2026-02",
    ]);
    expect(result.months.map((month) => month.totalDistance)).toEqual([
      310,
      280,
    ]);
    expect(result.months.every((month) => month.coverage === "full")).toBe(
      true,
    );
    expect(result.comparison).toMatchObject({
      currentMonthKey: "2026-02",
      previousMonthKey: "2026-01",
      currentPeriodEnd: "2026-02-28",
      previousPeriodEnd: "2026-01-31",
      basis: "full-month",
      currentDistance: 280,
      previousDistance: 310,
      absoluteChange: -30,
      direction: "down",
      quality: "comparable",
    });
    expect(result.comparison.percentageChange).toBeCloseTo((-30 / 310) * 100);
    expect(result.selectedMonth.kpis.averageCoveredDayDistance).toBe(10);
    expect(result.selectedMonth.kpis.consistencyScore).toBe(100);
    expect(result.selectedMonth.kpis.consistencyBand).toBe("steady");
  });

  it("compares a current partial month with the same elapsed prior-month window", () => {
    const vehicle = makeVehicle({
      created_at: "2026-05-31T10:00:00Z",
      baseline_odometer: 1_000,
      fuel_logs: [
        makeFuelLog({ id: "jun-15", date: "2026-06-15", odometer: 1_150 }),
        makeFuelLog({ id: "jun-30", date: "2026-06-30", odometer: 1_300 }),
        makeFuelLog({ id: "jul-15", date: "2026-07-15", odometer: 1_450 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 2,
      endDate: localDate(2026, 7, 15),
    });

    expect(result.comparison).toMatchObject({
      basis: "month-to-date",
      currentPeriodEnd: "2026-07-15",
      previousPeriodEnd: "2026-06-15",
      currentDistance: 150,
      previousDistance: 150,
      absoluteChange: 0,
      percentageChange: 0,
      direction: "steady",
      quality: "comparable",
    });
  });

  it("stops the current month at the requested end date and ignores future logs", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog({ id: "today", date: "2026-07-15", odometer: 1_150 }),
        makeFuelLog({ id: "future", date: "2026-07-31", odometer: 1_310 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 15),
    });

    expect(result.selectedMonth.dailyPoints).toHaveLength(15);
    expect(result.selectedMonth.end).toBe("2026-07-15");
    expect(result.selectedMonth.totalDistance).toBe(150);
    expect(result.selectedMonth.coverage).toBe("full");
    expect(result.dataQuality.discardedInvalidObservations).toBe(1);
  });

  it("keeps days outside cumulative-reading spans unknown", () => {
    const vehicle = makeVehicle({
      created_at: "2026-07-05T10:00:00Z",
      fuel_logs: [
        makeFuelLog({ date: "2026-07-10", odometer: 1_050 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 15),
    });
    const month = result.selectedMonth;

    expect(month.totalDistance).toBe(50);
    expect(month.coverage).toBe("partial");
    expect(month.coveredDays).toBe(5);
    expect(month.totalDays).toBe(15);
    expect(month.coverageRatio).toBeCloseTo(1 / 3);
    expect(month.dailyPoints[0].distance).toBeNull();
    expect(month.dailyPoints[5].distance).toBe(10);
    expect(month.dailyPoints[10].distance).toBeNull();
    expect(month.kpis.longestUncoveredRunDays).toBe(5);
    expect(result.comparison.quality).toBe("unavailable");
  });

  it("returns explicit no-data points and KPIs when no dated observations exist", () => {
    const vehicle = makeVehicle({
      created_at: "2026-08-01T10:00:00Z",
      fuel_logs: [],
      maintenance_logs: [makeMaintenanceLog({ odometer: null })],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 31),
    });

    expect(result.selectedMonth).toMatchObject({
      totalDistance: null,
      value: 0,
      hasData: false,
      coverage: "none",
      coveredDays: 0,
      totalDays: 31,
      readingCount: 0,
    });
    expect(result.selectedMonth.dailyPoints.every((point) => !point.hasCoverage)).toBe(
      true,
    );
    expect(result.selectedMonth.kpis).toMatchObject({
      averageCoveredDayDistance: null,
      averageDrivingDayDistance: null,
      medianDrivingDayDistance: null,
      estimatedDrivingDays: 0,
      peakDay: null,
      consistencyScore: null,
      consistencyBand: "insufficient-data",
      coverageRatio: 0,
      longestUncoveredRunDays: 31,
      largestInterpolationSpanDays: null,
    });
  });

  it("derives useful variable-driving KPIs from adjacent daily readings", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog({ id: "day-1", date: "2026-07-01", odometer: 1_000 }),
        makeFuelLog({ id: "day-2", date: "2026-07-02", odometer: 1_020 }),
        makeFuelLog({ id: "day-3", date: "2026-07-03", odometer: 1_020 }),
        makeFuelLog({ id: "day-4", date: "2026-07-04", odometer: 1_040 }),
      ],
    });

    const result = buildVehicleDistanceTrends(vehicle, {
      monthCount: 1,
      endDate: localDate(2026, 7, 4),
    });
    const month = result.selectedMonth;

    expect(month.dailyPoints.map((point) => point.distance)).toEqual([
      0,
      20,
      0,
      20,
    ]);
    expect(month.dailyPoints.every((point) => point.isEstimated)).toBe(true);
    expect(
      month.dailyPoints.every(
        (point) => point.estimateKind === "adjacent-readings",
      ),
    ).toBe(true);
    expect(month.kpis).toMatchObject({
      averageCoveredDayDistance: 10,
      averageDrivingDayDistance: 20,
      medianDrivingDayDistance: 20,
      estimatedDrivingDays: 2,
      consistencyScore: 0,
      consistencyBand: "variable",
      largestInterpolationSpanDays: 1,
    });
    expect(month.kpis.peakDay).toMatchObject({
      key: "2026-07-02",
      distance: 20,
    });
  });

  it("falls back to the end month for an invalid or future selection", () => {
    const vehicle = makeVehicle({
      fuel_logs: [makeFuelLog({ date: "2026-07-15", odometer: 1_150 })],
    });

    expect(
      buildVehicleDistanceTrends(vehicle, {
        monthCount: 1,
        endDate: localDate(2026, 7, 15),
        selectedMonthKey: "not-a-month",
      }).selectedMonth.key,
    ).toBe("2026-07");
    expect(
      buildVehicleDistanceTrends(vehicle, {
        monthCount: 1,
        endDate: localDate(2026, 7, 15),
        selectedMonthKey: "2026-08",
      }).selectedMonth.key,
    ).toBe("2026-07");
  });
});
