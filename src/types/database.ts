export type User = {
  id: string; // UUID from auth.users
  created_at: string;
};

export type TireItem = {
  brand: string;
  installed_date: string;
  installed_odo: number;
  dot_code?: string;
  tread_depth?: number;
};

export type TyreInfo = {
  brand?: string;
  installed_date?: string;
  installed_odo?: number;
  dot_code?: string;
  tread_depth?: number;

  front_left?: TireItem;
  front_right?: TireItem;
  rear_left?: TireItem;
  rear_right?: TireItem;
};

export type Vehicle = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  baseline_odometer: number;
  current_odometer: number | null;
  image_url: string | null;
  vin: string | null;
  license_plate: string | null;
  color: string | null;
  nickname: string | null;
  engine_type: string | null;
  transmission: string | null;
  notes: string | null;
  custom_fields: Record<string, string> | null;
  tyre_info: TyreInfo | null;
  vehicle_type: 'car' | 'motorcycle' | 'truck';
  powertrain: Powertrain;
  battery_capacity_kwh: number | null;
  /** What the pack actually delivers between 100% and 0% indicated. Denominator for Wh/km. */
  usable_battery_kwh: number | null;
  rated_range_km: number | null;
  /** Measured usable range early in ownership. Denominator for state-of-health. */
  baseline_range_km: number | null;
  battery_warranty_years: number | null;
  battery_warranty_km: number | null;
  created_at: string;
};

export type Powertrain = 'ice' | 'ev' | 'hev' | 'phev' | 'rex';

/** Powertrains that charge from the grid and therefore use SoC-based analytics. */
export const ELECTRIC_POWERTRAINS: Powertrain[] = ['ev', 'phev', 'rex'];

export function isElectricPowertrain(powertrain: Powertrain | null | undefined): boolean {
  return powertrain != null && ELECTRIC_POWERTRAINS.includes(powertrain);
}

/** Fill type is an ICE-only concept; charge rows carry null. */
export type FuelLogFillType = 'full' | 'partial';
export type FuelLogEnergyType = 'fuel' | 'charge';
export type ChargeSource = 'home' | 'ac_public' | 'dc_fast' | 'other';

export type FuelLog = {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  fuel_volume: number; // For EVs this represents kWh. Legacy name kept for DB column mapping context.
  total_cost: number;
  calculated_efficiency: number | null;
  energy_type: FuelLogEnergyType;
  fill_type: FuelLogFillType | null;
  estimated_range: number | null;
  charge_source: ChargeSource | null;
  start_soc: number | null;
  end_soc: number | null;
  /** True for inferred home-charging rows, which must be labelled as estimates in the UI. */
  is_estimated: boolean;
  charger_network: string | null;
  location: string | null;
  created_at: string;
};

export type VehicleSnapshotSource = 'manual' | 'ocr' | 'api';

/**
 * A point-in-time reading of the vehicle. `soc_percent` is null for ICE vehicles,
 * where this is simply an odometer update.
 */
export type VehicleSnapshot = {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  soc_percent: number | null;
  displayed_range: number | null;
  source: VehicleSnapshotSource;
  notes: string | null;
  created_at: string;
};

export type MaintenanceLog = {
  id: string;
  vehicle_id: string;
  date: string;
  service_type: string;
  cost: number;
  odometer: number | null;
  notes: string | null;
  created_at: string;
};

export type ServiceReminder = {
  id: string;
  vehicle_id: string | null;
  service_type: string;
  recurring_months: number | null;
  recurring_distance: number | null;
  last_completed_date: string | null;
  last_completed_odometer: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CustomLogCategory = {
  id: string;
  vehicle_id: string;
  name: string;
  icon: string;
  color_theme: string;
  track_cost: boolean;
  created_at: string;
};

export type CustomLog = {
  id: string;
  vehicle_id: string;
  category_id: string;
  date: string;
  cost: number | null;
  notes: string | null;
  created_at: string;
};

// Joined types for UI
export type VehicleWithLogs = Vehicle & {
  fuel_logs: FuelLog[];
  maintenance_logs: MaintenanceLog[];
  custom_logs: CustomLog[];
  service_reminders: ServiceReminder[];
  vehicle_snapshots: VehicleSnapshot[];
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
};
