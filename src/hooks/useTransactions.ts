import { useState, useEffect } from 'react';
import { Transaction } from '@/types/account';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import {
  fetchTransactions,
  createTransaction as createTransactionInDb,
  updateTransaction as updateTransactionInDb,
  deleteTransaction as deleteTransactionFromDb,
} from '@/lib/supabase/transactions';

export function useTransactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user?.id]);

  const loadTransactions = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      toast({
        title: 'Error loading transactions',
        description: 'Failed to load your transactions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (!user?.id) return;

    try {
      const newTransaction = await createTransactionInDb(user.id, transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      toast({
        title: 'Error adding transaction',
        description: 'Failed to add transaction. Please try again.',
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
    } catch (error) {
      toast({
        title: 'Error updating transaction',
        description: 'Failed to update transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionFromDb(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      toast({
        title: 'Error deleting transaction',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}