/*
  # Add balance_before_trade column

  1. Changes
    - Add balance_before_trade column to trades table
    - Set default value to 0
    - Make column NOT NULL
    - Update existing trades with current account balance
*/

-- Add balance_before_trade column to trades table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trades' AND column_name = 'balance_before_trade'
  ) THEN
    -- Add the column
    ALTER TABLE trades 
    ADD COLUMN balance_before_trade DECIMAL(15,2) NOT NULL DEFAULT 0;

    -- Update existing trades to use current account balance
    -- This is just a placeholder since we can't retroactively know the exact balance
    UPDATE trades
    SET balance_before_trade = (
      SELECT balance 
      FROM accounts 
      WHERE accounts.id = trades.account_id
    );
  END IF;
END $$;