import { useState } from 'react';
import { Account } from '@/types/account';
import { TradeFormData } from '@/types/trade';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradeDetailsForm } from './TradeDetailsForm';
import { TradeEntryMethods } from './TradeEntryMethods';
import { TradeNotesForm } from './TradeNotesForm';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { validateTradeData } from '@/lib/trades/validation';
import { getCurrentDate, getCurrentTime, toUTCDate } from '@/lib/dates/format';

const initialFormState = (accountId: string = ''): TradeFormData => ({
  accountId,
  instrumentType: 'STOCK',
  direction: 'LONG',
  symbol: '',
  entryDate: getCurrentDate(),
  entryTime: getCurrentTime(),
  exitDate: getCurrentDate(),
  exitTime: getCurrentTime(),
  commission: 0,
  timeframe: '1h',
  emotionalState: 'NEUTRAL',
  strategy: '',
  setup: '',
  notes: '',
});

export function TradeForm({ accounts, onSubmit }: TradeFormProps) {
  const [formData, setFormData] = useState<TradeFormData>(
    initialFormState(accounts[0]?.id)
  );
  const [entryScreenshot, setEntryScreenshot] = useState<string>();
  const [exitScreenshot, setExitScreenshot] = useState<string>();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTradeData(formData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join('\n'),
        variant: "destructive"
      });
      return;
    }
    
    // Convert dates to UTC before submitting
    const submissionData = {
      ...formData,
      entryDate: toUTCDate(formData.entryDate),
      exitDate: toUTCDate(formData.exitDate),
      entryScreenshot,
      exitScreenshot,
    };
    
    onSubmit(submissionData);
    
    toast({
      title: "Trade Added",
      description: "Your trade has been successfully recorded.",
      duration: 3000,
    });
    
    setFormData(initialFormState(accounts[0]?.id));
    setEntryScreenshot(undefined);
    setExitScreenshot(undefined);
  };

  const handleFormChange = (data: Partial<TradeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trade Details</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeDetailsForm
              accounts={accounts}
              formData={formData}
              onFormChange={handleFormChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeEntryMethods
              formData={formData}
              onFormChange={handleFormChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeNotesForm
              formData={formData}
              onFormChange={handleFormChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screenshots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              label="Entry Screenshot"
              type="entry"
              value={entryScreenshot}
              onChange={setEntryScreenshot}
            />
            <ImageUpload
              label="Exit Screenshot"
              type="exit"
              value={exitScreenshot}
              onChange={setExitScreenshot}
            />
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full">Add Trade</Button>
    </form>
  );
}