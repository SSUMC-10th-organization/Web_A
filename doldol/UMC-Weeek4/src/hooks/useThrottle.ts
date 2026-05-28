import { useEffect, useRef, useState } from "react";

/*
 * 값이 변경되어도 interval ms 마다 한 번만 throttledValue 를 업데이트
 * 언마운트 또는 의존성 변경 시 타이머를 clearTimeout 으로 정리
 * useEffect 내 setState 를 항상 setTimeout 콜백 안에서 호출해
 * 동기적 setState 로 인한 cascading render 경고를 방지
 */
function useThrottle<T>(value: T, interval: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	const lastExecutedAt = useRef<number>(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const now = Date.now();
		const remaining = interval - (now - lastExecutedAt.current);

		// 이전 예약 타이머 제거
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// interval 이 지났으면 0ms, 아니면 남은 시간 후 반영
		// 두 케이스 모두 setTimeout 콜백 안에서 setState 호출
		// (useEffect 내 동기 setState 경고 방지)
		const delay = remaining <= 0 ? 0 : remaining;

		timerRef.current = setTimeout(() => {
			lastExecutedAt.current = Date.now();
			setThrottledValue(value);
			timerRef.current = null;
		}, delay);

		// 언마운트 또는 value/interval 변경 시 타이머 정리
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [value, interval]);

	return throttledValue;
}

export default useThrottle;