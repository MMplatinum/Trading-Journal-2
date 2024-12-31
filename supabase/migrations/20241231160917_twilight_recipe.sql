/*
  # Add balance_before_trade column to trades table
  
  1. Changes
    - Add balance_before_trade column to trades table
    - Create function to calculate historical balance
    - Update existing trades with historical balances
*/

-- Add balance_before_trade column
ALTER TABLE trades ADD COLUMN IF NOT EXISTS balance_before_trade DECIMAL(15,2);

-- Create function to calculate historical balance
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

-- Update existing trades with historical balances
UPDATE trades t
SET balance_before_trade = get_historical_balance(
  t.account_id,
  (t.entry_date || ' ' || t.entry_time)::TIMESTAMP
);

-- Make column NOT NULL after populating data
ALTER TABLE trades ALTER COLUMN balance_before_trade SET NOT NULL;