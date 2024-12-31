/*
  # Enable Storage Extension
  
  1. Changes
    - Enables the storage extension in the extensions schema
    - Creates the storage schema if it doesn't exist
    - Grants necessary permissions
*/

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Enable storage extension in extensions schema
CREATE EXTENSION IF NOT EXISTS "storage" 
  SCHEMA "extensions"
  VERSION "1.0";

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all tables in storage schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO postgres, anon, authenticated, service_role;

-- Grant all privileges on all sequences in storage schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO postgres, anon, authenticated, service_role;