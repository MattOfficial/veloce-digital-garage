-- Create the service_reminders table
CREATE TABLE IF NOT EXISTS public.service_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    recurring_months INTEGER,
    recurring_distance INTEGER,
    last_completed_date TIMESTAMPTZ,
    last_completed_odometer INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.service_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for user isolation (depends on vehicle's owner)
CREATE POLICY "Users can view service reminders for their vehicles" ON public.service_reminders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = service_reminders.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert service reminders for their vehicles" ON public.service_reminders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = service_reminders.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update service reminders for their vehicles" ON public.service_reminders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = service_reminders.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = service_reminders.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete service reminders for their vehicles" ON public.service_reminders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = service_reminders.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );
