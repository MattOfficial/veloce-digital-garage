ALTER TABLE public.fuel_logs
ADD COLUMN IF NOT EXISTS fill_type text NOT NULL DEFAULT 'full';

UPDATE public.fuel_logs
SET fill_type = 'full'
WHERE fill_type IS NULL;

ALTER TABLE public.fuel_logs
DROP CONSTRAINT IF EXISTS fuel_logs_fill_type_check;

ALTER TABLE public.fuel_logs
ADD CONSTRAINT fuel_logs_fill_type_check
CHECK (fill_type IN ('full', 'partial'));
