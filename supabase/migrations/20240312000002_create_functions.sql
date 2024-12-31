-- Create function to safely update account balance
CREATE OR REPLACE FUNCTION update_account_balance(
  p_account_id UUID,
  p_amount DECIMAL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE accounts
  SET balance = balance + p_amount
  WHERE id = p_account_id;
END;
$$;