-- Add receipt_url column to maintenance_logs

ALTER TABLE public.maintenance_logs
ADD COLUMN receipt_url TEXT;
