-- EV redesign: SoC-based tracking replaces the ICE full-tank method for electric vehicles.
-- See docs/ev-redesign.md for the rationale.

-- 1. Vehicle state snapshots.
-- Backbone of EV analytics: two snapshots with no charge between them yield km per %SoC.
-- soc_percent is nullable so this table also serves ICE vehicles as a plain odometer update.
CREATE TABLE IF NOT EXISTS public.vehicle_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    odometer NUMERIC NOT NULL,
    soc_percent NUMERIC,
    displayed_range NUMERIC,
    source TEXT NOT NULL DEFAULT 'manual',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT vehicle_snapshots_soc_range CHECK (
        soc_percent IS NULL OR (soc_percent >= 0 AND soc_percent <= 100)
    ),
    CONSTRAINT vehicle_snapshots_source_check CHECK (source IN ('manual', 'ocr', 'api')),
    CONSTRAINT vehicle_snapshots_odometer_positive CHECK (odometer >= 0)
);

CREATE INDEX IF NOT EXISTS vehicle_snapshots_vehicle_date_idx
    ON public.vehicle_snapshots (vehicle_id, date, odometer);

ALTER TABLE public.vehicle_snapshots ENABLE ROW LEVEL SECURITY;

-- Postgres has no CREATE POLICY IF NOT EXISTS, so drop first to keep this
-- migration safe to re-run after a partial apply.
DROP POLICY IF EXISTS "Users can view snapshots for their vehicles" ON public.vehicle_snapshots;
DROP POLICY IF EXISTS "Users can insert snapshots for their vehicles" ON public.vehicle_snapshots;
DROP POLICY IF EXISTS "Users can update snapshots for their vehicles" ON public.vehicle_snapshots;
DROP POLICY IF EXISTS "Users can delete snapshots for their vehicles" ON public.vehicle_snapshots;

CREATE POLICY "Users can view snapshots for their vehicles" ON public.vehicle_snapshots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = vehicle_snapshots.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert snapshots for their vehicles" ON public.vehicle_snapshots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = vehicle_snapshots.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update snapshots for their vehicles" ON public.vehicle_snapshots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = vehicle_snapshots.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = vehicle_snapshots.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete snapshots for their vehicles" ON public.vehicle_snapshots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = vehicle_snapshots.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

-- 2. Vehicle EV attributes.
-- usable_battery_kwh is distinct from the rated battery_capacity_kwh: usable is what the
-- pack actually delivers between 100% and 0% indicated, and it is the correct denominator
-- for Wh/km. baseline_range_km is the measured usable range early in ownership and acts as
-- the denominator for state-of-health.
ALTER TABLE public.vehicles
    ADD COLUMN IF NOT EXISTS usable_battery_kwh NUMERIC,
    ADD COLUMN IF NOT EXISTS rated_range_km NUMERIC,
    ADD COLUMN IF NOT EXISTS baseline_range_km NUMERIC,
    ADD COLUMN IF NOT EXISTS battery_warranty_years INTEGER,
    ADD COLUMN IF NOT EXISTS battery_warranty_km INTEGER;

-- 3. User-level reference rates used to infer home charging cost and savings vs petrol.
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS electricity_tariff_per_kwh NUMERIC,
    ADD COLUMN IF NOT EXISTS petrol_price_reference NUMERIC,
    ADD COLUMN IF NOT EXISTS ice_reference_efficiency NUMERIC,
    ADD COLUMN IF NOT EXISTS ev_efficiency_unit TEXT;

ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_ev_efficiency_unit_check;

ALTER TABLE public.users
    ADD CONSTRAINT users_ev_efficiency_unit_check
    CHECK (ev_efficiency_unit IS NULL OR ev_efficiency_unit IN ('Wh/km', 'km/kWh', 'mi/kWh', 'kWh/100km'));

-- 4. Charge events. Home charging is inferred rather than logged, so a charge row now
-- records where the energy came from and (optionally) the SoC delta it produced.
ALTER TABLE public.fuel_logs
    ADD COLUMN IF NOT EXISTS charge_source TEXT,
    ADD COLUMN IF NOT EXISTS start_soc NUMERIC,
    ADD COLUMN IF NOT EXISTS end_soc NUMERIC,
    ADD COLUMN IF NOT EXISTS is_estimated BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS charger_network TEXT,
    ADD COLUMN IF NOT EXISTS location TEXT;

UPDATE public.fuel_logs
SET charge_source = 'other'
WHERE energy_type = 'charge' AND charge_source IS NULL;

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_charge_source_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_charge_source_check
    CHECK (charge_source IS NULL OR charge_source IN ('home', 'ac_public', 'dc_fast', 'other'));

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_soc_range_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_soc_range_check
    CHECK (
        (start_soc IS NULL OR (start_soc >= 0 AND start_soc <= 100))
        AND (end_soc IS NULL OR (end_soc >= 0 AND end_soc <= 100))
    );

-- 5. fill_type is an ICE concept. Charge rows no longer carry it, so it becomes nullable
-- and the check constraint is relaxed to permit NULL.
ALTER TABLE public.fuel_logs
    ALTER COLUMN fill_type DROP NOT NULL,
    ALTER COLUMN fill_type DROP DEFAULT;

UPDATE public.fuel_logs
SET fill_type = NULL
WHERE energy_type = 'charge';

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_fill_type_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_fill_type_check
    CHECK (fill_type IS NULL OR fill_type IN ('full', 'partial'));
