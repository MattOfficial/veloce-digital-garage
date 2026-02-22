-- Add the image_url column to vehicles
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create the vehicles storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicles', 'vehicles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'vehicles' bucket
-- Policy for public reading of vehicle images
CREATE POLICY "Public user can read vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicles');

-- Policy for inserting own vehicle images
CREATE POLICY "Users can insert their own vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for updaing own vehicle images
CREATE POLICY "Users can update their own vehicle images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy for deleting own vehicle images
CREATE POLICY "Users can delete their own vehicle images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'vehicles' AND auth.uid()::text = (storage.foldername(name))[1]);
