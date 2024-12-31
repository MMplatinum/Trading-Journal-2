import { MetricConfig } from '@/types/analytics';
import { formatCurrency } from '@/lib/utils';
import { calculateTradePL } from '@/lib/trades/calculations';
import { calculateDrawdownStats } from '@/lib/trades/drawdown';
import { calculateAverageHoldingTime, calculateAverageTradesPerDay } from './calculations';
import { Account } from '@/types/account';
import { Trade } from '@/types/trade';
import { ChartConfig } from '@/types/analytics';

export function getDefaultMetrics(): MetricConfig[] {
  return [
    {
      id: 'account-balance',
      title: 'Account Balance',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], accounts: Account[], selectedAccountId: string) => {
        if (selectedAccountId === 'all') {
          const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
          return formatCurrency(totalBalance, 'USD');
        }
        const account = accounts.find(a => a.id === selectedAccountId);
        return account ? formatCurrency(account.balance, account.currency) : formatCurrency(0, 'USD');
      }
    },
    {
      id: 'total-trades',
      title: 'Total Trades',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all' 
          ? trades 
          : trades.filter(t => t.accountId === selectedAccountId);
        return filteredTrades.length.toString();
      }
    },
    {
      id: 'win-rate',
      title: 'Win Rate',
      enabled: true,
      currentValue: '0%',
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        if (filteredTrades.length === 0) return '0%';
        const winners = filteredTrades.filter(t => calculateTradePL(t) > 0).length;
        return `${((winners / filteredTrades.length) * 100).toFixed(1)}%`;
      }
    },
    {
      id: 'avg-holding-time',
      title: 'Avg Holding Time',
      enabled: true,
      currentValue: '0m',
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        return calculateAverageHoldingTime(filteredTrades);
      }
    },
    {
      id: 'avg-trades-per-day',
      title: 'Avg Trades/Day',
      enabled: true,
      currentValue: '0',
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        return calculateAverageTradesPerDay(filteredTrades);
      }
    },
    {
      id: 'total-pl',
      title: 'Total P/L',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        const total = filteredTrades.reduce((sum, trade) => sum + calculateTradePL(trade), 0);
        return formatCurrency(total, 'USD');
      }
    },
    {
      id: 'profit-factor',
      title: 'Profit Factor',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        
        const profits = filteredTrades.reduce((sum, trade) => {
          const pl = calculateTradePL(trade);
          return sum + (pl > 0 ? pl : 0);
        }, 0);
        
        const losses = filteredTrades.reduce((sum, trade) => {
          const pl = calculateTradePL(trade);
          return sum + (pl < 0 ? Math.abs(pl) : 0);
        }, 0);

        if (losses === 0) return profits > 0 ? '∞' : '0';
        return (profits / losses).toFixed(2);
      }
    },
    {
      id: 'current-drawdown',
      title: 'Current Drawdown',
      enabled: true,
      currentValue: '0%',
      getValue: (trades: Trade[], accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);

        const initialBalance = selectedAccountId === 'all'
          ? accounts.reduce((sum, account) => sum + account.balance, 0)
          : accounts.find(a => a.id === selectedAccountId)?.balance || 0;

        const { currentDrawdown } = calculateDrawdownStats(filteredTrades, initialBalance);
        return `${currentDrawdown.toFixed(2)}%`;
      }
    },
    {
      id: 'max-drawdown',
      title: 'Maximum Drawdown',
      enabled: true,
      currentValue: '0%',
      getValue: (trades: Trade[], accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);

        const initialBalance = selectedAccountId === 'all'
          ? accounts.reduce((sum, account) => sum + account.balance, 0)
          : accounts.find(a => a.id === selectedAccountId)?.balance || 0;

        const { maxDrawdown } = calculateDrawdownStats(filteredTrades, initialBalance);
        return `${maxDrawdown.toFixed(2)}%`;
      }
    },
    {
      id: 'average-win',
      title: 'Average Win',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        const winners = filteredTrades.filter(t => calculateTradePL(t) > 0);
        if (winners.length === 0) return formatCurrency(0, 'USD');
        const total = winners.reduce((sum, trade) => sum + calculateTradePL(trade), 0);
        return formatCurrency(total / winners.length, 'USD');
      }
    },
    {
      id: 'average-loss',
      title: 'Average Loss',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        const losers = filteredTrades.filter(t => calculateTradePL(t) < 0);
        if (losers.length === 0) return formatCurrency(0, 'USD');
        const total = losers.reduce((sum, trade) => sum + Math.abs(calculateTradePL(trade)), 0);
        return formatCurrency(total / losers.length, 'USD');
      }
    },
    {
      id: 'largest-win',
      title: 'Largest Win',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        if (filteredTrades.length === 0) return formatCurrency(0, 'USD');
        const pls = filteredTrades.map(t => calculateTradePL(t));
        const maxPL = Math.max(...pls);
        return formatCurrency(maxPL > 0 ? maxPL : 0, 'USD');
      }
    },
    {
      id: 'largest-loss',
      title: 'Largest Loss',
      enabled: true,
      currentValue: 0,
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        if (filteredTrades.length === 0) return formatCurrency(0, 'USD');
        const pls = filteredTrades.map(t => calculateTradePL(t));
        const minPL = Math.min(...pls);
        return formatCurrency(minPL < 0 ? Math.abs(minPL) : 0, 'USD');
      }
    },
    {
      id: 'risk-reward',
      title: 'Risk/Reward Ratio',
      enabled: true,
      currentValue: '0',
      getValue: (trades: Trade[], _accounts: Account[], selectedAccountId: string) => {
        const filteredTrades = selectedAccountId === 'all'
          ? trades
          : trades.filter(t => t.accountId === selectedAccountId);
        
        const tradesWithPL = filteredTrades.map(trade => calculateTradePL(trade));
        const winningTrades = tradesWithPL.filter(pl => pl > 0);
        const losingTrades = tradesWithPL.filter(pl => pl < 0);

        const averageWin = winningTrades.length > 0
          ? winningTrades.reduce((sum, pl) => sum + pl, 0) / winningTrades.length
          : 0;

        const averageLoss = losingTrades.length > 0
          ? Math.abs(losingTrades.reduce((sum, pl) => sum + pl, 0)) / losingTrades.length
          : 0;

        if (averageLoss === 0) return averageWin > 0 ? '∞' : '0';
        return `1:${(averageWin / averageLoss).toFixed(2)}`;
      }
    }
  ];
}

export function getDefaultCharts(): ChartConfig[] {
  return [
    {
      id: 'account-balance-chart',
      title: 'Account Balance History',
      enabled: true,
    },
    {
      id: 'pl-chart',
      title: 'Cumulative P/L',
      enabled: true,
    },
    {
      id: 'recent-trades-chart',
      title: 'Last 30 Trades',
      enabled: true,
    },
    {
      id: 'monthly-pl-chart',
      title: 'Monthly P/L',
      enabled: true,
    },
    {
      id: 'drawdown-chart',
      title: 'Drawdown History',
      enabled: true,
    },
    {
      id: 'weekday-pl-chart',
      title: 'P/L by Weekday',
      enabled: true,
    },
    {
      id: 'symbol-pl-chart',
      title: 'P/L by Symbol',
      enabled: true,
    },
  ];
}