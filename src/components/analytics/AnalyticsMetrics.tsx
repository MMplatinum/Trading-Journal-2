import { MetricConfig, ChartConfig } from '@/types/analytics';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsMetricsProps {
  metrics: MetricConfig[];
  charts: ChartConfig[];
  onToggleMetric: (id: string) => void;
  onToggleChart: (id: string) => void;
}

export function AnalyticsMetrics({ metrics, charts, onToggleMetric, onToggleChart }: AnalyticsMetricsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metrics Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <Label htmlFor={`metric-${metric.id}`}>{metric.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {metric.currentValue}
                  </p>
                </div>
                <Switch
                  id={`metric-${metric.id}`}
                  checked={metric.enabled}
                  onCheckedChange={() => onToggleMetric(metric.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Charts Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <Label htmlFor={`chart-${chart.id}`}>{chart.title}</Label>
                <Switch
                  id={`chart-${chart.id}`}
                  checked={chart.enabled}
                  onCheckedChange={() => onToggleChart(chart.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}