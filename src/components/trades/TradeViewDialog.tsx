import { Trade } from '@/types/trade';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from '@/lib/utils';
import { calculateTradePL } from '@/lib/trades';
import { deleteTradeImage } from '@/lib/supabase/storage';
import { playDeleteSound } from '@/lib/utils/sound';
import { useState } from 'react';
import { ImageDialog } from './ImageDialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TradeViewDialogProps {
  trade: Trade;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTrade?: (id: string, data: Partial<Trade>) => void;
}

export function TradeViewDialog({ 
  trade, 
  open, 
  onOpenChange,
  onUpdateTrade 
}: TradeViewDialogProps) {
  const pl = calculateTradePL(trade);
  const plPercentage = (pl / (trade.entryPrice || 1) * (trade.quantity || 1)) * 100;

  const [viewImage, setViewImage] = useState<{
    type: 'entry' | 'exit';
    url: string;
  } | null>(null);

  const [deleteImage, setDeleteImage] = useState<'entry' | 'exit' | null>(null);

  const handleDeleteImage = () => {
    if (!deleteImage || !onUpdateTrade) return;

    const imageUrl = deleteImage === 'entry' ? trade.entryScreenshot : trade.exitScreenshot;
    
    if (imageUrl) {
      deleteTradeImage(imageUrl).catch(console.error);
    }

    const updates: Partial<Trade> = {
      [deleteImage === 'entry' ? 'entryScreenshot' : 'exitScreenshot']: null
    };

    onUpdateTrade(trade.id, updates);
    playDeleteSound();
    setDeleteImage(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trade Details - {trade.symbol}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Trade Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instrument Type:</span>
                    <span>{trade.instrumentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry:</span>
                    <span>{trade.entryDate} {trade.entryTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit:</span>
                    <span>{trade.exitDate} {trade.exitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeframe:</span>
                    <span>{trade.timeframe}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Performance</h3>
                <div className="space-y-2 text-sm">
                  {trade.realizedPL !== undefined ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Realized P/L:</span>
                        <span>{formatCurrency(trade.realizedPL, 'USD')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission:</span>
                        <span>{formatCurrency(trade.commission, 'USD')}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Net P/L:</span>
                        <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(pl, 'USD')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Price:</span>
                        <span>{formatCurrency(trade.entryPrice || 0, 'USD')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exit Price:</span>
                        <span>{formatCurrency(trade.exitPrice || 0, 'USD')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{trade.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Commission:</span>
                        <span>{formatCurrency(trade.commission, 'USD')}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Profit/Loss:</span>
                        <span className={pl >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(pl, 'USD')} ({plPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Strategy:</span>
                    <p className="mt-1">{trade.strategy || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Setup:</span>
                    <p className="mt-1">{trade.setup || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Emotional State:</span>
                    <p className="mt-1">{trade.emotionalState}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1">{trade.notes || 'No notes'}</p>
                  </div>
                </div>
              </div>

              {(trade.entryScreenshot || trade.exitScreenshot) && (
                <div>
                  <h3 className="font-medium mb-2">Screenshots</h3>
                  <div className="space-y-2">
                    {trade.entryScreenshot && (
                      <div className="relative group">
                        <span className="text-sm text-muted-foreground">Entry:</span>
                        <div className="mt-1 relative">
                          <img
                            src={trade.entryScreenshot}
                            alt="Entry Screenshot"
                            className="rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setViewImage({ type: 'entry', url: trade.entryScreenshot! })}
                          />
                          {onUpdateTrade && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setDeleteImage('entry')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {trade.exitScreenshot && (
                      <div className="relative group">
                        <span className="text-sm text-muted-foreground">Exit:</span>
                        <div className="mt-1 relative">
                          <img
                            src={trade.exitScreenshot}
                            alt="Exit Screenshot"
                            className="rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setViewImage({ type: 'exit', url: trade.exitScreenshot! })}
                          />
                          {onUpdateTrade && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setDeleteImage('exit')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageDialog
        open={!!viewImage}
        onOpenChange={() => setViewImage(null)}
        imageUrl={viewImage?.url}
        title={`${viewImage?.type === 'entry' ? 'Entry' : 'Exit'} Screenshot`}
      />

      <AlertDialog open={!!deleteImage} onOpenChange={(open) => !open && setDeleteImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Screenshot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this screenshot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}