import { Trade } from '@/types/trade';
import { calculateTradePL } from './calculations';

interface RiskRewardStats {
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
  winRate: number;
  largestWin: number;
  largestLoss: number;
}

export function calculateRiskRewardStats(trades: Trade[]): RiskRewardStats {
  if (trades.length === 0) {
    return {
      averageWin: 0,
      averageLoss: 0,
      riskRewardRatio: 0,
      winRate: 0,
      largestWin: 0,
      largestLoss: 0,
    };
  }

  const tradesWithPL = trades.map(trade => ({
    trade,
    pl: calculateTradePL(trade),
  }));

  const winningTrades = tradesWithPL.filter(t => t.pl > 0);
  const losingTrades = tradesWithPL.filter(t => t.pl < 0);

  const averageWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + t.pl, 0) / winningTrades.length
    : 0;

  const averageLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pl, 0)) / losingTrades.length
    : 0;

  const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;
  const winRate = winningTrades.length / trades.length;

  const largestWin = winningTrades.length > 0
    ? Math.max(...winningTrades.map(t => t.pl))
    : 0;

  const largestLoss = losingTrades.length > 0
    ? Math.abs(Math.min(...losingTrades.map(t => t.pl)))
    : 0;

  return {
    averageWin,
    averageLoss,
    riskRewardRatio,
    winRate,
    largestWin,
    largestLoss,
  };
}