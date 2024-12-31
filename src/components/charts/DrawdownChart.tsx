import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateTradePL } from '@/lib/trades/calculations';

interface DrawdownChartProps {
  trades: Trade[];
  accounts: Account[];
  selectedAccountId: string;
  className?: string;
}

export function DrawdownChart({ trades, accounts, selectedAccountId, className }: DrawdownChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = selectedAccountId === 'all'
      ? trades
      : trades.filter(t => t.accountId === selectedAccountId);

    // Sort trades by date
    const sortedTrades = [...filteredTrades].sort((a, b) => {
      const dateA = new Date(`${a.exitDate} ${a.exitTime}`);
      const dateB = new Date(`${b.exitDate} ${b.exitTime}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Get initial balance
    const initialBalance = selectedAccountId === 'all'
      ? accounts.reduce((sum, account) => sum + account.balance, 0)
      : accounts.find(a => a.id === selectedAccountId)?.balance || 0;

    let currentBalance = initialBalance;
    let peak = initialBalance;
    let data = [{
      index: 0,
      drawdown: 0,
      date: 'Start'
    }];

    sortedTrades.forEach((trade, idx) => {
      const pl = calculateTradePL(trade);
      currentBalance += pl;

      // Update peak if we have a new high
      if (currentBalance > peak) {
        peak = currentBalance;
      }

      // Calculate drawdown percentage
      const drawdown = peak > 0 ? ((peak - currentBalance) / peak) * 100 : 0;

      data.push({
        index: idx + 1,
        drawdown: -drawdown, // Negative to show drawdown going down
        date: `${trade.exitDate} ${trade.exitTime}`
      });
    });

    return data;
  }, [trades, accounts, selectedAccountId]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Drawdown History</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 30 }}
          >
            <defs>
              <linearGradient id="drawdown-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="index"
              stroke="hsl(var(--muted-foreground))"
              label={{ 
                value: 'Trade #', 
                position: 'insideBottom', 
                offset: -20,
                fill: "hsl(var(--muted-foreground))"
              }}
              scale="linear"
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${Math.abs(value).toFixed(2)}%`}
              label={{
                value: 'Drawdown %',
                angle: -90,
                position: 'insideLeft',
                fill: "hsl(var(--muted-foreground))"
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm text-muted-foreground">
                      {data.index === 0 ? 'Starting Point' : `Trade #${data.index}`}
                    </p>
                    <p className="text-sm font-medium">
                      Drawdown: {Math.abs(data.drawdown).toFixed(2)}%
                    </p>
                    {data.index > 0 && (
                      <p className="text-xs text-muted-foreground">{data.date}</p>
                    )}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="hsl(var(--destructive))"
              fill="url(#drawdown-gradient)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}