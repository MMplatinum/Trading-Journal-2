import { Trade, TradeFormData } from '@/types/trade';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { TradeDetailsForm } from './TradeDetailsForm';
import { TradeEntryMethods } from './TradeEntryMethods';
import { TradeNotesForm } from './TradeNotesForm';
import { ImageUpload } from './ImageUpload';
import { useState, useEffect } from 'react';
import { Account } from '@/types/account';

interface TradeEditDialogProps {
  trade: Trade;
  accounts: Account[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TradeFormData) => void;
}

export function TradeEditDialog({
  trade,
  accounts,
  open,
  onOpenChange,
  onSave,
}: TradeEditDialogProps) {
  const [formData, setFormData] = useState<TradeFormData>({
    ...trade,
  });

  useEffect(() => {
    setFormData({ ...trade });
  }, [trade]);

  const handleFormChange = (data: Partial<TradeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Determine if this is a P/L-only trade
  const isPLOnlyTrade = trade.realizedPL !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Trade - {trade.symbol}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <TradeDetailsForm
                  accounts={accounts}
                  formData={formData}
                  onFormChange={handleFormChange}
                />
                <TradeEntryMethods
                  formData={formData}
                  onFormChange={handleFormChange}
                  isPLOnlyTrade={isPLOnlyTrade}
                />
              </div>

              <div className="space-y-6">
                <TradeNotesForm
                  formData={formData}
                  onFormChange={handleFormChange}
                />
                <div className="space-y-4">
                  <ImageUpload
                    label="Entry Screenshot"
                    type="entry"
                    value={formData.entryScreenshot}
                    onChange={(value) => handleFormChange({ entryScreenshot: value })}
                  />
                  <ImageUpload
                    label="Exit Screenshot"
                    type="exit"
                    value={formData.exitScreenshot}
                    onChange={(value) => handleFormChange({ exitScreenshot: value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-6 pb-2">
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}