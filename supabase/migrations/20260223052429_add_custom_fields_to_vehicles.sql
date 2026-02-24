-- Add custom_fields column to vehicles table using JSONB
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Comment for the column
COMMENT ON COLUMN public.vehicles.custom_fields IS 'Stores flexible, user-defined vehicle attributes (e.g., Tire Brand, Mods)';
