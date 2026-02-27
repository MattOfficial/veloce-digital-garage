# Supabase Database Schema

## `profiles`
Extended user model tied 1-to-1 with Supabase Auth (`auth.users`).
- `id` (uuid, primary key, references `auth.users.id`)
- `first_name`, `last_name` (text, nullable)
- `distanceUnit` (text, default 'km', or 'miles')
- `currency` (text, default 'USD')
- `volumeUnit` (text, nullable)

## `vehicles`
The core application namespace. Everything belongs to a vehicle, which belongs to a user.
- `id` (uuid, default `uuid_generate_v4()`, primary key)
- `user_id` (uuid, references `profiles.id`)
- `make`, `model` (text)
- `year` (int4)
- `plate_number` (text)
- `vin` (text, nullable)
- `baseline_odometer` (int4, default 0)
- `fuel_capacity` (numeric) // Deprecated for EVs, kept for legacy ICE
- `vehicle_type` (text: 'car', 'motorcycle', 'truck' - default 'car')
- `powertrain` (text: 'ice', 'ev', 'hev', 'phev', 'rex' - default 'ice')
- `battery_capacity_kwh` (numeric, nullable)
- `nickname` (text, nullable)
- `tyre_info` (jsonb, highly nested)
- `created_at` (timestamptz)

### `tyre_info` JSONB Structure
```json
// For Cars/Trucks:
{
  "front_left": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "front_right": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "rear_left": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "rear_right": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number }
}
// For Motorcycles, only front_left (mapped to Front) and rear_left (mapped to Rear) are utilized.
```

## `fuel_logs`
Time-series data for fuel fill-ups AND electrical charging sessions (polymorphic based on vehicle powertrain).
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `date` (timestamptz)
- `odometer` (int4)
- `fuel_volume` (numeric) // Used for liquid fuels (Liters/Gallons) AND Electrical Energy (kWh) depending on powertrain.
- `total_cost` (numeric)
- `full_tank` (boolean)
- `energy_type` (text: 'liquid_fuel' or 'electric_charge')
- `estimated_range` (numeric, nullable) // Used to track battery degradation over time
- `notes` (text, nullable)

## `maintenance_logs`
Event logs for specific maintenance repairs.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `user_id` (uuid, references `profiles.id`)
- `date` (timestamptz)
- `service_type` (text - e.g. "Oil Change", "Brake Pad Replacement")
- `cost` (numeric)
- `provider` (text, nullable)
- `notes` (text, nullable)
- `receipt_url` (text, nullable - pointer to Supabase Storage bucket)

## `custom_log_categories`
User-defined metric categories scoped entirely to a specific vehicle instance.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `name` (text - e.g. "Washer Fluid", "Coolant")
- `unit` (text, nullable)
- `icon` (text, nullable - string representation of Lucide icon name)

## `custom_logs`
Time-series data attaching a log entry to a custom tracker category.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `category_id` (uuid, references `custom_log_categories.id`, ON DELETE CASCADE)
- `date` (timestamptz)
- `value` (numeric, nullable)
- `cost` (numeric, nullable)
- `notes` (text, nullable)

## `documents`
Stores metadata for files uploaded to the Supabase Storage Vault bucket.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `user_id` (uuid, references `profiles.id`)
- `title` (text)
- `file_url` (text)
- `file_type` (text, e.g. 'application/pdf', 'image/jpeg')
- `file_size` (int8)
- `category` (text, nullable - e.g. "Insurance", "Registration", "Receipt")
- `uploaded_at` (timestamptz)

## `service_reminders`
Tracks upcoming maintenance tasks based on date or odometer thresholds.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `user_id` (uuid, references `profiles.id`)
- `title` (text)
- `description` (text, nullable)
- `due_date` (date, nullable)
- `due_odometer` (int4, nullable)
- `is_completed` (boolean, default false)
- `created_at` (timestamptz)

## RLS Security Model
In Supabase Database -> Authentication:
All tables enforce strictly authenticated Row Level Security (`RLS`).
- `profiles`: Users can only read (`SELECT`) and write (`UPDATE`) rows where `auth.uid() = id`.
- `vehicles`: Users can only interact with rows where `auth.uid() = user_id`.
- `fuel_logs`, `maintenance_logs`, `custom_logs`, `custom_log_categories`: These tables strictly enforce safety via complex relational joins ensuring `vehicles.id = table.vehicle_id` AND `vehicles.user_id = auth.uid()`.
