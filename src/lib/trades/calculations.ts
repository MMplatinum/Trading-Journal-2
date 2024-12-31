import { Trade } from '@/types/trade';
import { sortTradesByDate } from '@/lib/metrics/filters';

export function calculateTradePL(trade: Trade): number {
  if (trade.realizedPL !== undefined) {
    return trade.realizedPL - (trade.commission || 0);
  }

  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    const multiplier = trade.direction === 'LONG' ? 1 : -1;
    const rawPL = (trade.exitPrice - trade.entryPrice) * trade.quantity * multiplier;
    return rawPL - (trade.commission || 0);
  }

  return 0;
}

/**
 * Calculates the P/L percentage based on the trade's P/L and account balance before the trade
 * @param pl The profit/loss amount of the trade
 * @param balanceBeforeTrade The account balance before the trade was executed
 * @returns The P/L percentage, rounded to 2 decimal places
 */
export function calculatePLPercentage(pl: number, balanceBeforeTrade: number): number {
  if (balanceBeforeTrade <= 0) return 0;
  return (pl / balanceBeforeTrade) * 100;
}

interface CumulativePLResult {
}

export function calculateCumulativePL(trades: Trade[]): CumulativePLResult {
  const sortedTrades = sortTradesByDate(trades);

  let data = [{
    index: 0,
    pl: 0,
    date: 'Start'
  }];

  let runningPL = 0;
  sortedTrades.forEach((trade, idx) => {
    const pl = calculateTradePL(trade);
    runningPL += pl;
    data.push({
      index: idx + 1,
      pl: runningPL,
      date: `${trade.exitDate} ${trade.exitTime}`
    });
  });

  const values = data.map(d => d.pl);
  return {
    data,
    minValue: Math.min(0, ...values),
    maxValue: Math.max(0, ...values)
  };
}