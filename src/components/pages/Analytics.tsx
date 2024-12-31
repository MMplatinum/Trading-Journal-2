import { useMetrics } from '@/hooks/useMetrics';
import { useTrades } from '@/hooks/useTrades';
import { useAccounts } from '@/hooks/useAccounts';
import { AnalyticsMetrics } from '../analytics/AnalyticsMetrics';
import { MetricsPreview } from '../analytics/MetricsPreview';

export function Analytics() {
  const { trades } = useTrades();
  const { accounts } = useAccounts();
  const selectedAccountId = 'all';

  const { metrics, charts, toggleMetric, toggleChart } = useMetrics(trades, accounts, selectedAccountId);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Widgets</h2>
      <AnalyticsMetrics 
        metrics={metrics} 
        charts={charts}
        onToggleMetric={toggleMetric}
        onToggleChart={toggleChart}
      />
      <MetricsPreview metrics={metrics} />
    </div>
  );
}