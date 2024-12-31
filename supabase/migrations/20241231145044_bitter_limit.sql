/*
  # Fix Storage Setup
  
  1. Changes
    - Drops all storage-related objects cleanly
    - Creates schemas in correct order
    - Enables extensions in proper schema
    - Sets up storage with correct ownership
    - Creates bucket with proper configuration
*/

-- Drop everything first
DROP EXTENSION IF EXISTS "storage" CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;
DROP SCHEMA IF EXISTS extensions CASCADE;

-- Create extensions schema
CREATE SCHEMA extensions;

-- Create required extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" 
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgcrypto" 
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgjwt" 
  WITH SCHEMA extensions;

-- Create storage schema owned by postgres
CREATE SCHEMA storage AUTHORIZATION postgres;

-- Enable storage extension in extensions schema
CREATE EXTENSION IF NOT EXISTS "storage"
  WITH SCHEMA extensions;

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO postgres, authenticated, service_role, anon;

-- Grant all privileges on all tables in storage schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO postgres, authenticated, service_role, anon;

-- Grant all privileges on all sequences in storage schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO postgres, authenticated, service_role, anon;

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