import { useMemo } from 'react';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { filterTradesByAccount, sortTradesByDate } from '@/lib/metrics/filters';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PLChartProps {
  trades: Trade[];
  selectedAccountId: string;
  className?: string;
}

interface ChartDataPoint {
  index: number;
  pl: number;
  date: string;
}

export function PLChart({ trades, selectedAccountId, className }: PLChartProps) {
  const chartData = useMemo(() => {
    const filteredTrades = filterTradesByAccount(trades, selectedAccountId);
    const sortedTrades = sortTradesByDate(filteredTrades);

    let data: ChartDataPoint[] = [{
      index: 0,
      pl: 0,
      date: 'Start'
    }];

    let runningPL = 0;
    sortedTrades.forEach((trade, idx) => {
      const pl = calculateTradePL(trade);
      runningPL += pl;
      data.push({
        index: idx + 1,
        pl: runningPL,
        date: `${trade.entryDate} ${trade.entryTime}`
      });
    });

    return data;
  }, [trades, selectedAccountId]);

  const minValue = Math.min(0, ...chartData.map(d => d.pl));
  const maxValue = Math.max(0, ...chartData.map(d => d.pl));
  const range = maxValue - minValue;
  const padding = range * 0.05; // Reduziert auf 5% Padding

  return (
    <Card className={cn("col-span-full group relative", className)}>
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 cursor-move z-10"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <CardHeader>
        <CardTitle>Cumulative P/L</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
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
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload as ChartDataPoint;
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