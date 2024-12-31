import { useState } from 'react';
import { Trade } from '@/types/trade';
import { Account } from '@/types/account';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TradesTable } from './TradesTable';
import { Search, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TradesListProps {
  trades: Trade[];
  accounts: Account[];
  onDeleteTrades: (ids: string[]) => void;
  onDeleteTrade: (id: string) => void;
  onUpdateTrade: (id: string, data: Omit<Trade, 'id'>) => void;
}

export function TradesList({ 
  trades, 
  accounts,
  onDeleteTrades,
  onDeleteTrade,
  onUpdateTrade,
}: TradesListProps) {
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [accountFilter, setAccountFilter] = useState('all');
  const [symbolFilter, setSymbolFilter] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const { toast } = useToast();

  const strategies = Array.from(new Set(trades.map(trade => trade.strategy))).filter(Boolean);

  const filteredTrades = trades.filter(trade => {
    const matchesAccount = accountFilter === 'all' || trade.accountId === accountFilter;
    const matchesSymbol = !symbolFilter || trade.symbol.toLowerCase().includes(symbolFilter.toLowerCase());
    const matchesStrategy = strategyFilter === 'all' || trade.strategy === strategyFilter;
    const matchesDirection = directionFilter === 'all' || trade.direction === directionFilter;
    return matchesAccount && matchesSymbol && matchesStrategy && matchesDirection;
  });

  const handleDeleteSelected = () => {
    onDeleteTrades(selectedTrades);
    setSelectedTrades([]);
    toast({
      title: 'Trades Deleted',
      description: `${selectedTrades.length} trades have been deleted.`,
    });
  };

  const handleClearAll = () => {
    setClearAllDialogOpen(true);
  };

  const confirmClearAll = () => {
    onDeleteTrades(trades.map(trade => trade.id));
    setClearAllDialogOpen(false);
    toast({
      title: 'All Trades Deleted',
      description: 'All trades have been cleared from the list.',
    });
  };

  const handleDeleteTrade = (id: string) => {
    onDeleteTrade(id);
    toast({
      title: 'Trade Deleted',
      description: 'The trade has been removed from your journal.',
    });
  };

  const handleUpdateTrade = (id: string, data: Omit<Trade, 'id'>) => {
    onUpdateTrade(id, data);
    toast({
      title: 'Trade Updated',
      description: 'The trade has been successfully updated.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Trades List</h2>
        <div className="space-x-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedTrades.length === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedTrades.length})
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={trades.length === 0}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by symbol..."
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={strategyFilter} onValueChange={setStrategyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strategies</SelectItem>
            {strategies.map((strategy) => (
              <SelectItem key={strategy} value={strategy}>
                {strategy}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="LONG">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                Long
              </div>
            </SelectItem>
            <SelectItem value="SHORT">
              <div className="flex items-center">
                <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                Short
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TradesTable
        trades={filteredTrades}
        accounts={accounts}
        selectedTrades={selectedTrades}
        onSelectionChange={setSelectedTrades}
        onDeleteTrade={handleDeleteTrade}
        onUpdateTrade={handleUpdateTrade}
      />

      <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Trades</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all trades? This action cannot be undone.
              All trades will be permanently removed from your journal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}