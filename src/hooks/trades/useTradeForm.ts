import { useState } from 'react';
import { TradeFormData } from '@/types/trade';
import { validateTradeData } from '@/lib/trades/validation';

const initialState = (accountId: string = ''): TradeFormData => ({
  accountId,
  instrumentType: 'STOCK',
  symbol: '',
  entryDate: new Date().toISOString().split('T')[0],
  entryTime: '09:30',
  exitDate: new Date().toISOString().split('T')[0],
  exitTime: '16:00',
  entryPrice: 0,
  exitPrice: 0,
  quantity: 0,
  commission: 0,
  timeframe: '1h',
  emotionalState: 'NEUTRAL',
  strategy: '',
  setup: '',
  notes: '',
});

export function useTradeForm(defaultAccountId?: string) {
  const [formData, setFormData] = useState<TradeFormData>(initialState(defaultAccountId));
  const [errors, setErrors] = useState<string[]>([]);

  const updateForm = (data: Partial<TradeFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors([]);
  };

  const resetForm = () => {
    setFormData(initialState(defaultAccountId));
    setErrors([]);
  };

  const validateForm = (): boolean => {
    const validationErrors = validateTradeData(formData);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  return {
    formData,
    errors,
    updateForm,
    resetForm,
    validateForm,
  };
}