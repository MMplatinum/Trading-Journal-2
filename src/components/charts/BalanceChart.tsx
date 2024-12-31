import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { calculateTradePL } from '@/lib/trades/calculations';
import { sortTradesByDate } from '@/lib/metrics/filters';
import { filterTradesByAccount } from '@/lib/metrics/filters';
import { BaseChart } from './BaseChart';
import { ChartDataPoint } from '@/lib/charts/types';

interface BalanceChartProps {
  trades: Trade[];
  accounts: Account[];
  selectedAccountId: string;
  className?: string;
}

export function BalanceChart({ trades, accounts, selectedAccountId, className }: BalanceChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);

    const initialBalance = selectedAccountId === 'all'
      ? accounts.reduce((sum, account) => sum + account.balance, 0)
      : accounts.find(a => a.id === selectedAccountId)?.balance || 0;

    const totalPL = sortedTrades.reduce((sum, trade) => sum + calculateTradePL(trade), 0);
    const startingBalance = initialBalance - totalPL;

    let data: ChartDataPoint[] = [{
      index: 0,
      value: startingBalance,
      date: 'Start'
    }];

    let runningBalance = startingBalance;
    sortedTrades.forEach((trade, idx) => {
      const pl = calculateTradePL(trade);
      runningBalance += pl;
      data.push({
        index: idx + 1,
        value: runningBalance,
        date: `${trade.entryDate} ${trade.entryTime}`
      });
    });

    return data;
  }, [trades, accounts, selectedAccountId]);

  return (
    <BaseChart
      data={chartData}
      config={{
        title: 'Account Balance History',
        valueKey: 'value',
        valueLabel: 'Balance',
        gradientId: 'balance-gradient'
      }}
      className={className}
    />
  );
}