import { Account } from '@/types/account';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface CalendarFiltersProps {
  accounts: Account[];
  selectedAccountId: string;
  selectedSymbol: string;
  selectedStrategy: string;
  selectedDirection: string;
  strategies: string[];
  onAccountChange: (value: string) => void;
  onSymbolChange: (value: string) => void;
  onStrategyChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
}

export function CalendarFilters({
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
}: CalendarFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select value={selectedAccountId} onValueChange={onAccountChange}>
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
          value={selectedSymbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="pl-8"
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
  );
}