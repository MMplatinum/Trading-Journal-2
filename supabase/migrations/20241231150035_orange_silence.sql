/*
  # Fix Storage Policies Type Casting
  
  1. Drops existing policies
  2. Recreates policies with proper UUID casting
  3. Ensures bucket exists with correct configuration
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public viewing of screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to delete" ON storage.objects;

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trade-screenshots',
  'trade-screenshots',
  true,
  524288, -- 512KB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies with proper type casting
CREATE POLICY "Allow public viewing of screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'trade-screenshots');

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'trade-screenshots' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow owners to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = owner::text
);