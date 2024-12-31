import { Transaction, Account } from '@/types/account';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { TransactionEditDialog } from './TransactionEditDialog';
import { DeleteTransactionDialog } from './DeleteTransactionDialog';

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Account[];
  onEditTransaction: (id: string, data: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsList({
  transactions = [],
  accounts = [],
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsListProps) {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

  // Sort transactions by date and time in descending order
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DATE & TIME</TableHead>
              <TableHead>ACCOUNT</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date} {transaction.time}</TableCell>
                  <TableCell>{account?.name}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell className={transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(transaction.amount, account?.currency || 'USD')}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTransaction(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTransaction(transaction)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editTransaction && (
        <TransactionEditDialog
          transaction={editTransaction}
          accounts={accounts}
          open={!!editTransaction}
          onOpenChange={(open) => !open && setEditTransaction(null)}
          onSave={(data) => {
            onEditTransaction(editTransaction.id, data);
            setEditTransaction(null);
          }}
        />
      )}

      <DeleteTransactionDialog
        transaction={deleteTransaction}
        open={!!deleteTransaction}
        onOpenChange={(open) => !open && setDeleteTransaction(null)}
        onConfirm={() => {
          if (deleteTransaction) {
            onDeleteTransaction(deleteTransaction.id);
            setDeleteTransaction(null);
          }
        }}
      />
    </>
  );
}