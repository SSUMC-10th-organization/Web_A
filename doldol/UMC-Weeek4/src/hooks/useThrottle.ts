import { useEffect, useRef, useState } from "react";

/*
 * 값이 변경되어도 interval ms 마다 한 번만 throttledValue 를 업데이트
 * 언마운트 또는 의존성 변경 시 타이머를 clearTimeout 으로 정리
 * useEffect 내 setState 를 항상 setTimeout 콜백 안에서 호출해
 * 동기적 setState 로 인한 cascading render 경고를 방지
 */

// value는 스로틀 할 값, interval은 최소 실행 간격
function useThrottle<T>(value: T, interval: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	
	// 마지막 업데이트 시간 기록 - useRef로 값이 바껴도 리렌더링 방지
	const lastExecutedAt = useRef<number>(0);
	// 타이머 저장
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const now = Date.now();
		const remaining = interval - (now - lastExecutedAt.current);

		// 이전 예약 타이머 제거
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// 간격 이 지났으면 0(즉시 실행), 아니면 남은 시간 기다리고 실행
		// 두 케이스 모두 setTimeout 콜백 안에서 setState 호출 - 동기 경고 피함
		const delay = remaining <= 0 ? 0 : remaining;

		timerRef.current = setTimeout(() => {
			lastExecutedAt.current = Date.now();
			setThrottledValue(value);
			timerRef.current = null;
		}, delay);

		// 언마운트 또는 value/interval 변경 시 타이머 취소
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [value, interval]);

	// 이 값이 변할때만 다음 페이지 호출
	return throttledValue;
}

export default useThrottle;