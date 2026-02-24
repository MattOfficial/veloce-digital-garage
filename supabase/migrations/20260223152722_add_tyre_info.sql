-- Add tyre_info column to vehicles table to store tire installation data
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS tyre_info JSONB DEFAULT null;
