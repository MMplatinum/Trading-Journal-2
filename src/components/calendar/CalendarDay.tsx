import { Trade } from '@/types/trade';
import { formatDateForDisplay } from '@/lib/dates/format';

interface CalendarDayProps {
  date: Date;
  trades: Trade[];
  onClick?: () => void;
}

export function CalendarDay({ date, trades, onClick }: CalendarDayProps) {
  return (
    <div 
      className="w-full h-full min-h-[100px] p-2 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="text-sm">{date.getDate()}</div>
      {trades.length > 0 && (
        <div className="mt-1">
          <div className="text-xs text-muted-foreground">
            {trades.length} trade{trades.length > 1 ? 's' : ''}
          </div>
          {trades.map((trade, index) => (
            <div key={trade.id} className="text-xs mt-1 truncate">
              {trade.symbol} ({formatDateForDisplay(trade.entryDate)})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}