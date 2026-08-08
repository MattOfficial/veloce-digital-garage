-- Charge sessions become real logged events with a real tariff.
-- See docs/ev-charging-redesign.md.
--
-- The cost columns follow the four OCPI tariff dimensions, which is the format
-- charging networks already have to express their prices in to bill each other
-- across borders. Every pricing model seen in the wild — tiered by power,
-- time-of-use, dynamic, membership, free — decomposes into these four plus a
-- tax rate, so the taxonomy is closed rather than a guess at what comes next.
--
--   ENERGY        -> fuel_volume (kWh) x rate_per_unit
--   TIME          -> duration_minutes  x rate_per_unit
--   PARKING_TIME  -> idle_minutes      x idle_rate_per_minute
--   FLAT          -> session_fee
--
-- total_cost stays authoritative. Rate x quantity is a convenience calculator
-- in the UI; whatever exotic tariff a network invents, the owner knows what
-- they actually paid, and every cost metric reads total_cost.

ALTER TABLE public.fuel_logs
    ADD COLUMN IF NOT EXISTS pricing_mode TEXT,
    ADD COLUMN IF NOT EXISTS rate_per_unit NUMERIC,
    ADD COLUMN IF NOT EXISTS duration_minutes NUMERIC,
    ADD COLUMN IF NOT EXISTS session_fee NUMERIC,
    ADD COLUMN IF NOT EXISTS idle_minutes NUMERIC,
    ADD COLUMN IF NOT EXISTS idle_rate_per_minute NUMERIC,
    ADD COLUMN IF NOT EXISTS tax_percent NUMERIC,
    -- The efficiency anchor for sessions logged without state of charge. With
    -- SoC on both ends we need no anchor at all; without it this is the only
    -- repeatable reference point, exactly as a full tank is for petrol.
    ADD COLUMN IF NOT EXISTS charged_to_full BOOLEAN,
    -- Metered kWh includes charging losses, SoC-derived kWh does not. They are
    -- different denominators and produce different efficiency figures, so a row
    -- has to say which one it can feed.
    ADD COLUMN IF NOT EXISTS energy_basis TEXT;

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_pricing_mode_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_pricing_mode_check
    CHECK (pricing_mode IS NULL OR pricing_mode IN ('per_kwh', 'per_minute', 'flat', 'free'));

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_energy_basis_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_energy_basis_check
    CHECK (energy_basis IS NULL OR energy_basis IN ('metered', 'soc_derived'));

ALTER TABLE public.fuel_logs
    DROP CONSTRAINT IF EXISTS fuel_logs_charge_quantities_check;

ALTER TABLE public.fuel_logs
    ADD CONSTRAINT fuel_logs_charge_quantities_check
    CHECK (
        (rate_per_unit IS NULL OR rate_per_unit >= 0)
        AND (duration_minutes IS NULL OR duration_minutes > 0)
        AND (session_fee IS NULL OR session_fee >= 0)
        AND (idle_minutes IS NULL OR idle_minutes >= 0)
        AND (idle_rate_per_minute IS NULL OR idle_rate_per_minute >= 0)
        AND (tax_percent IS NULL OR (tax_percent >= 0 AND tax_percent <= 100))
    );

-- Backfill. Existing charge rows carry kWh and a total, which is per_kwh by
-- construction; a zero total is a free session. The unit rate is recoverable
-- from what is already stored, so no history is lost.
UPDATE public.fuel_logs
SET
    pricing_mode = CASE WHEN total_cost > 0 THEN 'per_kwh' ELSE 'free' END,
    energy_basis = CASE
        WHEN start_soc IS NOT NULL AND end_soc IS NOT NULL AND fuel_volume IS NULL
            THEN 'soc_derived'
        ELSE 'metered'
    END,
    rate_per_unit = CASE
        WHEN total_cost > 0 AND fuel_volume > 0 THEN total_cost / fuel_volume
        ELSE NULL
    END,
    charged_to_full = CASE WHEN end_soc >= 98 THEN TRUE ELSE FALSE END
WHERE energy_type = 'charge' AND pricing_mode IS NULL;

-- is_estimated narrows to its real meaning: a row the app generated for a
-- period with nothing logged in it, never a row the user typed. The old design
-- inferred home charging wholesale, so anything already flagged was ours.
COMMENT ON COLUMN public.fuel_logs.is_estimated IS
    'True only for app-generated cold-start rows. User-entered sessions are always false.';

-- Home charging is now logged like any other session, so the user-level tariff
-- stops being the source of truth for cost and becomes a default the charge
-- form prefills. Kept, not dropped, for exactly that reason.
COMMENT ON COLUMN public.users.electricity_tariff_per_kwh IS
    'Default per-unit rate prefilled into the home charge form. Not used to infer cost.';

CREATE INDEX IF NOT EXISTS fuel_logs_charge_session_idx
    ON public.fuel_logs (vehicle_id, energy_type, date, odometer);
