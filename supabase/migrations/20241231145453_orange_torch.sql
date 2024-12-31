/*
  # Update Storage Configuration
  
  1. Changes
    - Makes bucket public explicitly
    - Adds file size and type restrictions
    - Updates policies for better security
*/

-- Drop everything first
DROP EXTENSION IF EXISTS "storage" CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;

-- Create storage schema owned by postgres
CREATE SCHEMA storage;
ALTER SCHEMA storage OWNER TO postgres;

-- Enable required extensions in public schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

-- Enable storage extension in public schema
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA public;

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO service_role;

-- Create bucket with explicit public access and restrictions
INSERT INTO storage.buckets (
  id, 
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'trade-screenshots',
  'trade-screenshots',
  true, -- Explicitly public
  524288, -- 512KB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies with user isolation
CREATE POLICY "Allow authenticated users to select their own objects"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trade-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow authenticated users to insert their own objects"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'trade-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif'))
  AND LENGTH(name) < 255
);

CREATE POLICY "Allow authenticated users to update their own objects"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'trade-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow authenticated users to delete their own objects"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trade-screenshots'
  AND auth.uid()::text = (storage.foldername(name))[1]
);