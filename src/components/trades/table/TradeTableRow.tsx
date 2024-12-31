import { Trade, Account } from '@/types/trade';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Image } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateTradePL, calculatePLPercentage } from '@/lib/trades/calculations';
import { formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TradeTableRowProps {
  trade: Trade;
  account?: Account;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  balanceBeforeTrade: number;
}

export function TradeTableRow({
  trade,
  account,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  balanceBeforeTrade,
}: TradeTableRowProps) {
  const pl = calculateTradePL(trade);
  // Only calculate percentage if we have a valid balance
  const plPercentage = balanceBeforeTrade > 0 ? calculatePLPercentage(pl, balanceBeforeTrade) : 0;

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>{trade.symbol}</TableCell>
      <TableCell>{trade.instrumentType}</TableCell>
      <TableCell>{trade.direction}</TableCell>
      <TableCell>{trade.entryDate} {trade.entryTime}</TableCell>
      <TableCell>{trade.exitDate} {trade.exitTime}</TableCell>
      <TableCell>{formatCurrency(trade.entryPrice || 0, account?.currency || 'USD')}</TableCell>
      <TableCell>{formatCurrency(trade.exitPrice || 0, account?.currency || 'USD')}</TableCell>
      <TableCell>{formatCurrency(trade.commission, account?.currency || 'USD')}</TableCell>
      <TableCell>{trade.quantity}</TableCell>
      <TableCell className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
        {formatCurrency(pl, account?.currency || 'USD')}
      </TableCell>
      <TableCell>
        <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
          {plPercentage === 0 ? '-' : `${plPercentage.toFixed(2)}%`}
        </span>
      </TableCell>
      <TableCell>{trade.strategy}</TableCell>
      <TableCell className="text-right space-x-2">
        {(trade.entryScreenshot || trade.exitScreenshot) && (
          <Button variant="ghost" size="icon" onClick={onView}>
            <Image className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onView}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}