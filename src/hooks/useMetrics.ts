import { useState, useEffect } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { MetricConfig, ChartConfig } from '@/types/analytics';
import { getDefaultMetrics, getDefaultCharts } from '@/lib/metrics/defaults';
import { useAuth } from '@/contexts/AuthContext';
import { loadMetricsState, saveMetricsState, loadChartsState, saveChartsState } from '@/lib/metrics/storage';

export function useMetrics(trades: Trade[], accounts: Account[], selectedAccountId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enabledStates, setEnabledStates] = useState<Record<string, boolean>>({});
  const [chartStates, setChartStates] = useState<Record<string, boolean>>({});

  // Load enabled states on mount
  useEffect(() => {
    if (user?.id) {
      const saved = loadMetricsState(user.id);
      const savedCharts = loadChartsState(user.id);
      setEnabledStates(saved);
      setChartStates(savedCharts);
    }
    setLoading(false);
  }, [user?.id]);

  // Get base metrics with current values
  const metrics = getDefaultMetrics().map(metric => ({
    ...metric,
    enabled: enabledStates[metric.id] ?? metric.enabled,
    currentValue: metric.getValue(trades || [], accounts || [], selectedAccountId)
  }));

  // Get charts configuration
  const charts = getDefaultCharts().map(chart => ({
    ...chart,
    enabled: chartStates[chart.id] ?? chart.enabled,
  }));
  // Save enabled states when they change
  const toggleMetric = (id: string) => {
    const newStates = {
      ...enabledStates,
      [id]: !enabledStates[id]
    };
    setEnabledStates(newStates);
    if (user?.id) {
      saveMetricsState(newStates, user.id);
    }
  };
  const toggleChart = (id: string) => {
    const newStates = {
      ...chartStates,
      [id]: !chartStates[id]
    };
    setChartStates(newStates);
    if (user?.id) {
      saveChartsState(newStates, user.id);
    }
  };

  return { metrics, charts, loading, toggleMetric, toggleChart };
}