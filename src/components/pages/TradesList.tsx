import { TradesList as TradesListComponent } from '../trades/TradesList';
import { useTrades } from '@/hooks/useTrades';
import { useAccounts } from '@/hooks/useAccounts';

export function TradesList() {
  const { trades, deleteTrades, updateTrade, deleteTrade } = useTrades();
  const { accounts } = useAccounts();

  return (
    <TradesListComponent
      trades={trades}
      accounts={accounts}
      onDeleteTrades={deleteTrades}
      onDeleteTrade={deleteTrade}
      onUpdateTrade={updateTrade}
    />
  );
}