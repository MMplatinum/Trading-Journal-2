import { useState } from 'react';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { DashboardGrid } from '../dashboard/DashboardGrid';
import { useTrades } from '@/hooks/useTrades';
import { useAccounts } from '@/hooks/useAccounts';

export function Dashboard() {
  const { trades } = useTrades();
  const { accounts } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');

  // Get unique strategies
  const strategies = Array.from(new Set(trades.map(trade => trade.strategy))).filter(Boolean);

  // Filter trades based on all criteria
  const filteredTrades = trades.filter(trade => {
    const matchesAccount = selectedAccountId === 'all' || trade.accountId === selectedAccountId;
    const matchesSymbol = !selectedSymbol || trade.symbol.toLowerCase().includes(selectedSymbol.toLowerCase());
    const matchesStrategy = selectedStrategy === 'all' || trade.strategy === selectedStrategy;
    const matchesDirection = selectedDirection === 'all' || trade.direction === selectedDirection;
    return matchesAccount && matchesSymbol && matchesStrategy && matchesDirection;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Dashboard" 
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
      <DashboardGrid 
        trades={filteredTrades}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
      />
    </div>
  );
}