-- Create the structured documents table to link physical files to vehicles
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,          -- Path within the storage bucket
    file_name TEXT NOT NULL,
    content_type TEXT,
    size_bytes BIGINT,
    maintenance_log_id UUID REFERENCES public.maintenance_logs(id) ON DELETE SET NULL, -- Optional link to a specific log entry if auto-extracted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Database Policies for Documents
CREATE POLICY "Users can view docs for their vehicles" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = documents.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert docs for their vehicles" ON public.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = documents.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete docs for their vehicles" ON public.documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.vehicles 
            WHERE vehicles.id = documents.vehicle_id 
            AND vehicles.user_id = auth.uid()
        )
    );


-- Storage Bucket creation (if we were running via the Supabase Dashboard SQL editor). 
-- This ensures 'vehicle-documents' exists as a bucket.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('vehicle-documents', 'vehicle-documents', false, 5242880, '{image/jpeg,image/png,image/webp,application/pdf}')
ON CONFLICT (id) DO NOTHING;

-- Storage bucket RLS policies for vehicle-documents
CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'vehicle-documents' AND
    -- Ideally we'd enforce the auth.uid() prefixing the file path here, but for simplicity we rely on the DB tier
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to read their own documents" ON storage.objects
FOR SELECT TO authenticated USING (
    bucket_id = 'vehicle-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own documents" ON storage.objects
FOR DELETE TO authenticated USING (
    bucket_id = 'vehicle-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
