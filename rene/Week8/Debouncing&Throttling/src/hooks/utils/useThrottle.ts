import { useRef, useCallback, useEffect } from "react";

export const useThrottle = <T extends unknown[]>(func: (...args: T) => void, delay = 300) => {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const funcRef = useRef(func);
  const lastArgsRef = useRef<T | null>(null);

  useEffect(() => { funcRef.current = func; }, [func]);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return useCallback((...args: T) => {
    if (timeoutIdRef.current) {
      console.log("❌함수 실행 대기 중", args);
      lastArgsRef.current = args;
      return;
    }

    console.log("⭕첫 함수 실행", args);
    funcRef.current(...args);

    const runTimeout = () => {
      timeoutIdRef.current = setTimeout(() => {
        if (lastArgsRef.current) {
          console.log("⏰무시된 함수 실행", lastArgsRef.current);
          funcRef.current(...lastArgsRef.current);
          lastArgsRef.current = null;
          runTimeout();
        } else {
          timeoutIdRef.current = null;
        }
      }, delay);
    };

    runTimeout();
  }, [delay]);
};
