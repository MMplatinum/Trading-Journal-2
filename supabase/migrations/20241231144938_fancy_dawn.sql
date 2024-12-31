/*
  # Fix Storage Schema Ownership
  
  1. Changes
    - Drops and recreates storage schema with proper ownership
    - Enables required extensions in correct order
    - Sets proper schema permissions
    - Creates bucket with proper configuration
*/

-- Drop everything first
DROP EXTENSION IF EXISTS "storage" CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable required extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" 
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgcrypto" 
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgjwt" 
  WITH SCHEMA extensions;

-- Create storage schema owned by authenticated role
CREATE SCHEMA storage AUTHORIZATION authenticated;

-- Enable storage extension in storage schema
CREATE EXTENSION IF NOT EXISTS "storage"
  WITH SCHEMA storage;

-- Grant usage on storage schema
GRANT ALL ON SCHEMA storage TO postgres;
GRANT ALL ON SCHEMA storage TO authenticated;
GRANT ALL ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO anon;

-- Create bucket with configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trade-screenshots',
  'trade-screenshots',
  true,
  524288, -- 512KB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can view own screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif'))
  AND LENGTH(name) < 255
);

CREATE POLICY "Users can update own screenshots"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own screenshots"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);