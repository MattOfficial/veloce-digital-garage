-- Create Custom Log Categories Table
CREATE TABLE public.custom_log_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color_theme TEXT NOT NULL,
    track_cost BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Note: user_id is checked via RLS so users only interact with their own categories

-- Create Custom Logs Table
CREATE TABLE public.custom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.custom_log_categories(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    cost NUMERIC(10, 2), -- Nullable if track_cost is false
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.custom_log_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_logs ENABLE ROW LEVEL SECURITY;

-- Policies for Custom Log Categories
CREATE POLICY "Users can view their own categories"
    ON public.custom_log_categories
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
    ON public.custom_log_categories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON public.custom_log_categories
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON public.custom_log_categories
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for Custom Logs
-- We verify the log belongs to the user by checking the related vehicle's user_id
CREATE POLICY "Users can view logs for their vehicles"
    ON public.custom_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = custom_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert logs for their vehicles"
    ON public.custom_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = custom_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
        AND
        EXISTS (
             SELECT 1 FROM public.custom_log_categories
             WHERE custom_log_categories.id = custom_logs.category_id
             AND custom_log_categories.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own logs"
    ON public.custom_logs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = custom_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own logs"
    ON public.custom_logs
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.vehicles
            WHERE vehicles.id = custom_logs.vehicle_id
            AND vehicles.user_id = auth.uid()
        )
    );
