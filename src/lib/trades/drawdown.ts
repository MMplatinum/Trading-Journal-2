import { Trade } from '@/types/trade';
import { calculateTradePL } from './calculations';

interface DrawdownStats {
  currentDrawdown: number;
  maxDrawdown: number;
}

export function calculateDrawdownStats(trades: Trade[], initialBalance: number): DrawdownStats {
  // Sort trades by date and time
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = new Date(`${a.exitDate} ${a.exitTime}`);
    const dateB = new Date(`${b.exitDate} ${b.exitTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  let peak = initialBalance;
  let currentBalance = initialBalance;
  let maxDrawdown = 0;
  let currentDrawdown = 0;

  // Track balance history to find current drawdown from all-time high
  let allTimePeak = initialBalance;

  sortedTrades.forEach(trade => {
    const pl = calculateTradePL(trade);
    currentBalance += pl;

    // Update all-time peak if we have a new high
    if (currentBalance > allTimePeak) {
      allTimePeak = currentBalance;
    }

    // Calculate current drawdown from all-time peak
    if (currentBalance < allTimePeak) {
      currentDrawdown = ((allTimePeak - currentBalance) / allTimePeak) * 100;
    } else {
      currentDrawdown = 0;
    }

    // Update peak for maximum drawdown calculation
    if (currentBalance > peak) {
      peak = currentBalance;
    } else {
      // Calculate drawdown from local peak
      const drawdown = ((peak - currentBalance) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  });

  return {
    currentDrawdown,
    maxDrawdown
  };
}