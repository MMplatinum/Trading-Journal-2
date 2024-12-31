import { supabase } from './client';
import { Account } from '@/types/account';

export async function fetchAccounts(userId: string) {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function createAccount(userId: string, account: Omit<Account, 'id'>) {
  const { data, error } = await supabase
    .from('accounts')
    .insert([{
      user_id: userId,
      name: account.name,
      number: account.number,
      balance: account.balance,
      currency: account.currency,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAccount(accountId: string, account: Partial<Account>) {
  const { data, error } = await supabase
    .from('accounts')
    .update({
      name: account.name,
      number: account.number,
      balance: account.balance,
      currency: account.currency,
    })
    .eq('id', accountId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAccount(accountId: string) {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId);

  if (error) throw error;
}