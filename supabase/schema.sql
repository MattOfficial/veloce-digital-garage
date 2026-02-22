-- Supabase Schema for Fuel & Vehicle Tracking Application

-- 1. Create users table mapping to auth.users
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create vehicles table
CREATE TABLE public.vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    baseline_odometer NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create fuel_logs table
CREATE TABLE public.fuel_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    odometer NUMERIC NOT NULL,
    fuel_volume NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL,
    calculated_efficiency NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create maintenance_logs table
CREATE TABLE public.maintenance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    service_type TEXT NOT NULL,
    cost NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

-- 6. Define RLS Policies

-- users policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- vehicles policies
CREATE POLICY "Users can view their own vehicles"
    ON public.vehicles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles"
    ON public.vehicles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles"
    ON public.vehicles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles"
    ON public.vehicles FOR DELETE
    USING (auth.uid() = user_id);

-- fuel_logs policies
CREATE POLICY "Users can view fuel logs for their vehicles"
    ON public.fuel_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = fuel_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert fuel logs for their vehicles"
    ON public.fuel_logs FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles WHERE id = fuel_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can update fuel logs for their vehicles"
    ON public.fuel_logs FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = fuel_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete fuel logs for their vehicles"
    ON public.fuel_logs FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = fuel_logs.vehicle_id AND user_id = auth.uid()));

-- maintenance_logs policies
CREATE POLICY "Users can view maintenance logs for their vehicles"
    ON public.maintenance_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = maintenance_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert maintenance logs for their vehicles"
    ON public.maintenance_logs FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles WHERE id = maintenance_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can update maintenance logs for their vehicles"
    ON public.maintenance_logs FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = maintenance_logs.vehicle_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete maintenance logs for their vehicles"
    ON public.maintenance_logs FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.vehicles WHERE id = maintenance_logs.vehicle_id AND user_id = auth.uid()));

-- Functions & Triggers (Optional but helpful for auto-creating users)
-- Create a trigger to automatically create a user record when a new auth.user is signed up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
