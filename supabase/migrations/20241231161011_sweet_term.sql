/*
  # Fix storage extension and trade balance calculations
  
  1. Changes
    - Properly set up storage extension and bucket
    - Add balance_before_trade column to trades
    - Create function to calculate historical balance
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "storage" 
  WITH SCHEMA storage
  VERSION "1.0";

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
);

CREATE POLICY "Users can delete own screenshots"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trade-screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add balance_before_trade column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'trades' 
    AND column_name = 'balance_before_trade'
  ) THEN
    ALTER TABLE trades ADD COLUMN balance_before_trade DECIMAL(15,2);
  END IF;
END $$;

-- Create or replace function to calculate historical balance
CREATE OR REPLACE FUNCTION get_historical_balance(
  p_account_id UUID,
  p_date TIMESTAMP WITH TIME ZONE
) RETURNS DECIMAL AS $$
DECLARE
  current_balance DECIMAL;
  pl_after_date DECIMAL;
BEGIN
  -- Get current account balance
  SELECT balance INTO current_balance
  FROM accounts
  WHERE id = p_account_id;

  -- Calculate sum of P/L from trades after the given date
  SELECT COALESCE(SUM(
    CASE 
      WHEN realized_pl IS NOT NULL THEN realized_pl
      ELSE (exit_price - entry_price) * quantity * 
           CASE WHEN direction = 'LONG' THEN 1 ELSE -1 END
    END - COALESCE(commission, 0)
  ), 0)
  INTO pl_after_date
  FROM trades
  WHERE account_id = p_account_id
  AND (exit_date || ' ' || exit_time)::TIMESTAMP > p_date;

  -- Historical balance = current balance - profits after date
  RETURN current_balance - pl_after_date;
END;
$$ LANGUAGE plpgsql;