import { ChartDataPoint } from './types';


export function calculateChartPadding(data: ChartDataPoint[]): {
  min: number;
  max: number;
} {
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  // For account balance chart, use a smaller padding percentage
  // and ensure we don't go too far below the minimum value
  if (minValue > 10000) { // This indicates it's likely an account balance chart
    const padding = range * 0.02; // 2% padding
    return {
      min: Math.max(minValue - padding, minValue * 0.95), // Don't go below 95% of min value
      max: maxValue + padding
    };
  }
  
  // For other charts (P/L, etc.)
  const padding = range * 0.1; // 10% padding
  return {
    min: Math.floor(minValue - padding),
    max: Math.ceil(maxValue + padding)
  };
}

export function calculateTickCount(min: number, max: number): number {
  const range = max - min;
  if (range <= 5000) return 5;
  if (range <= 10000) return 7;
  return 10;
}