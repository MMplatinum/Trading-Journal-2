import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { filterTradesByAccount, sortTradesByDate } from '@/lib/metrics/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = {
  positive: 'rgb(22, 163, 74)',
  negative: 'rgb(220, 38, 38)'
};

interface RecentTradesChartProps {
  trades: Trade[];
  selectedAccountId: string;
}

export function RecentTradesChart({ trades, selectedAccountId }: RecentTradesChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);
    const recentTrades = sortedTrades.slice(-30);

    return recentTrades.map((trade, index) => ({
      index: index + 1,
      pl: calculateTradePL(trade),
      date: `${trade.entryDate} ${trade.entryTime}`
    }));
  }, [trades, selectedAccountId]);

  // Calculate domain with padding
  const minValue = Math.min(0, ...chartData.map(d => d.pl));
  const maxValue = Math.max(0, ...chartData.map(d => d.pl));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Last 30 Trades</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 5 }}
          >
            <XAxis hide dataKey="index" />
            <YAxis
              domain={[minValue - padding, maxValue + padding]}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm text-muted-foreground">Trade #{data.index}</p>
                    <p className="text-sm font-medium">
                      P/L: {formatCurrency(data.pl, 'USD')}
                    </p>
                    <p className="text-xs text-muted-foreground">{data.date}</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="pl"
              isAnimationActive={false}
              key="recent-trades-bar"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`trade-${entry.index}-${index}`}
                  fill={entry.pl >= 0 ? COLORS.positive : COLORS.negative}
                  stroke={entry.pl >= 0 ? COLORS.positive : COLORS.negative}
                  fillOpacity={0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}