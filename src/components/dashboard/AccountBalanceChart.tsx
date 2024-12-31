import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Account, Transaction } from '@/types/account';
import { calculateTradePL } from '@/lib/trades/calculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Scatter } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Circle } from 'lucide-react';

interface BalanceEvent {
  timestamp: number;
  balance: number;
  type: 'trade' | 'deposit' | 'withdrawal' | 'initial';
  amount: number;
  date: string;
  time: string;
}

interface AccountBalanceChartProps {
  trades: Trade[];
  accounts: Account[];
  transactions: Transaction[];
  selectedAccountId: string;
}

export function AccountBalanceChart({ 
  trades = [], 
  accounts = [], 
  transactions = [],
  selectedAccountId 
}: AccountBalanceChartProps) {
  const chartData = useMemo(() => {
    // Filter data based on selected account
    const filteredTrades = selectedAccountId === 'all' 
      ? trades 
      : trades.filter(t => t.accountId === selectedAccountId);
    
    const filteredTransactions = selectedAccountId === 'all'
      ? transactions
      : transactions.filter(t => t.accountId === selectedAccountId);

    // Get initial balance
    const initialBalance = selectedAccountId === 'all'
      ? accounts.reduce((sum, account) => sum + account.balance, 0)
      : accounts.find(a => a.id === selectedAccountId)?.balance || 0;

    // Calculate total P/L to get starting balance
    const totalPL = filteredTrades.reduce((sum, trade) => sum + calculateTradePL(trade), 0);
    const totalTransactions = filteredTransactions.reduce((sum, transaction) => 
      sum + (transaction.type === 'deposit' ? transaction.amount : -transaction.amount), 0);
    const startingBalance = initialBalance - totalPL - totalTransactions;

    // Create events array with timestamps
    const events: BalanceEvent[] = [];

    // Add trades
    filteredTrades.forEach(trade => {
      if (trade.exitDate && trade.exitTime) {
        try {
          const timestamp = new Date(`${trade.exitDate} ${trade.exitTime}`).getTime();
          events.push({
            timestamp,
            amount: calculateTradePL(trade),
            type: 'trade',
            date: trade.exitDate,
            time: trade.exitTime,
            balance: 0, // Will be calculated later
          });
        } catch (error) {
          console.error('Invalid date/time for trade:', trade);
        }
      }
    });

    // Add transactions
    filteredTransactions.forEach(transaction => {
      if (transaction.date && transaction.time) {
        try {
          const timestamp = new Date(`${transaction.date} ${transaction.time}`).getTime();
          events.push({
            timestamp,
            amount: transaction.type === 'deposit' ? transaction.amount : -transaction.amount,
            type: transaction.type,
            date: transaction.date,
            time: transaction.time,
            balance: 0, // Will be calculated later
          });
        } catch (error) {
          console.error('Invalid date/time for transaction:', transaction);
        }
      }
    });

    // Sort events by timestamp
    events.sort((a, b) => a.timestamp - b.timestamp);

    // Calculate running balance
    let runningBalance = startingBalance;
    events.forEach(event => {
      runningBalance += event.amount;
      event.balance = runningBalance;
    });

    // Add initial point if we have events
    if (events.length > 0) {
      const firstEventTime = Math.min(...events.map(e => e.timestamp));
      const initialDate = new Date(firstEventTime - 86400000); // One day before first event
      
      events.unshift({
        timestamp: initialDate.getTime(),
        balance: startingBalance,
        type: 'initial',
        amount: 0,
        date: initialDate.toISOString().split('T')[0],
        time: '00:00',
      });
    }

    return events;
  }, [trades, accounts, transactions, selectedAccountId]);

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full row-span-3">
        <CardHeader>
          <CardTitle>Account Balance History</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate y-axis domain with padding
  const minBalance = Math.min(...chartData.map(d => d.balance));
  const maxBalance = Math.max(...chartData.map(d => d.balance));
  const range = maxBalance - minBalance;
  const padding = range * 0.05;

  return (
    <Card className="col-span-full row-span-3">
      <CardHeader>
        <CardTitle>Account Balance History</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 65, bottom: 20 }}>
            <defs>
              <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return date.toLocaleDateString();
              }}
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
            />
            <YAxis
              domain={[minBalance - padding, maxBalance + padding]}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              width={80}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as BalanceEvent;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm text-muted-foreground">
                      {data.date} {data.time}
                    </p>
                    <p className="text-sm font-medium">
                      Balance: {formatCurrency(data.balance, 'USD')}
                    </p>
                    {data.type !== 'initial' && (
                      <p className="text-xs text-muted-foreground">
                        {data.type === 'trade' ? 'Trade' : data.type === 'deposit' ? 'Deposit' : 'Withdrawal'}:{' '}
                        {formatCurrency(data.amount, 'USD')}
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              connectNulls={true}
              stroke="hsl(var(--primary))"
              fill="url(#balance)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}