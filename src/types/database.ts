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
  vehicle_type: VehicleType;
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

export type VehicleType = 'car' | 'motorcycle' | 'truck';

export type Powertrain = 'ice' | 'ev' | 'hev' | 'phev' | 'rex';

/**
 * Powertrains whose running cost is entirely liquid fuel, so they can stand as
 * the petrol benchmark an EV is compared against. A self-charging hybrid counts;
 * a plug-in does not, because part of its energy came off the grid.
 */
export const LIQUID_FUEL_POWERTRAINS: Powertrain[] = ['ice', 'hev'];

export function isLiquidFuelPowertrain(powertrain: Powertrain | null | undefined): boolean {
  return powertrain != null && LIQUID_FUEL_POWERTRAINS.includes(powertrain);
}

/** Powertrains that charge from the grid and therefore use SoC-based analytics. */
export const ELECTRIC_POWERTRAINS: Powertrain[] = ['ev', 'phev', 'rex'];

export function isElectricPowertrain(powertrain: Powertrain | null | undefined): boolean {
  return powertrain != null && ELECTRIC_POWERTRAINS.includes(powertrain);
}

/** Fill type is an ICE-only concept; charge rows carry null. */
export type FuelLogFillType = 'full' | 'partial';
export type FuelLogEnergyType = 'fuel' | 'charge';
export type ChargeSource = 'home' | 'ac_public' | 'dc_fast' | 'other';

/**
 * How a charge session was billed. These are presets over the four OCPI tariff
 * dimensions rather than a taxonomy of their own — see
 * docs/ev-charging-redesign.md. Tiered, time-of-use, dynamic and membership
 * pricing are all modifiers over the same dimensions, so they need no new mode.
 */
export type ChargePricingMode = 'per_kwh' | 'per_minute' | 'flat' | 'free';

export const CHARGE_PRICING_MODES: ChargePricingMode[] = [
  'per_kwh',
  'per_minute',
  'flat',
  'free',
];

/**
 * Metered kWh comes off a meter and includes charging losses; SoC-derived kWh
 * is what reached the pack. They are different denominators, so a row has to
 * declare which efficiency figure it is allowed to feed.
 */
export type ChargeEnergyBasis = 'metered' | 'soc_derived';

export type FuelLog = {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  fuel_volume: number; // For EVs this represents kWh. Legacy name kept for DB column mapping context.
  /** Authoritative. Rate x quantity is a UI calculator; this is the record. */
  total_cost: number;
  calculated_efficiency: number | null;
  energy_type: FuelLogEnergyType;
  fill_type: FuelLogFillType | null;
  estimated_range: number | null;
  charge_source: ChargeSource | null;
  start_soc: number | null;
  end_soc: number | null;
  /** True only for app-generated cold-start rows, never for a session the user typed. */
  is_estimated: boolean;
  charger_network: string | null;
  location: string | null;
  pricing_mode: ChargePricingMode | null;
  /** Currency per kWh or per minute, depending on `pricing_mode`. */
  rate_per_unit: number | null;
  duration_minutes: number | null;
  session_fee: number | null;
  idle_minutes: number | null;
  idle_rate_per_minute: number | null;
  tax_percent: number | null;
  /** The efficiency anchor for sessions logged without a state of charge. */
  charged_to_full: boolean | null;
  energy_basis: ChargeEnergyBasis | null;
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
