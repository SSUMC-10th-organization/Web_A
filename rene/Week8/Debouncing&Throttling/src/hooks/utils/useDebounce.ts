import { useEffect, useState } from "react";

// 값 디바운스 훅
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    console.log("✅timer set", value);
    const timer = setTimeout(() => {
      console.log("⏰debounced", value);
      setDebouncedValue(value);
    }, delay);

    return () => {
      console.log("❌timercleanup", value);
      clearTimeout(timer);
    };

  }, [value, delay]);
  return debouncedValue;
};