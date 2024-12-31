import { Trade } from '@/types/trade';

export function filterTradesByAccount(trades: Trade[], selectedAccountId: string): Trade[] {
  return selectedAccountId === 'all' 
    ? trades 
    : trades.filter(trade => trade.accountId === selectedAccountId);
}

export function sortTradesByDate(trades: Trade[]): Trade[] {
  return [...trades].sort((a, b) => {
    const dateA = new Date(`${a.exitDate} ${a.exitTime}`);
    const dateB = new Date(`${b.exitDate} ${b.exitTime}`);
    return dateA.getTime() - dateB.getTime();
  });
}