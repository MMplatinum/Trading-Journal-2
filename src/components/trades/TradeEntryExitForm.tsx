import { TradeFormData } from '@/types/trade';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TradeEntryExitFormProps {
  formData: TradeFormData;
  onFormChange: (data: Partial<TradeFormData>) => void;
}

export function TradeEntryExitForm({ formData, onFormChange }: TradeEntryExitFormProps) {
  const handleNumberChange = (field: keyof TradeFormData, value: string) => {
    // Special handling for commission to allow empty value
    if (field === 'commission') {
      const numberValue = value === '' ? 0 : parseFloat(value);
      onFormChange({ [field]: numberValue });
      return;
    }
    
    // For other fields, maintain the existing behavior
    const numberValue = value === '' ? 0 : parseFloat(value);
    onFormChange({ [field]: numberValue });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entryDate">Entry Date</Label>
          <Input
            id="entryDate"
            type="date"
            value={formData.entryDate}
            onChange={(e) => onFormChange({ entryDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="entryTime">Entry Time</Label>
          <Input
            id="entryTime"
            type="time"
            value={formData.entryTime}
            onChange={(e) => onFormChange({ entryTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exitDate">Exit Date</Label>
          <Input
            id="exitDate"
            type="date"
            value={formData.exitDate}
            onChange={(e) => onFormChange({ exitDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exitTime">Exit Time</Label>
          <Input
            id="exitTime"
            type="time"
            value={formData.exitTime}
            onChange={(e) => onFormChange({ exitTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entryPrice">Entry Price</Label>
          <Input
            id="entryPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.entryPrice || ''}
            onChange={(e) => handleNumberChange('entryPrice', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exitPrice">Exit Price</Label>
          <Input
            id="exitPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.exitPrice || ''}
            onChange={(e) => handleNumberChange('exitPrice', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={formData.quantity || ''}
            onChange={(e) => handleNumberChange('quantity', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commission">Commission & Swap</Label>
          <Input
            id="commission"
            type="number"
            step="0.01"
            min="0"
            value={formData.commission === 0 ? '' : formData.commission}
            onChange={(e) => handleNumberChange('commission', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}