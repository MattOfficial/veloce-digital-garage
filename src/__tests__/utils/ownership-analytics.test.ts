import { describe, expect, it } from "vitest";

import type {
  CustomLog,
  FuelLog,
  MaintenanceLog,
  VehicleWithLogs,
} from "@/types/database";
import { getOwnershipCostSummary } from "@/utils/ownership-analytics";

function makeVehicle(
  overrides: Partial<VehicleWithLogs> = {},
): VehicleWithLogs {
  return {
    id: "vehicle-1",
    user_id: "user-1",
    make: "Honda",
    model: "City",
    year: 2024,
    baseline_odometer: 10_000,
    current_odometer: 11_000,
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
    created_at: "2026-01-01T00:00:00Z",
    fuel_logs: [],
    maintenance_logs: [],
    custom_logs: [],
    service_reminders: [],
    vehicle_snapshots: [],
    ...overrides,
  };
}

function makeFuelLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return {
    id: "fuel-1",
    vehicle_id: "vehicle-1",
    date: "2026-07-20",
    odometer: 10_500,
    fuel_volume: 20,
    total_cost: 100,
    calculated_efficiency: 10,
    energy_type: "fuel",
    fill_type: "full",
    charge_source: null,
    start_soc: null,
    end_soc: null,
    is_estimated: false,
    charger_network: null,
    location: null,
    estimated_range: null,
    created_at: "2026-07-20T10:00:00Z",
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
    service_type: "Oil change",
    cost: 200,
    odometer: 10_800,
    notes: null,
    created_at: "2026-07-10T10:00:00Z",
    ...overrides,
  };
}

function makeCustomLog(overrides: Partial<CustomLog> = {}): CustomLog {
  return {
    id: "custom-1",
    vehicle_id: "vehicle-1",
    category_id: "category-1",
    date: "2026-07-05",
    cost: 50,
    notes: null,
    created_at: "2026-07-05T10:00:00Z",
    ...overrides,
  };
}

describe("getOwnershipCostSummary", () => {
  const TODAY = new Date(2026, 6, 21, 18, 30);

  it("combines every tracked cost category and uses the reliable odometer", () => {
    const vehicle = makeVehicle({
      current_odometer: 11_250,
      fuel_logs: [makeFuelLog({ odometer: 11_100 })],
      maintenance_logs: [makeMaintenanceLog({ odometer: 11_200 })],
      custom_logs: [makeCustomLog()],
    });

    const result = getOwnershipCostSummary(vehicle, TODAY);

    expect(result.totalFuelCost).toBe(100);
    expect(result.totalMaintenanceCost).toBe(200);
    expect(result.totalOtherCost).toBe(50);
    expect(result.totalCost).toBe(350);
    expect(result.trackedDistance).toBe(1_250);
    expect(result.costPerDistance).toBeCloseTo(0.28);
  });

  it("includes custom costs in both the period and monthly rollup", () => {
    const vehicle = makeVehicle({
      fuel_logs: [makeFuelLog()],
      maintenance_logs: [makeMaintenanceLog()],
      custom_logs: [makeCustomLog()],
    });

    const result = getOwnershipCostSummary(vehicle, TODAY);
    const july = result.monthlyCosts.find((month) => month.key === "2026-07");

    expect(result.currentPeriodCost).toBe(350);
    expect(july).toMatchObject({
      fuel: 100,
      maintenance: 200,
      other: 50,
      total: 350,
    });
  });

  it("returns no trend instead of a misleading zero when there is no prior period", () => {
    const vehicle = makeVehicle({ fuel_logs: [makeFuelLog()] });

    const result = getOwnershipCostSummary(vehicle, TODAY);

    expect(result.previousPeriodCost).toBe(0);
    expect(result.periodTrendPercent).toBeNull();
  });

  it("creates contiguous zero-filled calendar months", () => {
    const result = getOwnershipCostSummary(makeVehicle(), TODAY, 3);

    expect(result.monthlyCosts.map((month) => month.key)).toEqual([
      "2026-05",
      "2026-06",
      "2026-07",
    ]);
  });

  it("ignores future-dated records in totals and monthly trends", () => {
    const vehicle = makeVehicle({
      fuel_logs: [
        makeFuelLog(),
        makeFuelLog({
          id: "future-fuel",
          date: "2026-07-28",
          total_cost: 999,
        }),
      ],
      maintenance_logs: [
        makeMaintenanceLog({
          id: "future-maintenance",
          date: "2026-08-01",
          cost: 500,
        }),
      ],
    });

    const result = getOwnershipCostSummary(vehicle, TODAY, 3);

    expect(result.totalCost).toBe(100);
    expect(result.currentPeriodCost).toBe(100);
    expect(result.monthlyCosts.find((month) => month.key === "2026-07")?.total).toBe(100);
  });
});
