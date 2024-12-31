import { Account, Transaction } from '@/types/account';

export function calculateAccountBalance(
  initialBalance: number,
  transactions: Transaction[]
): number {
  return transactions.reduce((balance, transaction) => {
    const amount = transaction.type === 'deposit' ? transaction.amount : -transaction.amount;
    return balance + amount;
  }, initialBalance);
}

export function calculateTransactionTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'deposit') {
        acc.deposits += transaction.amount;
      } else {
        acc.withdrawals += transaction.amount;
      }
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );
}

export function updateAccountBalance(
  account: Account,
  transaction: Omit<Transaction, 'id'>
): number {
  const amount = transaction.type === 'deposit' ? transaction.amount : -transaction.amount;
  return account.balance + amount;
}