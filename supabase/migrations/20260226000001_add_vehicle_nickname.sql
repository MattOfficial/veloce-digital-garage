-- Migration to add nickname to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS nickname TEXT;
