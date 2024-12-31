import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { calculateCumulativePL } from '@/lib/trades/calculations';
import { formatCurrency } from '@/lib/utils';
import { sortTradesByDate } from '@/lib/metrics/filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { filterTradesByAccount } from '@/lib/metrics/filters';

interface PLChartProps {
  trades: Trade[];
  selectedAccountId: string;
  className?: string;
}

export function PLChart({ trades, selectedAccountId, className }: PLChartProps) {
  const { data: chartData, minValue, maxValue } = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);
    return calculateCumulativePL(sortedTrades);
  }, [trades, selectedAccountId]);

  // Calculate padding for chart domain
  const range = maxValue - minValue;
  const padding = range * 0.1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cumulative P/L</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 65, bottom: 30 }}
          >
            <defs>
              <linearGradient id="pl-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
              axisLine={{ strokeWidth: 1 }}
              tickLine={{ strokeWidth: 1 }}
              padding={{ left: 0, right: 20 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              domain={[minValue - padding, maxValue + padding]}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              axisLine={{ strokeWidth: 1 }}
              tickLine={{ strokeWidth: 1 }}
              width={80}
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
                      P/L: {formatCurrency(data.pl, 'USD')}
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
              dataKey="pl"
              stroke="hsl(var(--primary))"
              fill="url(#pl-gradient)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}