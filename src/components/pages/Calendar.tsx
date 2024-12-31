import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrades } from '@/hooks/useTrades';
import { useAccounts } from '@/hooks/useAccounts';
import { calculateTradePL } from '@/lib/trades/calculations';
import { formatCurrency } from '@/lib/utils';
import { CalendarFilters } from '../calendar/CalendarFilters';
import { getCalendarDays } from '@/lib/calendar/utils';
import { formatCalendarDate } from '@/lib/dates/format';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Calendar() {
  const { trades } = useTrades();
  const { accounts } = useAccounts();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');

  const days = getCalendarDays(selectedDate);

  // Get unique strategies
  const strategies = Array.from(new Set(trades.map(trade => trade.strategy))).filter(Boolean);

  // Filter trades based on selection criteria
  const filteredTrades = trades.filter(trade => {
    const matchesAccount = selectedAccountId === 'all' || trade.accountId === selectedAccountId;
    const matchesSymbol = !selectedSymbol || trade.symbol.toLowerCase().includes(selectedSymbol.toLowerCase());
    const matchesStrategy = selectedStrategy === 'all' || trade.strategy === selectedStrategy;
    const matchesDirection = selectedDirection === 'all' || trade.direction === selectedDirection;
    return matchesAccount && matchesSymbol && matchesStrategy && matchesDirection;
  });

  // Calculate daily P/L for all days
  const dailyPL = filteredTrades.reduce((acc, trade) => {
    const pl = calculateTradePL(trade);
    acc[trade.exitDate] = (acc[trade.exitDate] || 0) + pl;
    return acc;
  }, {} as Record<string, number>);

  const handlePrevMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <CalendarFilters
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        selectedSymbol={selectedSymbol}
        selectedStrategy={selectedStrategy}
        selectedDirection={selectedDirection}
        strategies={strategies}
        onAccountChange={setSelectedAccountId}
        onSymbolChange={setSelectedSymbol}
        onStrategyChange={setSelectedStrategy}
        onDirectionChange={setSelectedDirection}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {WEEKDAYS.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium bg-card">
                {day}
              </div>
            ))}
            
            {days.map((date, index) => {
              const dateStr = formatCalendarDate(date);
              const dayPL = dailyPL[dateStr] || 0;
              const isCurrentMonth = date.getMonth() === selectedDate.getMonth();

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-4 bg-card relative flex flex-col
                    ${!isCurrentMonth && 'opacity-50'}
                    ${dayPL > 0 ? 'bg-green-50' : ''}
                    ${dayPL < 0 ? 'bg-red-50' : ''}
                    transition-colors
                  `}
                >
                  <div className="text-sm">{date.getDate()}</div>
                  {dayPL !== 0 && (
                    <div className={`text-sm font-semibold mt-auto ${dayPL > 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {formatCurrency(dayPL, 'USD')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}