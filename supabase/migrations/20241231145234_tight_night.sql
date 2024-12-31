/*
  # Fix Storage Setup with Minimal Configuration
  
  1. Changes
    - Drops existing storage setup
    - Creates schemas with correct ownership
    - Enables extensions in public schema
    - Sets up minimal storage configuration
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

-- Create minimal bucket configuration
INSERT INTO storage.buckets (id, name)
VALUES ('trade-screenshots', 'trade-screenshots')
ON CONFLICT (id) DO NOTHING;

-- Create basic storage policies
CREATE POLICY "Allow authenticated users to select their own objects"
ON storage.objects FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to insert their own objects"
ON storage.objects FOR INSERT 
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to update their own objects"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to delete their own objects"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);