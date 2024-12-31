import { Trade } from '@/types/trade';
import { differenceInMinutes } from 'date-fns';

export function calculateAverageHoldingTime(trades: Trade[]): string {
  if (trades.length === 0) return '0m';

  const totalMinutes = trades.reduce((sum, trade) => {
    const entryTime = new Date(`${trade.entryDate} ${trade.entryTime}`);
    const exitTime = new Date(`${trade.exitDate} ${trade.exitTime}`);
    return sum + differenceInMinutes(exitTime, entryTime);
  }, 0);

  const averageMinutes = totalMinutes / trades.length;

  // Convert to hours and minutes if more than 60 minutes
  if (averageMinutes >= 60) {
    const hours = Math.floor(averageMinutes / 60);
    const minutes = Math.round(averageMinutes % 60);
    return `${hours}h ${minutes}m`;
  }

  return `${Math.round(averageMinutes)}m`;
}

export function calculateAverageTradesPerDay(trades: Trade[]): string {
  if (trades.length === 0) return '0';

  // Get unique trading days
  const tradingDays = new Set(trades.map(trade => trade.entryDate));
  const numTradingDays = tradingDays.size;

  if (numTradingDays === 0) return '0';

  const average = trades.length / numTradingDays;
  return average.toFixed(1);
}