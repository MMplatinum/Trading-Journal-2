import { supabase } from './client';
import { Transaction } from '@/types/account';

export async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(userId: string, transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      account_id: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      time: transaction.time,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(transactionId: string, transaction: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      account_id: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      time: transaction.time,
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(transactionId: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);

  if (error) throw error;
}