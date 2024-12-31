/*
  # Fix P/L percentage calculation

  1. Changes
    - Add balance_before_trade column to trades table
    - Create function to calculate historical balance
    - Update existing trades with correct historical balances
    
  2. Notes
    - Calculates balance at trade entry time by subtracting all P/L after that time
    - Handles both direct P/L and calculated P/L from prices
*/

-- Drop and recreate balance_before_trade column to ensure clean state
ALTER TABLE trades DROP COLUMN IF EXISTS balance_before_trade;
ALTER TABLE trades ADD COLUMN balance_before_trade DECIMAL(15,2);

-- Create function to calculate historical balance at a given time
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

-- Update existing trades with correct historical balances
UPDATE trades t
SET balance_before_trade = get_historical_balance(
  t.account_id,
  (t.entry_date || ' ' || t.entry_time)::TIMESTAMP
);

-- Make column NOT NULL after populating data
ALTER TABLE trades ALTER COLUMN balance_before_trade SET NOT NULL;