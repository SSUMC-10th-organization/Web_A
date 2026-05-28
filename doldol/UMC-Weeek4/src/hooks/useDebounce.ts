import { useEffect, useState } from "react";

/*
 * 값이 변경된 뒤 delay ms 동안 변경이 없으면 debouncedValue 업데이트
 * 언마운트시 타이머를 clearTimeout 으로 정리
 */

// value는 지연시킬 값, delay는 기다릴 시간
function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	// value가 바뀌면 타이머 가동
	// deay 동안 추가 변화 없으면 디부은스 밸류를 업뎃
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// 언마운트 or value/delay 변경 시 이전 타이머 제거
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
