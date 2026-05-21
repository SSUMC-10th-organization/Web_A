import { useState, useEffect, useRef } from 'react';

export const useThrottle = <T>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdatedRef = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeRemaining = interval - (now - lastUpdatedRef.current);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (timeRemaining <= 0) {
      setThrottledValue(value);
      lastUpdatedRef.current = now;
    } else {
      timerRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdatedRef.current = Date.now();
      }, timeRemaining);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
};