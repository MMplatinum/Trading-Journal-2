import { useState } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { calculateTradePL, calculatePLPercentage } from '@/lib/trades/calculations';
import { calculateHistoricalBalances } from '@/lib/accounts/balance-history';
import { useAccounts } from '@/hooks/useAccounts';
import { TradeTableHeader } from './table/TradeTableHeader';
import { TradeTableRow } from './table/TradeTableRow';
import { TradeTableFooter } from './table/TradeTableFooter';
import { TradeViewDialog } from './TradeViewDialog';
import { TradeEditDialog } from './TradeEditDialog';
import { TradeDeleteDialog } from './TradeDeleteDialog';
import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
} from '@/components/ui/table';

interface TradesTableProps {
  trades: Trade[];
  accounts: Account[];
  selectedTrades: string[];
  onSelectionChange: (ids: string[]) => void;
  onDeleteTrade: (id: string) => void;
  onUpdateTrade: (id: string, data: Omit<Trade, 'id'>) => void;
}

export function TradesTable({
  trades,
  accounts,
  selectedTrades,
  onSelectionChange,
  onDeleteTrade,
  onUpdateTrade,
}: TradesTableProps) {
  const { transactions } = useAccounts();
  const [viewTrade, setViewTrade] = useState<Trade | null>(null);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);
  const [deleteConfirmTrade, setDeleteConfirmTrade] = useState<Trade | null>(null);
  const [sortField, setSortField] = useState<'symbol' | 'type' | 'entry' | 'exit' | 'pl' | 'plPercentage'>('exit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate historical balances considering both trades and transactions
  const historicalBalances = calculateHistoricalBalances(trades, transactions, accounts);

  // Sort trades based on current sort field
  const displayTrades = [...trades].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'symbol':
        return direction * a.symbol.localeCompare(b.symbol);
      case 'type':
        return direction * a.instrumentType.localeCompare(b.instrumentType);
      case 'entry':
        return direction * (new Date(`${a.entryDate} ${a.entryTime}`).getTime() - 
                          new Date(`${b.entryDate} ${b.entryTime}`).getTime());
      case 'exit':
        return direction * (new Date(`${a.exitDate} ${a.exitTime}`).getTime() - 
                          new Date(`${b.exitDate} ${b.exitTime}`).getTime());
      case 'pl': {
        const plA = calculateTradePL(a);
        const plB = calculateTradePL(b);
        return direction * (plA - plB);
      }
      case 'plPercentage': {
        const plA = calculateTradePL(a);
        const plB = calculateTradePL(b);
        const percentageA = calculatePLPercentage(plA, historicalBalances.get(a.id) || 0);
        const percentageB = calculatePLPercentage(plB, historicalBalances.get(b.id) || 0);
        return direction * (percentageA - percentageB);
      }
      default:
        return 0;
    }
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(selectedTrades.length === trades.length ? [] : trades.map(t => t.id));
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TradeTableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              selectedTrades={selectedTrades}
              totalTrades={trades.length}
              onSelectAll={handleSelectAll}
            />
          </TableHeader>
          <TableBody>
            {displayTrades.map((trade) => (
              <TradeTableRow
                key={trade.id}
                trade={trade}
                account={accounts.find(a => a.id === trade.accountId)}
                selected={selectedTrades.includes(trade.id)}
                onSelect={() => onSelectionChange(
                  selectedTrades.includes(trade.id)
                    ? selectedTrades.filter(id => id !== trade.id)
                    : [...selectedTrades, trade.id]
                )}
                onView={() => setViewTrade(trade)}
                onEdit={() => setEditTrade(trade)}
                onDelete={() => setDeleteConfirmTrade(trade)}
                balanceBeforeTrade={historicalBalances.get(trade.id) || 0}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TradeTableFooter trades={displayTrades} />
          </TableFooter>
        </Table>
      </div>

      {/* Dialogs */}
      {viewTrade && (
        <TradeViewDialog
          trade={viewTrade}
          open={!!viewTrade}
          onOpenChange={(open) => !open && setViewTrade(null)}
          onUpdateTrade={onUpdateTrade}
        />
      )}

      {editTrade && (
        <TradeEditDialog
          trade={editTrade}
          accounts={accounts}
          open={!!editTrade}
          onOpenChange={(open) => !open && setEditTrade(null)}
          onSave={(data) => {
            onUpdateTrade(editTrade.id, data);
            setEditTrade(null);
          }}
        />
      )}

      <TradeDeleteDialog
        trade={deleteConfirmTrade}
        open={!!deleteConfirmTrade}
        onOpenChange={(open) => !open && setDeleteConfirmTrade(null)}
        onConfirm={() => {
          if (deleteConfirmTrade) {
            onDeleteTrade(deleteConfirmTrade.id);
            setDeleteConfirmTrade(null);
          }
        }}
      />
    </>
  );
}