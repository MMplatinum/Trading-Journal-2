import { useState, useEffect } from 'react';
import { Strategy } from '@/types/playbook';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import {
  fetchStrategies,
  createStrategy as createStrategyInDb,
  updateStrategy as updateStrategyInDb,
  deleteStrategy as deleteStrategyFromDb,
} from '@/lib/supabase/strategies';

export function usePlaybook() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStrategies();
    }
  }, [user?.id]);

  const loadStrategies = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchStrategies(user.id);
      setStrategies(data);
    } catch (error) {
      toast({
        title: 'Error loading strategies',
        description: 'Failed to load your strategies. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addStrategy = async (strategyData: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) return;

    try {
      const newStrategy = await createStrategyInDb(user.id, strategyData);
      setStrategies(prev => [...prev, newStrategy]);
      return newStrategy;
    } catch (error) {
      toast({
        title: 'Error adding strategy',
        description: 'Failed to add strategy. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateStrategy = async (id: string, data: Partial<Strategy>) => {
    try {
      const updatedStrategy = await updateStrategyInDb(id, data);
      setStrategies(prev => prev.map(strategy =>
        strategy.id === id ? updatedStrategy : strategy
      ));
    } catch (error) {
      toast({
        title: 'Error updating strategy',
        description: 'Failed to update strategy. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteStrategy = async (id: string) => {
    try {
      await deleteStrategyFromDb(id);
      setStrategies(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      toast({
        title: 'Error deleting strategy',
        description: 'Failed to delete strategy. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    strategies,
    loading,
    addStrategy,
    updateStrategy,
    deleteStrategy,
  };
}