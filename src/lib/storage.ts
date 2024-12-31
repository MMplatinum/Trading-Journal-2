import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEYS = {
  ACCOUNTS: 'tj_accounts',
  TRANSACTIONS: 'tj_transactions', 
  TRADES: 'tj_trades',
  DASHBOARD_METRICS: 'dashboard_metrics',
  DASHBOARD_LAYOUT: 'dashboard_layout',
} as const;

// Helper to get user-specific storage key
function getUserStorageKey(userId: string, key: string): string {
  return `${userId}_${key}`;
}

export function saveToStorage<T>(key: string, data: T, userId?: string): void {
  try {
    const storageKey = userId ? getUserStorageKey(userId, key) : key;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, userId?: string): T | null {
  try {
    const storageKey = userId ? getUserStorageKey(userId, key) : key;
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

export function resetAllData(userId?: string): void {
  if (userId) {
    // Clear only user-specific data
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(getUserStorageKey(userId, key));
    });
  } else {
    // Clear all data (should only be used for development/testing)
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  window.location.reload();
}

export { STORAGE_KEYS };