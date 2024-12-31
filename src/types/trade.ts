export interface Trade {
  id: string;
  accountId: string;
  instrumentType: 'STOCK' | 'FOREX' | 'CRYPTO' | 'INDEX-CFD';
  direction: 'LONG' | 'SHORT';
  symbol: string;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  entryPrice?: number;
  exitPrice?: number;
  quantity?: number;
  realizedPL?: number;
  commission: number;
  timeframe: string;
  emotionalState: 'NEUTRAL' | 'CONFIDENT' | 'FEARFUL' | 'GREEDY';
  strategy: string;
  setup: string;
  notes: string;
  entryScreenshot?: string;
  exitScreenshot?: string;
}

export type TradeFormData = Omit<Trade, 'id'>;

export interface TradeValidationResult {
  isValid: boolean;
  errors: string[];
}