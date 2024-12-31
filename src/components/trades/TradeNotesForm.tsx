import { TradeFormData } from '@/types/trade';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TradeNotesFormProps {
  formData: TradeFormData;
  onFormChange: (data: Partial<TradeFormData>) => void;
}

export function TradeNotesForm({ formData, onFormChange }: TradeNotesFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="setup">Setup</Label>
        <Textarea
          id="setup"
          value={formData.setup}
          onChange={(e) => onFormChange({ setup: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onFormChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}