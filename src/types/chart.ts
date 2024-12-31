export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartConfig {
  title: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
  height?: number;
  showLegend?: boolean;
}