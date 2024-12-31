import { TradeFormData } from '@/types/trade';
import { Account } from '@/types/account';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INSTRUMENT_TYPES, TIMEFRAME_OPTIONS, EMOTIONAL_STATES, TRADE_DIRECTIONS } from './constants';

interface TradeDetailsFormProps {
  accounts: Account[];
  formData: TradeFormData;
  onFormChange: (data: Partial<TradeFormData>) => void;
}

export function TradeDetailsForm({ accounts, formData, onFormChange }: TradeDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="account">Trading Account</Label>
        <Select
          value={formData.accountId}
          onValueChange={(value) => onFormChange({ accountId: value })}
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
        <Label htmlFor="symbol">Symbol</Label>
        <Input
          id="symbol"
          value={formData.symbol}
          onChange={(e) => onFormChange({ symbol: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instrumentType">Instrument Type</Label>
          <Select
            value={formData.instrumentType}
            onValueChange={(value: 'STOCK' | 'FOREX' | 'CRYPTO' | 'INDEX-CFD') =>
              onFormChange({ instrumentType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSTRUMENT_TYPES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">Direction</Label>
          <Select
            value={formData.direction}
            onValueChange={(value: 'LONG' | 'SHORT') =>
              onFormChange({ direction: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRADE_DIRECTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeframe">Timeframe</Label>
        <Select
          value={formData.timeframe}
          onValueChange={(value) => onFormChange({ timeframe: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEFRAME_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emotionalState">Emotional State</Label>
        <Select
          value={formData.emotionalState}
          onValueChange={(value: 'NEUTRAL' | 'CONFIDENT' | 'FEARFUL' | 'GREEDY') =>
            onFormChange({ emotionalState: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EMOTIONAL_STATES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}