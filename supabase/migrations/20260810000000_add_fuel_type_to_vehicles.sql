-- What a combustion vehicle actually burns.
--
-- `powertrain` only says whether an engine is involved, so every non-electric
-- vehicle was lumped together as "combustion" and a report could not tell a
-- diesel from a petrol. CNG and LPG are included because they are ordinary
-- choices in this market, not exotic ones.
--
-- Nullable on purpose: existing vehicles predate the question and are left
-- unanswered rather than guessed at. Surfaces fall back to naming the
-- powertrain until an owner sets it.
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS fuel_type TEXT;

ALTER TABLE public.vehicles
DROP CONSTRAINT IF EXISTS vehicles_fuel_type_check;

ALTER TABLE public.vehicles
ADD CONSTRAINT vehicles_fuel_type_check
CHECK (fuel_type IS NULL OR fuel_type IN ('petrol', 'diesel', 'cng', 'lpg'));
