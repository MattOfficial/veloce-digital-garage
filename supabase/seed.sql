-- Seed file for initial logic.
-- NOTE: In a real Supabase environment with RLS, you should associate these with a real user UUID. 
-- Since we do not have an auth user ID yet, you need to replace 'YOUR_USER_UUID' below with a valid auth user ID after signing in,
-- or temporarily disable RLS to insert seed data.

-- Example Seed Logic:
/*
-- 1. Insert Vehicles
INSERT INTO public.vehicles (id, user_id, make, model, year, baseline_odometer)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'YOUR_USER_UUID', 'Datsun', 'Redi-Go 800cc', 2018, 46000),
  ('22222222-2222-2222-2222-222222222222', 'YOUR_USER_UUID', 'Suzuki', 'Avenis', 2022, 5000);

-- 2. Insert Maintenance Logs (Recent "New Tires" maintenance log in February 2026 for both)
INSERT INTO public.maintenance_logs (vehicle_id, date, service_type, cost, notes)
VALUES
  ('11111111-1111-1111-1111-111111111111', '2026-02-15', 'New Tires', 12000, 'Replaced all 4 tires'),
  ('22222222-2222-2222-2222-222222222222', '2026-02-16', 'New Tires', 3000, 'Replaced front and rear tires');
*/
