import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
	onIntersect: () => void;
	enabled?: boolean;
	rootMargin?: string;
	threshold?: number;
}

/**
 * 관찰 대상 요소가 뷰포트에 들어오면 onIntersect 콜백을 호출.
 * 반환된 ref 를 트리거로 쓸 빈 div 에 달면 됨.
 */
function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
	onIntersect,
	enabled = true,
	rootMargin = "100px",
	threshold = 0,
}: UseIntersectionObserverProps) {
	const targetRef = useRef<T | null>(null);

	useEffect(() => {
		if (!enabled) return;
		const target = targetRef.current;
		if (!target) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						onIntersect();
					}
				}
			},
			{ rootMargin, threshold },
		);

		observer.observe(target);
		return () => observer.disconnect();
	}, [onIntersect, enabled, rootMargin, threshold]);

	return targetRef;
}

export default useIntersectionObserver;
