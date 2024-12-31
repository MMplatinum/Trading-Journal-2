-- Create a function to safely reset user data
CREATE OR REPLACE FUNCTION reset_user_data(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all user's trades first (due to foreign key constraints)
  DELETE FROM trades WHERE user_id = p_user_id;
  
  -- Delete all user's transactions
  DELETE FROM transactions WHERE user_id = p_user_id;
  
  -- Delete all user's strategies
  DELETE FROM strategies WHERE user_id = p_user_id;
  
  -- Reset account balances to 0
  UPDATE accounts 
  SET balance = 0 
  WHERE user_id = p_user_id;
END;
$$;