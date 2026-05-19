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
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      { root: rootRef?.current ?? null, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onIntersect, threshold]);
};
