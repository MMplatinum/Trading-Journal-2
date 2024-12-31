import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface DayDetailsProps {
  date: Date;
  trades: Trade[];
  accounts: Account[];
  onViewTrade: (trade: Trade) => void;
}

export function DayDetails({ date, trades, accounts, onViewTrade }: DayDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>

        {trades.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Trades:</h4>
              {trades.map((trade) => {
                const account = accounts.find(a => a.id === trade.accountId);

                return (
                  <div
                    key={trade.id}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <span className="font-medium">{trade.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({account?.name} - {trade.direction})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewTrade(trade)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {trade.entryTime} - {trade.exitTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No trades on this day.</p>
        )}
      </CardContent>
    </Card>
  );
}