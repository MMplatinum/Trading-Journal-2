import { ChartDataPoint } from '@/types/chart';

export function calculateChartDomain(data: ChartDataPoint[]): {
  min: number;
  max: number;
} {
  if (data.length === 0) {
    return { min: 0, max: 0 };
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const padding = range * 0.1;

  return {
    min: Math.floor(min - padding),
    max: Math.ceil(max + padding),
  };
}

export function formatChartDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}