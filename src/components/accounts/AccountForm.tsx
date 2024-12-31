import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AccountFormProps {
  onSubmit: (account: {
    name: string;
    number: string;
    balance: number;
    currency: string;
  }) => void;
}

export function AccountForm({ onSubmit }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    balance: '',
    currency: 'USD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      balance: parseFloat(formData.balance),
    });
    setFormData({ name: '', number: '', balance: '', currency: 'USD' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="number">Account Number</Label>
        <Input
          id="number"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Initial Balance</Label>
        <Input
          id="balance"
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => setFormData({ ...formData, currency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">Add Account</Button>
    </form>
  );
}