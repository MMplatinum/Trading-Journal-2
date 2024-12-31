import { Account, Transaction } from '@/types/account';
import { formatCurrency } from '@/lib/utils';
import { calculateTransactionTotals } from '@/lib/transactions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
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
import { useState } from 'react';
import { EditAccountDialog } from './EditAccountDialog';
import { TransactionsList } from './TransactionsList';

interface AccountsOverviewProps {
  accounts: Account[];
  transactions: Transaction[];
  onDeleteAccount: (id: string) => void;
  onEditAccount: (id: string, data: Partial<Account>) => void;
  onEditTransaction: (id: string, data: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function AccountsOverview({ 
  accounts = [], 
  transactions = [], 
  onDeleteAccount,
  onEditAccount,
  onEditTransaction,
  onDeleteTransaction,
}: AccountsOverviewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAccount) {
      onDeleteAccount(selectedAccount.id);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const accountTransactions = transactions.filter(t => t.accountId === account.id);
          const { deposits, withdrawals } = calculateTransactionTotals(accountTransactions);
          
          return (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>Account #{account.number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.balance, account.currency)}
                  </div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-green-500">
                      {formatCurrency(deposits, account.currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Deposits</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-500">
                      {formatCurrency(withdrawals, account.currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(account)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(account)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <TransactionsList
          transactions={transactions}
          accounts={accounts}
          onEditTransaction={onEditTransaction}
          onDeleteTransaction={onDeleteTransaction}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
              All associated transactions will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedAccount && (
        <EditAccountDialog
          account={selectedAccount}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={(data) => {
            onEditAccount(selectedAccount.id, data);
            setEditDialogOpen(false);
          }}
        />
      )}
    </>
  );
}