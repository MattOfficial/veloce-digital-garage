ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS current_odometer NUMERIC;

UPDATE public.vehicles
SET current_odometer = COALESCE(current_odometer, baseline_odometer)
WHERE current_odometer IS NULL;

ALTER TABLE public.maintenance_logs
ADD COLUMN IF NOT EXISTS odometer NUMERIC;
