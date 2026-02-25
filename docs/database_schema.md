# Supabase Database Schema

## `profiles`
Extended user model tied 1-to-1 with Supabase Auth (`auth.users`).
- `id` (uuid, primary key, references `auth.users.id`)
- `first_name`, `last_name` (text, nullable)
- `distanceUnit` (text, default 'km', or 'miles')
- `currency` (text, default 'USD')

## `vehicles`
The core application namespace. Everything belongs to a vehicle, which belongs to a user.
- `id` (uuid, default `uuid_generate_v4()`, primary key)
- `user_id` (uuid, references `profiles.id`)
- `make`, `model` (text)
- `year` (int4)
- `plate_number` (text)
- `vin` (text, nullable)
- `baseline_odometer` (int4, default 0)
- `fuel_capacity` (numeric)
- `tyre_info` (jsonb, highly nested)
- `created_at` (timestamptz)

### `tyre_info` JSONB Structure
```json
{
  "front_left": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "front_right": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "rear_left": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number },
  "rear_right": { "brand": "string", "installed_date": "YYYY-MM-DD", "installed_odo": number, "dot_code": "4-digit string", "tread_depth": number }
}
```

## `fuel_logs`
Time-series data for fuel fill-ups.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `date` (timestamptz)
- `odometer` (int4)
- `fuel_volume` (numeric)
- `total_cost` (numeric)
- `full_tank` (boolean)
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
User-defined metric categories across their entire garage.
- `id` (uuid, primary key)
- `user_id` (uuid, references `profiles.id`)
- `name` (text - e.g. "Washer Fluid", "Coolant")
- `unit` (text, nullable)
- `icon` (text, nullable - string representation of Lucide icon name)

## `custom_logs`
Time-series data attaching a specific vehicle to a custom tracker category.
- `id` (uuid, primary key)
- `vehicle_id` (uuid, references `vehicles.id`, ON DELETE CASCADE)
- `category_id` (uuid, references `custom_log_categories.id`, ON DELETE CASCADE)
- `date` (timestamptz)
- `value` (numeric, nullable)
- `cost` (numeric, nullable)
- `notes` (text, nullable)

## RLS Security Model
In Supabase Database -> Authentication:
All tables enforce strictly authenticated Row Level Security (`RLS`).
- `profiles`: Users can only read (`SELECT`) and write (`UPDATE`) rows where `auth.uid() = id`.
- `vehicles`, `custom_log_categories`: Users can only interact with rows where `auth.uid() = user_id`.
- `fuel_logs`, `maintenance_logs`, `custom_logs`: These tables rely on the cascading validation, but generally specify RLS either directly checking a `user_id` column or by joining the parent `vehicles` table where `user_id = auth.uid()`.
