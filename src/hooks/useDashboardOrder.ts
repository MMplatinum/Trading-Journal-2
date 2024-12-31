import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dashboard_card_order';

export function useDashboardOrder(defaultOrder: string[]) {
  const [orderedMetrics, setOrderedMetrics] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved order with default order to handle new metrics
      const mergedOrder = [...new Set([...parsed, ...defaultOrder])];
      // Only keep metrics that exist in defaultOrder
      return mergedOrder.filter(id => defaultOrder.includes(id));
    }
    return defaultOrder;
  });

  // Only update storage when order changes by user action
  const updateOrder = useCallback((newOrder: string[] | ((prev: string[]) => string[])) => {
    setOrderedMetrics(current => {
      const nextOrder = typeof newOrder === 'function' ? newOrder(current) : newOrder;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrder));
      return nextOrder;
    });
  }, []);

  return { orderedMetrics, updateOrder };
}