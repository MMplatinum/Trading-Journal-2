import { useState, useEffect } from 'react';
import { Account, Transaction } from '@/types/account';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { playSuccessSound, playDeleteSound } from '@/lib/utils/sound';
import {
  fetchAccounts,
  createAccount as createAccountInDb,
  updateAccount as updateAccountInDb,
  deleteAccount as deleteAccountFromDb,
} from '@/lib/supabase/accounts';
import {
  fetchTransactions,
  createTransaction as createTransactionInDb,
  updateTransaction as updateTransactionInDb,
  deleteTransaction as deleteTransactionFromDb,
} from '@/lib/supabase/transactions';

export function useAccounts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAccounts();
      loadTransactions();
    }
  }, [user?.id]);

  const loadAccounts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchAccounts(user.id);
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: 'Error loading accounts',
        description: 'Failed to load your accounts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user?.id) return;
    
    try {
      const data = await fetchTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: 'Error loading transactions',
        description: 'Failed to load your transactions. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAccount = async (accountData: Omit<Account, 'id'>) => {
    if (!user?.id) return;

    try {
      const newAccount = await createAccountInDb(user.id, accountData);
      setAccounts(prev => [...prev, newAccount]);
      toast({
        title: 'Account Added',
        description: 'Your account has been successfully created.',
      });
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: 'Error adding account',
        description: 'Failed to add account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!user?.id) return;

    try {
      const newTransaction = await createTransactionInDb(user.id, transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      await loadAccounts(); // Reload accounts to get updated balances
      playSuccessSound(); // Play success sound
      toast({
        title: 'Transaction Added',
        description: 'Your transaction has been successfully recorded.',
      });
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error adding transaction',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateAccount = async (id: string, data: Partial<Account>) => {
    try {
      const updatedAccount = await updateAccountInDb(id, data);
      setAccounts(prev => prev.map(account =>
        account.id === id ? updatedAccount : account
      ));
      toast({
        title: 'Account Updated',
        description: 'Your account has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error updating account',
        description: 'Failed to update account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await deleteAccountFromDb(id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error deleting account',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionFromDb(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      playDeleteSound();
      await loadAccounts(); // Reload accounts to get updated balances
      toast({
        title: 'Transaction Deleted',
        description: 'The transaction has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error deleting transaction',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const updatedTransaction = await updateTransactionInDb(id, data);
      setTransactions(prev => prev.map(transaction =>
        transaction.id === id ? updatedTransaction : transaction
      ));
      await loadAccounts(); // Reload accounts to get updated balances
      toast({
        title: 'Transaction Updated',
        description: 'The transaction has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error updating transaction',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    accounts,
    transactions,
    loading,
    addAccount,
    addTransaction,
    updateAccount,
    deleteAccount,
    deleteTransaction,
    updateTransaction,
  };
}