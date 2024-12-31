import { Trade } from '@/types/trade';

export function calculateTradePL(trade: Trade): number {
  // Calculate raw P/L
  const pl = (trade.exitPrice - trade.entryPrice) * trade.quantity;
  // Subtract commission
  return pl - trade.commission;
}

export function calculateTradeStats(trades: Trade[]) {
  return trades.reduce(
    (acc, trade) => {
      const pl = calculateTradePL(trade);
      if (pl >= 0) {
        acc.totalProfit += pl;
        acc.winCount++;
      } else {
        acc.totalLoss += Math.abs(pl);
        acc.lossCount++;
      }
      return acc;
    },
    { totalProfit: 0, totalLoss: 0, winCount: 0, lossCount: 0 }
  );
}