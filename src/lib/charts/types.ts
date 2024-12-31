export interface ChartDataPoint {
  index: number;
  value: number;
  date: string;
}

export interface ChartConfig {
  title: string;
  valueKey: string;
  valueLabel: string;
  gradientId: string;
}