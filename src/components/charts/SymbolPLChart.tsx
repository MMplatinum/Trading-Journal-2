import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { filterTradesByAccount } from '@/lib/metrics/filters';
import { sortTradesByDate } from '@/lib/metrics/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = {
  positive: 'rgb(22, 163, 74)',
  negative: 'rgb(220, 38, 38)'
};

interface SymbolPLChartProps {
  trades: Trade[];
  selectedAccountId: string;
}

export function SymbolPLChart({ trades, selectedAccountId }: SymbolPLChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);
    
    const symbolPL = sortedTrades.reduce((acc, trade) => {
      const { symbol } = trade;
      const pl = calculateTradePL(trade);
      
      if (!acc[symbol]) {
        acc[symbol] = { pl: 0, count: 0 };
      }
      
      acc[symbol].pl += pl;
      acc[symbol].count += 1;
      
      return acc;
    }, {} as Record<string, { pl: number; count: number }>);

    return Object.entries(symbolPL)
      .map(([symbol, data]) => ({
        symbol,
        pl: data.pl,
        count: data.count
      }))
      .sort((a, b) => b.pl - a.pl); // Sort by P/L descending
  }, [trades, selectedAccountId]);

  // Calculate domain with padding
  const minValue = Math.min(0, ...chartData.map(d => d.pl));
  const maxValue = Math.max(0, ...chartData.map(d => d.pl));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>P/L by Symbol</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 40 }}
          >
            <XAxis
              dataKey="symbol"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minValue - padding, maxValue + padding]}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              width={80}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="text-sm text-muted-foreground">{data.symbol}</p>
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
              key="symbol-pl-bar"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.symbol}-${index}`}
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