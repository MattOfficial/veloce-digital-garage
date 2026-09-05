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
- `current_odometer`
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
- `fuel_type`
- `battery_capacity_kwh`
- `usable_battery_kwh`
- `rated_range_km`
- `baseline_range_km`
- `battery_warranty_years`
- `battery_warranty_km`
- `created_at`

Notes:

- `fuel_type` (`petrol` / `diesel` / `cng` / `lpg`) is null until the owner sets it — added after
  many vehicles already existed, so it is never guessed
- `usable_battery_kwh` and `baseline_range_km` are the denominators for Wh/km and state-of-health
  on EVs; both fall back to `battery_capacity_kwh` where the app reads usable capacity

### `fuel_logs`

Fuel and charge events associated with a vehicle. Every charge is a logged event, home
included — see [ev-charging-redesign.md](ev-charging-redesign.md) for why and for the pricing
model behind the charge-only columns below.

Columns used by the app:

- `id`
- `vehicle_id`
- `date`
- `odometer`
- `fuel_volume` — for a charge row, resolved kWh (metered or SoC-derived)
- `total_cost` — authoritative; rate × quantity is a UI calculator, this is the record
- `calculated_efficiency`
- `energy_type` (`fuel` \| `charge`)
- `fill_type` (`full` \| `partial`, fuel rows only — a full charge is not a comparable concept)
- `estimated_range`
- `is_estimated` — true only for app-generated cold-start rows, never a session the user typed
- `charge_source` (`home` \| `ac_public` \| `dc_fast` \| `other`)
- `start_soc`, `end_soc` — battery percent at the start/end of a charge
- `charged_to_full` — the full-charge anchor flag; also written into `end_soc` as `100` when set
  and no more specific reading was given (see §2(a) of ev-charging-redesign.md)
- `energy_basis` (`metered` \| `soc_derived`) — which efficiency figure the row can feed
- `pricing_mode` (`per_kwh` \| `per_minute` \| `flat` \| `free`)
- `rate_per_unit`, `duration_minutes`, `session_fee`, `idle_minutes`, `idle_rate_per_minute`,
  `tax_percent` — the OCPI tariff components a pricing mode reads
- `charger_network`, `location` — public charging only
- `created_at`

Notes:

- `fuel_volume` also represents charge energy for EV-related entries
- `energy_type` currently uses values such as `fuel` and `charge`
- `fill_type` is `full` or `partial` and controls whether the row closes an analytics segment
  for liquid fuel; charge rows use `start_soc`/`end_soc`/`charged_to_full` instead, since the
  full-tank method does not fit a vehicle charged at home most nights

### `vehicle_snapshots`

A point-in-time reading of the vehicle: odometer, optionally paired with a battery percentage.
`soc_percent` is null for an ICE vehicle, where a row is simply an odometer update. Feeds
battery health (usable range, state of health) alongside the SoC readings a charge session
already carries — see [ev-charging-redesign.md](ev-charging-redesign.md) and
`src/utils/battery-health.ts`.

Columns used by the app:

- `id`
- `vehicle_id`
- `date`
- `odometer`
- `soc_percent`
- `displayed_range`
- `source` (`manual` \| `ocr` \| `api`)
- `notes`
- `created_at`

### `maintenance_logs`

Maintenance events associated with a vehicle.

Columns used by the app:

- `id`
- `vehicle_id`
- `user_id`
- `date`
- `service_type`
- `cost`
- `odometer`
- `notes`
- `receipt_url`
- `created_at`

Important:

- There is currently no `provider` column in the migrated schema
- Provider/shop names are folded into `service_type` and `notes`
- `odometer` and `receipt_url` are read and written directly off `FormData` in
  `src/app/actions/maintenance.ts` but are not yet modelled on the `MaintenanceLog` type in
  `src/types/database.ts` — a gap in the app's own types, not in the schema

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
- `fuel_logs`, `maintenance_logs`, `documents`, `service_reminders`, `custom_logs`, and
  `vehicle_snapshots` are protected through their parent `vehicle_id`

## Type Sync Note

If schema changes land, regenerate or update `src/types/supabase.ts` in the same change so the codebase does not drift from the migrations.
