export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  time: string;
}