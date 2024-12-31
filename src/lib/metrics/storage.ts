const METRICS_STORAGE_KEY = 'dashboard_metrics';
const CHARTS_STORAGE_KEY = 'dashboard_charts';
const LAYOUT_STORAGE_KEY = 'dashboard_layout';

function getUserStorageKey(userId: string, key: string): string {
  return `${userId}_${key}`;
}

export function saveMetricsState(enabledStates: Record<string, boolean>, userId?: string): void {
  const storageKey = userId ? getUserStorageKey(userId, METRICS_STORAGE_KEY) : METRICS_STORAGE_KEY;
  localStorage.setItem(storageKey, JSON.stringify(enabledStates));
}

export function loadMetricsState(userId?: string): Record<string, boolean> {
  try {
    const storageKey = userId ? getUserStorageKey(userId, METRICS_STORAGE_KEY) : METRICS_STORAGE_KEY;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveChartsState(enabledStates: Record<string, boolean>, userId?: string): void {
  const storageKey = userId ? getUserStorageKey(userId, CHARTS_STORAGE_KEY) : CHARTS_STORAGE_KEY;
  localStorage.setItem(storageKey, JSON.stringify(enabledStates));
}

export function loadChartsState(userId?: string): Record<string, boolean> {
  try {
    const storageKey = userId ? getUserStorageKey(userId, CHARTS_STORAGE_KEY) : CHARTS_STORAGE_KEY;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveLayout(layout: string[], userId?: string, type: 'metrics' | 'charts' = 'metrics'): void {
  const key = `${LAYOUT_STORAGE_KEY}_${type}`;
  const storageKey = userId ? getUserStorageKey(userId, key) : key;
  localStorage.setItem(storageKey, JSON.stringify(layout));
}

export function loadLayout(userId?: string, type: 'metrics' | 'charts' = 'metrics'): string[] | null {
  try {
    const key = `${LAYOUT_STORAGE_KEY}_${type}`;
    const storageKey = userId ? getUserStorageKey(userId, key) : key;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}