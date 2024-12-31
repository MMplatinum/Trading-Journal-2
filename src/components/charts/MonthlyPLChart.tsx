import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { filterTradesByAccount } from '@/lib/metrics/filters';
import { sortTradesByDate } from '@/lib/metrics/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartXAxis, ChartYAxis } from './components/ChartAxis';
import { formatCurrency } from '@/lib/utils';

const COLORS = {
  positive: 'rgb(22, 163, 74)',
  negative: 'rgb(220, 38, 38)'
};

interface MonthlyPLChartProps {
  trades: Trade[];
  selectedAccountId: string;
}

export function MonthlyPLChart({ trades = [], selectedAccountId }: MonthlyPLChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);
    
    const monthlyPL = sortedTrades.reduce((acc, trade) => {
      if (!trade.exitDate) return acc;
      
      const month = trade.exitDate.substring(0, 7); // YYYY-MM format
      const pl = calculateTradePL(trade);
      
      if (!acc[month]) {
        acc[month] = { pl: 0, count: 0 };
      }
      
      acc[month].pl += pl;
      acc[month].count += 1;
      
      return acc;
    }, {} as Record<string, { pl: number; count: number }>);

    return Object.entries(monthlyPL)
      .map(([month, data]) => ({
        month,
        pl: data.pl,
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [trades, selectedAccountId]);

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Monthly P/L</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate domain with padding
  const minValue = Math.min(0, ...chartData.map(d => d.pl));
  const maxValue = Math.max(0, ...chartData.map(d => d.pl));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Monthly P/L</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 20 }}
          >
            <ChartXAxis 
              label="Month"
              height={60} 
            />
            <ChartYAxis
              domain={[minValue - padding, maxValue + padding]}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm text-muted-foreground">{data.month}</p>
                    <p className="text-sm font-medium">
                      P/L: {formatCurrency(data.pl, 'USD')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.count} trade{data.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="pl"
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
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