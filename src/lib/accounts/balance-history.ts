import { Trade } from '@/types/trade';
import { Account, Transaction } from '@/types/account';

export interface BalanceEvent {
  timestamp: number;
  type: 'trade' | 'transaction';
  amount: number;
  accountId: string;
  id?: string;
}

/**
 * Calculates historical balances for each trade by tracking all balance-affecting events
 * @param trades List of all trades
 * @param transactions List of all transactions
 * @param accounts List of all accounts
 * @returns Map of trade IDs to account balances before each trade
 */
export function calculateHistoricalBalances(
  trades: Trade[],
  transactions: Transaction[],
  accounts: Account[]
): Map<string, number> {
  // Convert trades and transactions to balance events
  const events: BalanceEvent[] = [
    ...trades.map(trade => ({
      timestamp: new Date(`${trade.exitDate} ${trade.exitTime}`).getTime(),
      type: 'trade' as const,
      amount: calculateTradePL(trade),
      accountId: trade.accountId,
      id: trade.id,
    })),
    ...transactions.map(tx => ({
      timestamp: new Date(`${tx.date} ${tx.time}`).getTime(),
      type: 'transaction' as const,
      amount: tx.type === 'deposit' ? tx.amount : -tx.amount,
      accountId: tx.accountId,
    })),
  ].sort((a, b) => a.timestamp - b.timestamp); // Sort in ascending order
  
  // Initialize balances map with initial account balances
  const balancesByTradeId = new Map<string, number>();
  const currentBalances = new Map(accounts.map(acc => [acc.id, acc.balance]));

  // Calculate historical balances
  events.forEach(event => {
    const currentBalance = currentBalances.get(event.accountId) || 0;

    // For trades, store balance BEFORE the trade
    if (event.type === 'trade' && event.id) {
      balancesByTradeId.set(event.id, currentBalance);
    }

    // Update running balance
    currentBalances.set(event.accountId, currentBalance + event.amount);
  });

  return balancesByTradeId;
}

function calculateTradePL(trade: Trade): number {
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