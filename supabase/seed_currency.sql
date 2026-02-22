-- Migration script for adding Currency
-- Migration: Add currency field to users table

-- 1. Add currency column to public.users defaulting to '₹' (INR)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT '₹';
