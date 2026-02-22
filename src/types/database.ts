export type User = {
  id: string; // UUID from auth.users
  created_at: string;
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
  engine_type: string | null;
  transmission: string | null;
  notes: string | null;
  created_at: string;
};

export type FuelLog = {
  id: string;
  vehicle_id: string;
  date: string;
  odometer: number;
  fuel_volume: number;
  total_cost: number;
  calculated_efficiency: number | null;
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

// Joined types for UI
export type VehicleWithLogs = Vehicle & {
  fuel_logs: FuelLog[];
  maintenance_logs: MaintenanceLog[];
};
