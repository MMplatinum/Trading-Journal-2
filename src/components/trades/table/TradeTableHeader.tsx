import { TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown } from 'lucide-react';

interface SortButtonProps {
  field: string;
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  direction: 'asc' | 'desc';
}

function SortButton({ field, children, onClick, active, direction }: SortButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={onClick}
    >
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 ${active ? 'opacity-100' : 'opacity-40'}`} />
    </Button>
  );
}

interface TradeTableHeaderProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: any) => void;
  selectedTrades: string[];
  totalTrades: number;
  onSelectAll: () => void;
}

export function TradeTableHeader({
  sortField,
  sortDirection,
  onSort,
  selectedTrades,
  totalTrades,
  onSelectAll,
}: TradeTableHeaderProps) {
  return (
    <TableRow>
      <TableHead className="w-12">
        <Checkbox
          checked={selectedTrades.length === totalTrades && totalTrades > 0}
          onCheckedChange={onSelectAll}
        />
      </TableHead>
      <TableHead>
        <SortButton
          field="symbol"
          onClick={() => onSort('symbol')}
          active={sortField === 'symbol'}
          direction={sortDirection}
        >
          SYMBOL
        </SortButton>
      </TableHead>
      <TableHead>
        <SortButton
          field="type"
          onClick={() => onSort('type')}
          active={sortField === 'type'}
          direction={sortDirection}
        >
          TYPE
        </SortButton>
      </TableHead>
      <TableHead>DIRECTION</TableHead>
      <TableHead>
        <SortButton
          field="entry"
          onClick={() => onSort('entry')}
          active={sortField === 'entry'}
          direction={sortDirection}
        >
          ENTRY
        </SortButton>
      </TableHead>
      <TableHead>
        <SortButton
          field="exit"
          onClick={() => onSort('exit')}
          active={sortField === 'exit'}
          direction={sortDirection}
        >
          EXIT
        </SortButton>
      </TableHead>
      <TableHead>ENTRY $</TableHead>
      <TableHead>EXIT $</TableHead>
      <TableHead>COMM.</TableHead>
      <TableHead>QTY</TableHead>
      <TableHead>
        <SortButton
          field="pl"
          onClick={() => onSort('pl')}
          active={sortField === 'pl'}
          direction={sortDirection}
        >
          P/L $
        </SortButton>
      </TableHead>
      <TableHead>
        <SortButton
          field="plPercentage"
          onClick={() => onSort('plPercentage')}
          active={sortField === 'plPercentage'}
          direction={sortDirection}
        >
          P/L %
        </SortButton>
      </TableHead>
      <TableHead>STRATEGY</TableHead>
      <TableHead className="text-right">
        <span className="sr-only">Actions</span>
      </TableHead>
    </TableRow>
  );
}