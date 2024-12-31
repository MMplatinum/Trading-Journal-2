import { TableCell, TableRow } from '@/components/ui/table';
import { Trade } from '@/types/trade';
import { calculateTradePL } from '@/lib/trades/calculations';
import { formatCurrency } from '@/lib/utils';

interface TradeTableFooterProps {
  trades: Trade[];
}

export function TradeTableFooter({ trades }: TradeTableFooterProps) {
  const totals = trades.reduce((acc, trade) => {
    const pl = calculateTradePL(trade);
    return {
      totalTrades: acc.totalTrades + 1,
      totalCommission: acc.totalCommission + trade.commission,
      totalPL: acc.totalPL + pl,
    };
  }, {
    totalTrades: 0,
    totalCommission: 0,
    totalPL: 0,
  });

  return (
    <TableRow>
      <TableCell colSpan={8}>Total</TableCell>
      <TableCell>{formatCurrency(totals.totalCommission, 'USD')}</TableCell>
      <TableCell>{totals.totalTrades}</TableCell>
      <TableCell className={totals.totalPL >= 0 ? 'text-green-500' : 'text-red-500'}>
        {formatCurrency(totals.totalPL, 'USD')}
      </TableCell>
      <TableCell colSpan={3}></TableCell>
    </TableRow>
  );
}