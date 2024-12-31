-- Add balance_before_trade column to trades table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'trades' 
    AND column_name = 'balance_before_trade'
  ) THEN
    -- Add the column
    ALTER TABLE trades 
    ADD COLUMN balance_before_trade DECIMAL(15,2);

    -- Update existing trades to use current account balance
    -- This is just a placeholder since we can't retroactively know the exact balance
    UPDATE trades t
    SET balance_before_trade = (
      SELECT balance 
      FROM accounts a
      WHERE a.id = t.account_id
    );

    -- Now make it NOT NULL after populating data
    ALTER TABLE trades
    ALTER COLUMN balance_before_trade SET NOT NULL;
  END IF;
END $$;