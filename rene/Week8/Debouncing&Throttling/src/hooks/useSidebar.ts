import { useState, useRef, useEffect, useCallback } from "react";

export const useSidebar = (closeDelay = 150) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
  }, [closeDelay]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return { isOpen, open, close, toggle };
};
