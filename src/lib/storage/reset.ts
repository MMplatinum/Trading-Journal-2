import { supabase } from '@/lib/supabase/client';
import { STORAGE_KEYS } from './keys';
import { getUserStorageKey } from './utils';

export async function resetAllData(userId?: string) {
  if (!userId) {
    throw new Error('User ID is required to reset data');
  }

  try {
    // Reset data in Supabase
    const { error } = await supabase.rpc('reset_user_data', {
      p_user_id: userId
    });

    if (error) throw error;

    // Clear local storage for this user
    Object.values(STORAGE_KEYS).forEach(key => {
      const userKey = getUserStorageKey(userId, key);
      localStorage.removeItem(userKey);
    });

    // Force reload the page to reset all state
    window.location.reload();
  } catch (error) {
    console.error('Error resetting data:', error);
    throw error;
  }
}