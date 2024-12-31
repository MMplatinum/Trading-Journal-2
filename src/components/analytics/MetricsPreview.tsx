import { MetricConfig } from '@/types/analytics';
import { DashboardCard } from '../dashboard/DashboardCard';

interface MetricsPreviewProps {
  metrics: MetricConfig[];
}

export function MetricsPreview({ metrics }: MetricsPreviewProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics
          .filter(metric => metric.enabled)
          .map((metric) => (
            <DashboardCard
              key={metric.id}
              title={metric.title}
              value={metric.currentValue}
            />
          ))}
      </div>
    </div>
  );
}