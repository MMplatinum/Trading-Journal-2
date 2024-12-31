import { useState, useEffect, useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { MetricConfig } from '@/types/analytics';
import { getDefaultMetrics } from '@/lib/metrics/defaults';

const STORAGE_KEY = 'dashboard_metrics';

export function useDashboardMetrics(
  trades: Trade[],
  accounts: Account[],
  selectedAccountId: string
) {
  // Load enabled/disabled state
  const [enabledStates, setEnabledStates] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Filter trades based on selected account
  const filteredTrades = useMemo(() => 
    selectedAccountId === 'all' 
      ? trades 
      : trades.filter(trade => trade.accountId === selectedAccountId),
    [trades, selectedAccountId]
  );

  // Get base metrics with current values
  const metrics = useMemo(() => {
    const defaultMetrics = getDefaultMetrics();
    return defaultMetrics.map(metric => ({
      ...metric,
      enabled: enabledStates[metric.id] ?? metric.enabled,
      currentValue: metric.getValue(filteredTrades, accounts, selectedAccountId)
    }));
  }, [filteredTrades, accounts, selectedAccountId, enabledStates]);

  // Save enabled states when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledStates));
  }, [enabledStates]);

  const toggleMetric = (id: string) => {
    setEnabledStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return { metrics, toggleMetric };
}