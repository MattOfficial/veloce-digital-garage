-- Migration for Phase 2: Add vehicle types and powertrain support

-- 1. Updates to 'vehicles' table
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS vehicle_type text DEFAULT 'car', -- 'car', 'motorcycle', 'truck'
  ADD COLUMN IF NOT EXISTS powertrain text DEFAULT 'ice', -- 'ice', 'ev', 'phev', 'hev', 'rex'
  ADD COLUMN IF NOT EXISTS battery_capacity_kwh numeric;

-- 2. Updates to 'fuel_logs' table (renamed logically to energy_logs)
ALTER TABLE fuel_logs
  ADD COLUMN IF NOT EXISTS energy_type text DEFAULT 'fuel', -- 'fuel' or 'charge'
  ADD COLUMN IF NOT EXISTS estimated_range numeric; -- For EV/PHEV battery range tracking
