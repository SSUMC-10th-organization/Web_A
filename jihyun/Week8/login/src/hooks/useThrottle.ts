import { useState, useEffect, useRef } from 'react';

/**
 * useThrottle
 * 주어진 값이 자주 변경될 때 최소 delay(ms) 간격으로만 업데이트해서 성능을 개선합니다.
 */
function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 마지막으로 실행된 시간을 저장 (ref는 렌더링을 트리거하지 않음)
  const lastExec = useRef<number>(0);

  useEffect(() => {
    // value, delay가 변경될 때 아래 로직 실행
    if (Date.now() >= lastExec.current + delay) {
      // 현재 시각으로 lastExec 업데이트
      lastExec.current = Date.now();
      // 최신 value를 throttledValue에 업데이트 → 컴포넌트 리렌더링
      setThrottledValue(value);
    } else {
      // 충분한 시간이 지나지 않은 경우: delay 이후에 업데이트
      const timerId = setTimeout(() => {
        // 타이머가 완료되면 마지막 업데이트 시간을 현재 시각으로 갱신
        lastExec.current = Date.now();
        // 다시 최신 value로 throttledValue 업데이트 → 리렌더링
        setThrottledValue(value);
      }, delay);

      // cleanup function: 이펙트가 실행되기 전에 기존 타이머를 취소하여 중복 업데이트를 방지합니다
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;