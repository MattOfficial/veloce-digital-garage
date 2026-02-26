-- Migration: Convert Custom Trackers to be Vehicle-Specific instead of User-Specific

-- 1. Drop dependent policies first before altering columns
DROP POLICY IF EXISTS "Users can view their own categories" ON custom_log_categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON custom_log_categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON custom_log_categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON custom_log_categories;

-- This policy explicitly checked custom_log_categories.user_id = auth.uid()
DROP POLICY IF EXISTS "Users can insert logs for their vehicles" ON custom_logs;

-- 2. Optional step to clear out existing disconnected trackers (Destructive, but safe for early dev)
DELETE FROM custom_log_categories;

-- 3. Add vehicle_id reference to custom_log_categories
ALTER TABLE custom_log_categories
ADD COLUMN vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL;

-- 4. Drop the old user_id column
ALTER TABLE custom_log_categories
DROP COLUMN user_id;

-- 5. Re-create RLS Policies for custom_log_categories to check ownership through vehicles table
-- SELECT POLICY
CREATE POLICY "Users can view custom categories of their vehicles"
ON custom_log_categories FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM vehicles 
    WHERE vehicles.id = custom_log_categories.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- INSERT POLICY
CREATE POLICY "Users can insert custom categories to their vehicles"
ON custom_log_categories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM vehicles 
    WHERE vehicles.id = vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- UPDATE POLICY
CREATE POLICY "Users can update custom categories of their vehicles"
ON custom_log_categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM vehicles 
    WHERE vehicles.id = custom_log_categories.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM vehicles 
    WHERE vehicles.id = vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- DELETE POLICY
CREATE POLICY "Users can delete custom categories of their vehicles"
ON custom_log_categories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM vehicles 
    WHERE vehicles.id = custom_log_categories.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- 6. Re-create the dependent custom_logs policy
CREATE POLICY "Users can insert logs for their vehicles"
ON custom_logs FOR INSERT
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
         AND EXISTS (
             SELECT 1 FROM public.vehicles
             WHERE vehicles.id = custom_log_categories.vehicle_id
             AND vehicles.user_id = auth.uid()
         )
    )
);
