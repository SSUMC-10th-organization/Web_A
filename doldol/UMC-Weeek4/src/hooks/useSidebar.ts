import { useCallback, useState } from "react";

/* 사이드바 열림/닫힘 상태와 제어 함수를 제공하는 커스텀 훅 */
function useSidebar(initialState = false) {
	const [isOpen, setIsOpen] = useState(initialState);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	return { isOpen, open, close, toggle };
}

export default useSidebar;
