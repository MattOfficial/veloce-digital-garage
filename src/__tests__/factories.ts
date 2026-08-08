import type {
  CustomLog,
  FuelLog,
  MaintenanceLog,
  VehicleSnapshot,
  VehicleWithLogs,
} from "@/types/database";

/**
 * Shared fixtures for the analytics tests.
 *
 * These types are wide and grow often — every column added to `fuel_logs` used
 * to break seven test files that each carried their own near-identical builder.
 * One factory per entity, overridden per test.
 */

export function makeFuelLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return {
    id: "fuel-1",
    vehicle_id: "v-1",
    date: "2024-01-15",
    odometer: 5_000,
    fuel_volume: 10,
    total_cost: 20,
    calculated_efficiency: null,
    energy_type: "fuel",
    fill_type: "full",
    estimated_range: null,
    charge_source: null,
    start_soc: null,
    end_soc: null,
    is_estimated: false,
    charger_network: null,
    location: null,
    pricing_mode: null,
    rate_per_unit: null,
    duration_minutes: null,
    session_fee: null,
    idle_minutes: null,
    idle_rate_per_minute: null,
    tax_percent: null,
    charged_to_full: null,
    energy_basis: null,
    created_at: "2024-01-15T10:00:00Z",
    ...overrides,
  };
}

/** A metered per-kWh charge session, the most common shape. */
export function makeChargeLog(overrides: Partial<FuelLog> = {}): FuelLog {
  return makeFuelLog({
    id: "charge-1",
    fuel_volume: 3,
    total_cost: 60,
    energy_type: "charge",
    fill_type: null,
    charge_source: "home",
    pricing_mode: "per_kwh",
    rate_per_unit: 20,
    energy_basis: "metered",
    ...overrides,
  });
}

export function makeMaintenanceLog(
  overrides: Partial<MaintenanceLog> = {},
): MaintenanceLog {
  return {
    id: "maintenance-1",
    vehicle_id: "v-1",
    date: "2024-01-10",
    service_type: "Service",
    cost: 2_000,
    odometer: 5_000,
    notes: null,
    created_at: "2024-01-10T10:00:00Z",
    ...overrides,
  };
}

export function makeCustomLog(overrides: Partial<CustomLog> = {}): CustomLog {
  return {
    id: "custom-1",
    vehicle_id: "v-1",
    category_id: "category-1",
    date: "2024-01-10",
    cost: 500,
    notes: null,
    created_at: "2024-01-10T10:00:00Z",
    ...overrides,
  };
}

export function makeSnapshot(
  overrides: Partial<VehicleSnapshot> = {},
): VehicleSnapshot {
  return {
    id: "snapshot-1",
    vehicle_id: "v-1",
    date: "2024-01-15",
    odometer: 5_000,
    soc_percent: null,
    displayed_range: null,
    source: "manual",
    notes: null,
    created_at: "2024-01-15T10:00:00Z",
    ...overrides,
  };
}

export function makeVehicle(
  overrides: Partial<VehicleWithLogs> = {},
): VehicleWithLogs {
  return {
    id: "v-1",
    user_id: "u-1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
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
    created_at: "2024-01-01T00:00:00Z",
    fuel_logs: [],
    maintenance_logs: [],
    custom_logs: [],
    service_reminders: [],
    vehicle_snapshots: [],
    ...overrides,
  };
}

/** An electric vehicle with a pack size set, ready for charge-session tests. */
export function makeEvVehicle(
  overrides: Partial<VehicleWithLogs> = {},
): VehicleWithLogs {
  return makeVehicle({
    make: "Ather",
    model: "450X",
    year: 2024,
    vehicle_type: "motorcycle",
    powertrain: "ev",
    battery_capacity_kwh: 3.7,
    usable_battery_kwh: 3.7,
    ...overrides,
  });
}
