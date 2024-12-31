import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Account } from '@/types/account';
import { getCurrentDate, getCurrentTime } from '@/lib/dates/format';

interface TransactionFormProps {
  accounts: Account[];
  onSubmit: (transaction: {
    accountId: string;
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    time: string;
  }) => void;
}

export function TransactionForm({ accounts, onSubmit }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    type: 'deposit' as const,
    amount: '',
    date: getCurrentDate(),
    time: getCurrentTime()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId || !formData.amount) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      accountId: accounts[0]?.id || '',
      type: 'deposit',
      amount: '',
      date: getCurrentDate(),
      time: getCurrentTime()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account">Select Account</Label>
        <Select
          value={formData.accountId}
          onValueChange={(value) => setFormData({ ...formData, accountId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an account..." />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: 'deposit' | 'withdrawal') => 
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Add Transaction</Button>
    </form>
  );
}