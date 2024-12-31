-- Add balance_before_trade column to trades table
ALTER TABLE trades 
ADD COLUMN balance_before_trade DECIMAL(15,2) NOT NULL DEFAULT 0;

-- Update existing trades to use current account balance
-- This is just a placeholder value since we can't retroactively know the balance
UPDATE trades
SET balance_before_trade = (
  SELECT balance 
  FROM accounts 
  WHERE accounts.id = trades.account_id
);