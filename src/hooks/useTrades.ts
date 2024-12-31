import { useState, useEffect } from 'react';
import { Trade, TradeFormData } from '@/types/trade';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { playSuccessSound, playDeleteSound } from '@/lib/utils/sound';
import {
  fetchTrades,
  createTrade,
  updateTrade as updateTradeInDb,
  deleteTrade as deleteTradeFromDb,
  deleteTrades as deleteTradesFromDb,
} from '@/lib/supabase/trades';

export function useTrades() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Load trades on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadTrades();
    } else {
      setTrades([]);
    }
  }, [user?.id]);

  const loadTrades = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchTrades(user.id);
      setTrades(data || []);
    } catch (error) {
      console.error('Error loading trades:', error);
      toast({
        title: 'Error loading trades',
        description: 'Failed to load your trades. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTrade = async (tradeData: TradeFormData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add trades.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newTrade = await createTrade(user.id, tradeData);
      if (newTrade) {
        setTrades(prev => [...prev, newTrade]);
        await loadTrades(); // Reload to get updated account balances
        playSuccessSound(); // Play success sound
      }
      return newTrade;
    } catch (error) {
      console.error('Error adding trade:', error);
      toast({
        title: 'Error adding trade',
        description: 'Failed to add trade. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteTrade = async (id: string) => {
    if (!user?.id) return;

    try {
      await deleteTradeFromDb(id);
      setTrades(prev => prev.filter(t => t.id !== id));
      await loadTrades(); // Reload to get updated account balances
      playDeleteSound(); // Play delete sound
      toast({
        title: 'Trade deleted',
        description: 'The trade has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: 'Error deleting trade',
        description: 'Failed to delete trade. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteTrades = async (ids: string[]) => {
    if (!user?.id) return;

    try {
      await deleteTradesFromDb(ids);
      setTrades(prev => prev.filter(trade => !ids.includes(trade.id)));
      await loadTrades(); // Reload to get updated account balances
      toast({
        title: 'Trades deleted',
        description: `${ids.length} trades have been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting trades:', error);
      toast({
        title: 'Error deleting trades',
        description: 'Failed to delete trades. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateTrade = async (id: string, data: Partial<Trade>) => {
    if (!user?.id) return;

    try {
      const updatedTrade = await updateTradeInDb(id, data);
      if (updatedTrade) {
        setTrades(prev => prev.map(trade =>
          trade.id === id ? updatedTrade : trade
        ));
        await loadTrades(); // Reload to get updated account balances
      }
    } catch (error) {
      console.error('Error updating trade:', error);
      toast({
        title: 'Error updating trade',
        description: 'Failed to update trade. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    trades,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    deleteTrades,
  };
}