import { useEffect, type RefObject } from "react";

interface Options {
  rootRef?: RefObject<Element | null>;
  threshold?: number;
}

export const useIntersectionObserver = (
  sentinelRef: RefObject<Element | null>,
  onIntersect: () => void,
  enabled: boolean,
  { rootRef, threshold = 0.1 }: Options = {}
) => {
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !enabled) return; // 요소가 없거나 옵저버가 비활성화된 경우 관찰 중지

    // 관찰자 생성
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 센티넬 요소가 뷰포트에 들어오면 onIntersect 콜백 실행
        if (entry.isIntersecting) onIntersect(); 
      },
      { root: rootRef?.current ?? null, threshold }
    );

    // 센티넬 요소 관찰 시작
    observer.observe(el);
    // 컴포넌트 언마운트 시 관찰자 해제
    return () => observer.disconnect();
  }, [enabled, onIntersect, threshold]);
};
