export const TIMEFRAME_OPTIONS = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: 'Daily' },
] as const;

export const INSTRUMENT_TYPES = [
  { value: 'STOCK', label: 'Stock' },
  { value: 'FOREX', label: 'Forex' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'INDEX-CFD', label: 'Index CFD' },
] as const;

export const EMOTIONAL_STATES = [
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'CONFIDENT', label: 'Confident' },
  { value: 'CONCENTRATED', label: 'Concentrated' },
  { value: 'FEARFUL', label: 'Fearful' },
  { value: 'GREEDY', label: 'Greedy' },
  { value: 'INSECURE', label: 'Insecure' },
  { value: 'ANGRY', label: 'Angry' },
  { value: 'IMPATIENT', label: 'Impatient' },
  { value: 'FRUSTRATED', label: 'Frustrated' },
  { value: 'TIRED', label: 'Tired' },
] as const;

export const TRADE_DIRECTIONS = [
  { value: 'LONG', label: 'Long' },
  { value: 'SHORT', label: 'Short' },
] as const;