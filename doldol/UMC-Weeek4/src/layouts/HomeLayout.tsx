import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
	// useSidebar 커스텀 훅으로 상태와 제어 함수 관리
	const { isOpen, toggle, close } = useSidebar();

	return (
		<div className="min-h-dvh bg-black text-white">
			{/* 햄버거 버튼 클릭 시 자연스럽게 열고 닫힘 */}
			<Navbar onToggleSidebar={toggle} />

			<div className="flex pt-14">
				<Sidebar isOpen={isOpen} onClose={close} />
				<main className="min-h-[calc(100dvh-3.5rem)] flex-1">
					<Outlet />
				</main>
			</div>

			<FloatingButton />
		</div>
	);
};

export default HomeLayout;
