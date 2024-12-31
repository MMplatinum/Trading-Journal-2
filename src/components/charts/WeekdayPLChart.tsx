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

interface WeekdayPLChartProps {
  trades: Trade[];
  selectedAccountId: string;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeekdayPLChart({ trades, selectedAccountId }: WeekdayPLChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);
    
    const weekdayPL = sortedTrades.reduce((acc, trade) => {
      const date = new Date(trade.exitDate);
      // Adjust for Sunday being 0 in JavaScript's getDay()
      const dayIndex = date.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      const weekday = WEEKDAYS[adjustedIndex];
      const pl = calculateTradePL(trade);
      
      if (!acc[weekday]) {
        acc[weekday] = { pl: 0, count: 0 };
      }
      
      acc[weekday].pl += pl;
      acc[weekday].count += 1;
      
      return acc;
    }, {} as Record<string, { pl: number; count: number }>);

    // Create data for all weekdays, including those without trades
    return WEEKDAYS.map(day => ({
      day,
      pl: weekdayPL[day]?.pl || 0,
      count: weekdayPL[day]?.count || 0
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
        <CardTitle>P/L by Weekday</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 5 }}
          >
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
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
                    <p className="text-sm text-muted-foreground">{data.day}</p>
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
              key="weekday-pl-bar"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.day}-${index}`}
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