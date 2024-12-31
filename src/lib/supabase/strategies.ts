import { supabase } from './client';
import { Strategy } from '@/types/playbook';

export async function fetchStrategies(userId: string) {
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createStrategy(userId: string, strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('strategies')
    .insert([{
      user_id: userId,
      title: strategy.title,
      description: strategy.description,
      rules: strategy.rules,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStrategy(strategyId: string, strategy: Partial<Strategy>) {
  const { data, error } = await supabase
    .from('strategies')
    .update({
      title: strategy.title,
      description: strategy.description,
      rules: strategy.rules,
    })
    .eq('id', strategyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStrategy(strategyId: string) {
  const { error } = await supabase
    .from('strategies')
    .delete()
    .eq('id', strategyId);

  if (error) throw error;
}