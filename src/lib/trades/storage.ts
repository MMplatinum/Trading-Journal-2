import { Trade } from '@/types/trade';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';

export function saveTrades(trades: Trade[]): void {
  saveToStorage(STORAGE_KEYS.TRADES, trades);
}

export function loadTrades(): Trade[] {
  return loadFromStorage<Trade[]>(STORAGE_KEYS.TRADES) || [];
}