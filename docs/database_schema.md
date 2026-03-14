# Database Schema Summary

This summary reflects the current branch based on `supabase/migrations` and the app code that reads and writes those tables.

## Source Of Truth

Use the migration files in `supabase/migrations` as the authoritative schema history.

`supabase/schema.sql` is an early bootstrap snapshot and does not include all later changes.

## Core Tables

### `users`

App-level profile data keyed 1:1 to `auth.users`.

Columns used by the app:

- `id`
- `created_at`
- `display_name`
- `avatar_url`
- `currency`
- `distance_unit`
- `encrypted_llm_key`
- `encrypted_openai_key`
- `encrypted_deepseek_key`
- `preferred_llm_provider`

Notes:

- The app reads and writes `users`, not `profiles`
- Encrypted provider keys are stored here after AES-256-GCM encryption

### `vehicles`

Garage records owned by a user.

Columns used by the app:

- `id`
- `user_id`
- `make`
- `model`
- `year`
- `baseline_odometer`
- `image_url`
- `vin`
- `license_plate`
- `color`
- `nickname`
- `engine_type`
- `transmission`
- `notes`
- `custom_fields`
- `tyre_info`
- `vehicle_type`
- `powertrain`
- `battery_capacity_kwh`
- `created_at`

### `fuel_logs`

Fuel and charge events associated with a vehicle.

Columns used by the app:

- `id`
- `vehicle_id`
- `date`
- `odometer`
- `fuel_volume`
- `total_cost`
- `calculated_efficiency`
- `energy_type`
- `fill_type`
- `estimated_range`
- `created_at`

Notes:

- `fuel_volume` also represents charge energy for EV-related entries
- `energy_type` currently uses values such as `fuel` and `charge`
- `fill_type` is `full` or `partial` and controls whether the row closes an analytics segment

### `maintenance_logs`

Maintenance events associated with a vehicle.

Columns used by the app:

- `id`
- `vehicle_id`
- `user_id`
- `date`
- `service_type`
- `cost`
- `notes`
- `receipt_url`
- `created_at`

Important:

- There is currently no `provider` column in the migrated schema
- Provider/shop names are folded into `service_type` and `notes`

### `custom_log_categories`

Vehicle-scoped custom tracker definitions.

Columns used by the app:

- `id`
- `vehicle_id`
- `name`
- `icon`
- `color_theme`
- `track_cost`
- `created_at`

### `custom_logs`

Entries for custom tracker categories.

Columns used by the app:

- `id`
- `vehicle_id`
- `category_id`
- `date`
- `cost`
- `notes`
- `created_at`

## Supporting Tables

### `documents`

Metadata for uploaded files in the `vehicle-documents` storage bucket.

Columns:

- `id`
- `vehicle_id`
- `file_path`
- `file_name`
- `content_type`
- `size_bytes`
- `maintenance_log_id`
- `created_at`

Notes:

- The app writes `vehicle_id`, `file_path`, and `file_name` today
- This is the backing store for receipt uploads, but there is no standalone vault UI route yet

### `service_reminders`

Reminder rules tied to a vehicle.

Columns:

- `id`
- `vehicle_id`
- `service_type`
- `recurring_months`
- `recurring_distance`
- `last_completed_date`
- `last_completed_odometer`
- `created_at`
- `updated_at`

Notes:

- The schema and actions exist
- The current main maintenance page does not render reminder management yet

### `user_badges`

Earned achievements for a user.

Columns:

- `id`
- `user_id`
- `badge_id`
- `earned_at`

## Storage Buckets

The current branch expects these buckets and policies:

- `avatars`
- `vehicles`
- `vehicle-documents`

## RLS Model

The schema consistently applies ownership through `auth.uid()`, either directly on `users` or indirectly through `vehicles.user_id`.

Examples:

- `users` rows are self-owned by `id`
- `vehicles` rows are owned by `user_id`
- `fuel_logs`, `maintenance_logs`, `documents`, `service_reminders`, and `custom_logs` are protected through their parent `vehicle_id`

## Type Sync Note

If schema changes land, regenerate or update `src/types/supabase.ts` in the same change so the codebase does not drift from the migrations.
