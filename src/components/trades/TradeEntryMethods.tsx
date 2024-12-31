import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradeFormData } from '@/types/trade';
import { usePlaybook } from '@/hooks/usePlaybook';

interface TradeEntryMethodsProps {
  formData: TradeFormData;
  onFormChange: (data: Partial<TradeFormData>) => void;
  isPLOnlyTrade?: boolean;
}

export function TradeEntryMethods({ formData, onFormChange, isPLOnlyTrade = false }: TradeEntryMethodsProps) {
  const [entryMethod, setEntryMethod] = useState<'detailed' | 'simple'>(
    isPLOnlyTrade ? 'simple' : 'detailed'
  );
  const { strategies } = usePlaybook();

  // Lock the entry method if this is a P/L-only trade being edited
  useEffect(() => {
    if (isPLOnlyTrade) {
      setEntryMethod('simple');
    }
  }, [isPLOnlyTrade]);

  const handleMethodChange = (value: 'detailed' | 'simple') => {
    if (isPLOnlyTrade) return; // Prevent changing method if P/L-only trade
    
    setEntryMethod(value);
    // Reset values when switching methods
    if (value === 'detailed') {
      onFormChange({ 
        realizedPL: undefined,
        entryPrice: 0,
        exitPrice: 0,
        quantity: 0 
      });
    } else {
      onFormChange({ 
        realizedPL: 0,
        entryPrice: undefined,
        exitPrice: undefined,
        quantity: undefined 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Date and Time Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
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

        <div className="space-y-4">
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
      </div>

      <div className="space-y-2">
        <Label>Entry Method</Label>
        <RadioGroup
          value={entryMethod}
          onValueChange={(value) => handleMethodChange(value as 'detailed' | 'simple')}
          className="flex gap-4"
          disabled={isPLOnlyTrade}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="detailed" id="detailed" />
            <Label htmlFor="detailed">Detailed Entry</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simple" id="simple" />
            <Label htmlFor="simple">Direct P/L</Label>
          </div>
        </RadioGroup>
        {isPLOnlyTrade && (
          <p className="text-sm text-muted-foreground mt-1">
            This trade was created with direct P/L input and cannot be converted to detailed entry.
          </p>
        )}
      </div>

      {entryMethod === 'detailed' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.entryPrice || ''}
                onChange={(e) => onFormChange({ 
                  entryPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Optional"
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
                onChange={(e) => onFormChange({ 
                  exitPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity || ''}
                onChange={(e) => onFormChange({ 
                  quantity: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Optional"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="realizedPL">Realized P/L (before commission)</Label>
            <Input
              id="realizedPL"
              type="number"
              step="0.01"
              value={formData.realizedPL || ''}
              onChange={(e) => onFormChange({ 
                realizedPL: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
              placeholder="Enter your profit/loss before commission"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="commission">Commission & Swap</Label>
        <Input
          id="commission"
          type="number"
          step="0.01"
          value={formData.commission === 0 ? '' : formData.commission}
          onChange={(e) => onFormChange({ 
            commission: e.target.value ? parseFloat(e.target.value) : 0 
          })}
          placeholder="Enter commission and swap fees"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Note: Use negative values for rebates/credits
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="strategy">Strategy (Optional)</Label>
        <Select
          value={formData.strategy || "none"}
          onValueChange={(value) => onFormChange({ strategy: value === "none" ? "" : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a strategy..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {strategies.map((strategy) => (
              <SelectItem key={strategy.id} value={strategy.title}>
                {strategy.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}