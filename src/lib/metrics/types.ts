import { Trade } from '@/types/trade';
import { Account } from '@/types/account';

export type MetricValueGetter = (
  trades: Trade[],
  accounts: Account[],
  selectedAccountId: string
) => string | number;

export interface MetricDefinition {
  id: string;
  title: string;
  enabled: boolean;
  getValue: MetricValueGetter;
}