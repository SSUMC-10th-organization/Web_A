import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
	onIntersect: () => void;
	enabled?: boolean;
	rootMargin?: string;
	threshold?: number;
}

/*
 * onIntersect 를 ref 에 저장 → Observer 는 enabled/rootMargin/threshold 가
 * 바뀔 때만 재구독. 콜백이 바뀌어도 Observer 가 disconnect/reconnect 되지 않으므로
 * 재구독 시 즉시 재발동하는 문제가 없음 → useThrottle 이 정상 동작.
 */
function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
	onIntersect,
	enabled = true,
	rootMargin = "100px",
	threshold = 0,
}: UseIntersectionObserverProps) {
	const targetRef = useRef<T | null>(null);

	// 콜백은 ref 로 보관 → 최신 함수를 참조하되 Observer 재구독은 하지 않음
	const onIntersectRef = useRef(onIntersect);
	useEffect(() => {
		onIntersectRef.current = onIntersect;
	}, [onIntersect]);

	useEffect(() => {
		if (!enabled) return;
		const target = targetRef.current;
		if (!target) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// ref 를 통해 항상 최신 콜백 호출
						onIntersectRef.current();
					}
				}
			},
			{ rootMargin, threshold },
		);

		observer.observe(target);
		return () => observer.disconnect();
		// onIntersect 는 의존성에서 제거 → 콜백 변경 시 재구독 없음
	}, [enabled, rootMargin, threshold]);

	return targetRef;
}

export default useIntersectionObserver;