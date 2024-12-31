import { useState, useCallback } from 'react';
import { DashboardCard } from './DashboardCard';
import { AccountBalanceChart } from './AccountBalanceChart';
import { PLChart } from '../charts/PLChart';
import { RecentTradesChart } from '../charts/RecentTradesChart';
import { MonthlyPLChart } from '../charts/MonthlyPLChart';
import { WeekdayPLChart } from '../charts/WeekdayPLChart';
import { SymbolPLChart } from '../charts/SymbolPLChart';
import { DrawdownChart } from '../charts/DrawdownChart';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { useMetrics } from '@/hooks/useMetrics';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { cn } from '@/lib/utils';
import { useAccounts } from '@/hooks/useAccounts';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardGridProps {
  trades: Trade[];
  accounts: Account[];
  selectedAccountId: string;
}

export function DashboardGrid({ trades, accounts, selectedAccountId }: DashboardGridProps) {
  const { metrics, charts, loading: metricsLoading } = useMetrics(trades, accounts, selectedAccountId);
  const { transactions, loading: transactionsLoading } = useAccounts();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedChart, setDraggedChart] = useState<string | null>(null);
  
  const enabledMetrics = metrics.filter(m => m.enabled);
  const enabledCharts = charts.filter(c => c.enabled);
  const { 
    metricsLayout, 
    updateMetricsLayout,
    chartsLayout,
    updateChartsLayout
  } = useDashboardLayout(enabledMetrics.map(m => m.id));
  const getMetricColorCondition = (metric: typeof enabledMetrics[0]) => {
    switch (metric.id) {
      case 'win-rate':
        return parseFloat(metric.currentValue.toString()) > 50 ? 'positive' : 'negative';
      case 'total-pl':
        return parseFloat(metric.currentValue.toString().replace(/[^0-9.-]/g, '')) > 0 ? 'positive' : 'negative';
      case 'profit-factor':
        return parseFloat(metric.currentValue.toString()) > 1 ? 'positive' : 'negative';
      default:
        return 'neutral';
    }
  };

  const handleDragStart = useCallback((id: string) => {
    setDraggedItem(id);
  }, []);

  const handleChartDragStart = useCallback((id: string) => {
    setDraggedChart(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    updateMetricsLayout(currentLayout => {
      const newLayout = [...currentLayout];
      const draggedIndex = newLayout.indexOf(draggedItem);
      const targetIndex = newLayout.indexOf(targetId);

      if (draggedIndex === -1 || targetIndex === -1) return currentLayout;

      newLayout.splice(draggedIndex, 1);
      newLayout.splice(targetIndex, 0, draggedItem);
      return newLayout;
    });
  }, [draggedItem, updateMetricsLayout]);

  const handleChartDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedChart || draggedChart === targetId) return;

    updateChartsLayout(currentLayout => {
      const newLayout = [...currentLayout];
      const draggedIndex = newLayout.indexOf(draggedChart);
      const targetIndex = newLayout.indexOf(targetId);

      if (draggedIndex === -1 || targetIndex === -1) return currentLayout;

      newLayout.splice(draggedIndex, 1);
      newLayout.splice(targetIndex, 0, draggedChart);
      return newLayout;
    });
  }, [draggedChart, updateChartsLayout]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleChartDragEnd = useCallback(() => {
    setDraggedChart(null);
  }, []);

  const orderedMetrics = metricsLayout
    .map(id => enabledMetrics.find(m => m.id === id))
    .filter((metric): metric is NonNullable<typeof metric> => metric !== undefined);


  const orderedCharts = chartsLayout
    .filter(chartId => enabledCharts.some(c => c.id === chartId))
    .map(chartId => {
      const chartComponent = (() => {
        switch (chartId) {
          case 'account-balance-chart':
            return (
              <AccountBalanceChart 
                trades={trades} 
                accounts={accounts} 
                transactions={transactions}
                selectedAccountId={selectedAccountId} 
              />
            );
          case 'pl-chart':
            return <PLChart trades={trades} selectedAccountId={selectedAccountId} />;
          case 'recent-trades-chart':
            return <RecentTradesChart trades={trades} selectedAccountId={selectedAccountId} />;
          case 'monthly-pl-chart':
            return <MonthlyPLChart trades={trades} selectedAccountId={selectedAccountId} />;
          case 'drawdown-chart':
            return (
              <DrawdownChart 
                trades={trades} 
                accounts={accounts} 
                selectedAccountId={selectedAccountId} 
              />
            );
          case 'weekday-pl-chart':
            return <WeekdayPLChart trades={trades} selectedAccountId={selectedAccountId} />;
          case 'symbol-pl-chart':
            return <SymbolPLChart trades={trades} selectedAccountId={selectedAccountId} />;
          default:
            return null;
        }
      })();

      return (
        <div
          key={chartId}
          role="button"
          tabIndex={0}
          draggable
          onDragStart={() => handleChartDragStart(chartId)}
          onDragOver={(e) => handleChartDragOver(e, chartId)}
          onDragEnd={handleChartDragEnd}
          className={cn(
            "transition-transform duration-200 cursor-move",
            draggedChart === chartId && "opacity-50"
          )}
        >
          {chartComponent}
        </div>
      );
  });

  if (metricsLoading || transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {orderedMetrics.map((metric) => (
          <div
            key={metric.id}
            draggable
            onDragStart={() => handleDragStart(metric.id)}
            onDragOver={(e) => handleDragOver(e, metric.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "transition-transform duration-200",
              draggedItem === metric.id && "opacity-50"
            )}
          >
            <DashboardCard
              title={metric.title}
              value={metric.currentValue}
              colorCondition={getMetricColorCondition(metric)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {orderedCharts}
      </div>
    </div>
  );
}