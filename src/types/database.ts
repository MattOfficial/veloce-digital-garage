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
  powertrain: 'ice' | 'ev' | 'hev' | 'phev' | 'rex';
  battery_capacity_kwh: number | null;
  created_at: string;
};

export type FuelLogFillType = 'full' | 'partial';
export type FuelLogEnergyType = 'fuel' | 'charge';

export type FuelLog = {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  fuel_volume: number; // For EVs this represents kWh. Legacy name kept for DB column mapping context. 
  total_cost: number;
  calculated_efficiency: number | null;
  energy_type: FuelLogEnergyType;
  fill_type: FuelLogFillType;
  estimated_range: number | null;
  created_at: string;
};

export type MaintenanceLog = {
  id: string;
  vehicle_id: string;
  date: string;
  service_type: string;
  cost: number;
  notes: string | null;
  created_at: string;
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
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
};
