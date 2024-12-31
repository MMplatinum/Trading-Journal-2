import { TradeForm } from '../trades/TradeForm';
import { useAccounts } from '@/hooks/useAccounts';
import { useTrades } from '@/hooks/useTrades';
import { useToast } from '@/hooks/use-toast';

export function AddTrades() {
  const { accounts } = useAccounts();
  const { addTrade } = useTrades();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    addTrade(data);
    toast({
      title: 'Trade Added',
      description: 'Your trade has been successfully recorded.',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Add Trade</h2>
      <TradeForm accounts={accounts} onSubmit={handleSubmit} />
    </div>
  );
}