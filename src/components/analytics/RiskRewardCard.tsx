import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/types/trade';
import { formatCurrency } from '@/lib/utils';
import { calculateRiskRewardStats } from '@/lib/trades/risk-reward';

interface RiskRewardCardProps {
  trades: Trade[];
}

export function RiskRewardCard({ trades }: RiskRewardCardProps) {
  const stats = calculateRiskRewardStats(trades);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk/Reward Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Win Size</p>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(stats.averageWin, 'USD')}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Loss Size</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(stats.averageLoss, 'USD')}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Risk/Reward Ratio</p>
            <p className="text-2xl font-bold">
              1:{stats.riskRewardRatio.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold">
              {(stats.winRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Largest Win</p>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(stats.largestWin, 'USD')}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Largest Loss</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(stats.largestLoss, 'USD')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}