import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  // delay 시간 후에 최종적으로 반환할 디바운스된 값
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 시간 후에 value를 debouncedValue로 업데이트하는 타이머를 시작합니다
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value가 변경되면 기존 타이머를 지워서 업데이트를 취소합니다
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value, delay가 변경될 때마다 실행

  // 잠시 대기한 후에 값을 반환합니다
  return debouncedValue;
}

export default useDebounce;