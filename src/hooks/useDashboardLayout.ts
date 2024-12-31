import { useState, useCallback } from 'react';
import { saveLayout, loadLayout } from '@/lib/metrics/storage';
import { useAuth } from '@/contexts/AuthContext';

export function useDashboardLayout(metricIds: string[]) {
  const { user } = useAuth();
  const userId = user?.id;

  const [metricsLayout, setMetricsLayout] = useState<string[]>(() => {
    const saved = loadLayout(userId, 'metrics');
    if (saved) {
      const validSaved = saved.filter(id => metricIds.includes(id));
      const newMetrics = metricIds.filter(id => !saved.includes(id));
      return [...validSaved, ...newMetrics];
    }
    return metricIds;
  });

  const [chartsLayout, setChartsLayout] = useState<string[]>(() => {
    const saved = loadLayout(userId, 'charts');
    if (saved) return saved;
    return [
      'account-balance-chart',
      'pl-chart',
      'recent-trades-chart',
      'monthly-pl-chart',
      'drawdown-chart',
      'weekday-pl-chart',
      'symbol-pl-chart'
    ];
  });

  const updateMetricsLayout = useCallback((newLayout: string[] | ((prev: string[]) => string[])) => {
    setMetricsLayout(current => {
      const nextLayout = typeof newLayout === 'function' ? newLayout(current) : newLayout;
      if (userId) {
        saveLayout(nextLayout, userId, 'metrics');
      }
      return nextLayout;
    });
  }, [userId]);

  const updateChartsLayout = useCallback((newLayout: string[] | ((prev: string[]) => string[])) => {
    setChartsLayout(current => {
      const nextLayout = typeof newLayout === 'function' ? newLayout(current) : newLayout;
      if (userId) {
        saveLayout(nextLayout, userId, 'charts');
      }
      return nextLayout;
    });
  }, [userId]);

  return { 
    metricsLayout, 
    updateMetricsLayout,
    chartsLayout,
    updateChartsLayout
  };
}