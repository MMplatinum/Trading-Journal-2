import { Trade } from '@/types/trade';

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

export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const winners = trades.filter(trade => calculateTradePL(trade) > 0);
  return (winners.length / trades.length) * 100;
}

export function calculateProfitFactor(trades: Trade[]): number {
  const profits = trades.reduce((sum, trade) => {
    const pl = calculateTradePL(trade);
    return sum + (pl > 0 ? pl : 0);
  }, 0);

  const losses = trades.reduce((sum, trade) => {
    const pl = calculateTradePL(trade);
    return sum + (pl < 0 ? Math.abs(pl) : 0);
  }, 0);

  return losses === 0 ? profits : profits / losses;
}