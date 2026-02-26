ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS license_plate TEXT;
ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS engine_type TEXT;
ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS transmission TEXT;
ALTER TABLE public.vehicles Add COLUMN IF NOT EXISTS notes TEXT;

-- Maintenance logs also require user tracking for RLS compatibility if applied later
ALTER TABLE public.maintenance_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);
