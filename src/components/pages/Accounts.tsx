import { AccountForm } from '../accounts/AccountForm';
import { TransactionForm } from '../accounts/TransactionForm';
import { AccountsOverview } from '../accounts/AccountsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccounts } from '@/hooks/useAccounts';

export function Accounts() {
  const { 
    accounts, 
    transactions, 
    addAccount, 
    addTransaction,
    editAccount,
    deleteAccount,
    editTransaction,
    deleteTransaction,
  } = useAccounts();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountForm onSubmit={addAccount} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm 
              accounts={accounts}
              onSubmit={addTransaction}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Accounts Overview</h3>
        <AccountsOverview 
          accounts={accounts}
          transactions={transactions}
          onEditAccount={editAccount}
          onDeleteAccount={deleteAccount}
          onEditTransaction={editTransaction}
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  );
}