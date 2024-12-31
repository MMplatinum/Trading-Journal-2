import { ChartDataPoint } from '@/lib/charts/types';
import { formatCurrency } from '@/lib/utils';

interface ChartTooltipProps {
  active: boolean;
  payload: any[];
  valueLabel: string;
}

export function ChartTooltip({ active, payload, valueLabel }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload as ChartDataPoint;
  
  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-sm text-muted-foreground">
        {data.index === 0 ? 'Starting Point' : `Trade #${data.index}`}
      </p>
      <p className="text-sm font-medium">
        {valueLabel}: {formatCurrency(data.value, 'USD')}
      </p>
      {data.index > 0 && (
        <p className="text-xs text-muted-foreground">{data.date}</p>
      )}
    </div>
  );
}