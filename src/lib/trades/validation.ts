import { TradeFormData, TradeValidationResult } from '@/types/trade';

export function validateTradeData(data: TradeFormData): TradeValidationResult {
  const errors: string[] = [];

  // Required fields regardless of entry method
  if (!data.accountId) errors.push('Account is required');
  if (!data.symbol) errors.push('Symbol is required');
  if (!data.direction) errors.push('Direction is required');
  if (!data.entryDate) errors.push('Entry date is required');
  if (!data.exitDate) errors.push('Exit date is required');
  if (!data.entryTime) errors.push('Entry time is required');
  if (!data.exitTime) errors.push('Exit time is required');
  if (data.commission < 0) errors.push('Commission cannot be negative');

  // Validate based on entry method
  const hasDetailedEntry = data.entryPrice !== undefined || 
                          data.exitPrice !== undefined || 
                          data.quantity !== undefined;
                          
  const hasSimpleEntry = data.realizedPL !== undefined;

  if (hasDetailedEntry && hasSimpleEntry) {
    errors.push('Please use either detailed entry or direct P/L, not both');
  }

  if (!hasDetailedEntry && !hasSimpleEntry) {
    errors.push('Please provide either trade details or realized P/L');
  }

  // Validate detailed entry if used
  if (hasDetailedEntry) {
    if (data.entryPrice !== undefined && data.entryPrice <= 0) {
      errors.push('Entry price must be greater than 0');
    }
    if (data.exitPrice !== undefined && data.exitPrice <= 0) {
      errors.push('Exit price must be greater than 0');
    }
    if (data.quantity !== undefined && data.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}