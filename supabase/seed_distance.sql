-- Migration script for adding distance_unit
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS distance_unit TEXT DEFAULT 'km';
