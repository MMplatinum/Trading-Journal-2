import { XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface XAxisProps {
  label?: string;
  height?: number;
  padding?: { left?: number; right?: number };
}

interface YAxisProps {
  domain?: [number, number];
  padding?: number;
  tickCount?: number;
  width?: number;
  tickFormatter?: (value: number) => string;
}

export function ChartXAxis({ 
  label = 'Trade #',
  height = 30,
  padding = { left: 0, right: 20 }
}: XAxisProps) {
  return (
    <XAxis
      dataKey="index"
      stroke="hsl(var(--muted-foreground))"
      label={{ 
        value: label, 
        position: 'insideBottom', 
        offset: -15,
        fill: "hsl(var(--muted-foreground))",
        fontSize: 12
      }}
      axisLine={{ strokeWidth: 1 }}
      tickLine={{ strokeWidth: 1 }}
      padding={padding}
      tick={{ fontSize: 11 }}
      height={height}
    />
  );
}

export function ChartYAxis({ 
  domain,
  padding = 0,
  tickCount,
  width = 80,
  tickFormatter = (value) => formatCurrency(value, 'USD')
}: YAxisProps) {
  return (
    <YAxis
      stroke="hsl(var(--muted-foreground))"
      domain={domain}
      tickCount={tickCount}
      tickFormatter={tickFormatter}
      axisLine={{ strokeWidth: 1 }}
      tickLine={{ strokeWidth: 1 }}
      tick={{ fontSize: 11 }}
      width={width}
      padding={{ top: padding, bottom: padding }}
    />
  );
}