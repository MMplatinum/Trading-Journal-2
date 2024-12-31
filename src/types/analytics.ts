export interface ChartConfig {
  id: string;
  title: string;
  enabled: boolean;
}

export interface MetricConfig {
  id: string;
  title: string;
  enabled: boolean;
  currentValue: string | number;
  getValue: (trades: any[], accounts: any[], selectedAccountId: string) => string | number;
}