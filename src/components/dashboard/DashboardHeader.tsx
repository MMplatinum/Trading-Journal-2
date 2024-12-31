import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Account } from '@/types/account';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  accounts: Account[];
  selectedAccountId: string;
  selectedSymbol: string;
  selectedStrategy: string;
  selectedDirection: string;
  strategies: string[];
  onAccountChange: (accountId: string) => void;
  onSymbolChange: (symbol: string) => void;
  onStrategyChange: (strategy: string) => void;
  onDirectionChange: (direction: string) => void;
}

export function DashboardHeader({ 
  title, 
  accounts,
  selectedAccountId,
  selectedSymbol,
  selectedStrategy,
  selectedDirection,
  strategies,
  onAccountChange,
  onSymbolChange,
  onStrategyChange,
  onDirectionChange,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Drag cards to reorder
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Select value={selectedAccountId} onValueChange={onAccountChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
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

        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by symbol..."
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <Select value={selectedStrategy} onValueChange={onStrategyChange}>
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

        <Select value={selectedDirection} onValueChange={onDirectionChange}>
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
    </div>
  );
}