import { useEffect, useState } from "react";

/*
 * 값이 변경된 뒤 delay ms 동안 변경이 없으면 debouncedValue 업데이트
 * 언마운트시 타이머를 clearTimeout 으로 정리
 */
function useDebounce<T>(value: T, delay = 300): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
