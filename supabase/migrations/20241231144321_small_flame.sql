/*
  # Fix Storage Extension Setup
  
  1. Changes
    - Drops existing storage extension
    - Creates storage schema
    - Enables required extensions in correct order
    - Enables storage extension in storage schema
    - Sets up storage permissions
*/

-- Drop existing storage extension if it exists
DROP EXTENSION IF EXISTS "storage";

-- Create storage schema
CREATE SCHEMA IF NOT EXISTS storage;

-- Enable required extensions in correct order
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgcrypto"
  WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS "pgjwt"
  WITH SCHEMA extensions;

-- Enable storage extension in storage schema
CREATE EXTENSION IF NOT EXISTS "storage"
  WITH SCHEMA storage;

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables in storage schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all sequences in storage schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO postgres, anon, authenticated, service_role;