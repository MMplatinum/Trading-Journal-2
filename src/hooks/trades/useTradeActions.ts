import { useState } from 'react';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { useAccounts } from '@/hooks/useAccounts';
import { saveTrades, loadTrades } from '@/lib/trades/storage';

export function useTradeActions() {
  const [trades, setTrades] = useState<Trade[]>(() => loadTrades());
  const { updateAccountBalance } = useAccounts();

  const addTrade = (tradeData: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: crypto.randomUUID(),
    };

    const pl = calculateTradePL(newTrade);
    updateAccountBalance(newTrade.accountId, pl);

    const updatedTrades = [...trades, newTrade];
    setTrades(updatedTrades);
    saveTrades(updatedTrades);

    return newTrade;
  };

  const deleteTrade = (id: string) => {
    const trade = trades.find(t => t.id === id);
    if (trade) {
      const pl = calculateTradePL(trade);
      updateAccountBalance(trade.accountId, -pl);

      const updatedTrades = trades.filter(t => t.id !== id);
      setTrades(updatedTrades);
      saveTrades(updatedTrades);
    }
  };

  const updateTrade = (id: string, data: Partial<Trade>) => {
    const oldTrade = trades.find(t => t.id === id);
    if (!oldTrade) return;

    const oldPL = calculateTradePL(oldTrade);
    const newTrade = { ...oldTrade, ...data };
    const newPL = calculateTradePL(newTrade);
    const plDifference = newPL - oldPL;

    updateAccountBalance(oldTrade.accountId, plDifference);

    const updatedTrades = trades.map(trade =>
      trade.id === id ? { ...trade, ...data } : trade
    );
    setTrades(updatedTrades);
    saveTrades(updatedTrades);
  };

  return {
    trades,
    addTrade,
    deleteTrade,
    updateTrade,
  };
}