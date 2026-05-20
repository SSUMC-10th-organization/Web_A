import { Link } from "react-router-dom";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	return (
		<>
			{/* 모바일/태블릿에서 사이드바 열렸을 때 뒷배경(외부 클릭 시 닫힘) */}
			{isOpen && (
				<button
					type="button"
					aria-label="사이드바 닫기"
					onClick={onClose}
					className="fixed inset-0 z-30 bg-black/50 lg:hidden"
				/>
			)}

			<aside
				className={`fixed top-0 left-0 z-40 h-full w-56 transform bg-black border-r border-gray-800 pt-16 transition-transform duration-300 ease-in-out
					${isOpen ? "translate-x-0" : "-translate-x-full"}
					lg:translate-x-0 lg:static lg:z-0 lg:pt-4`}
			>
				<nav className="flex flex-col gap-1 px-4 py-4">
					<Link
						to="/"
						onClick={onClose}
						className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
					>
						<span>🔍</span>
						<span>찾기</span>
					</Link>
					<Link
						to="/my"
						onClick={onClose}
						className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
					>
						<span>👤</span>
						<span>마이페이지</span>
					</Link>
				</nav>
			</aside>
		</>
	);
};

export default Sidebar;
