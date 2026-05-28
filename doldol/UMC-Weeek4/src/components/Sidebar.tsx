import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDeleteUser } from "../hooks/queries/useUserMutations";
import SearchModal from "./SearchModal";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const { accessToken, logout } = useAuth();
	const navigate = useNavigate();
	const [showConfirm, setShowConfirm] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const { mutate: deleteUser, isPending } = useDeleteUser();

	// ESC 키로 사이드바 닫기
	// keydown EventListener 등록, 클린업으로 메모리 누수 방지
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	// 사이드바 열릴 때 배경 스크롤 방지
	// hidden 으로 뒷배경 콘텐츠가 스크롤되는 현상 방지
	// 안열린 경우 클린업 해서 다시 스크롤 ㄱㄴ하게
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		// 언마운트시 복원
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const handleWithdraw = () => {
		deleteUser(undefined, {
			onSuccess: async () => {
				await logout();
				navigate("/login", { replace: true });
			},
			onError: () => alert("탈퇴 처리 중 오류가 발생했습니다."),
		});
	};

	return (
		<>
			{/* 모바일 백드롭 */}
			{isOpen && (
				<button
					type="button"
					aria-label="사이드바 닫기"
					onClick={onClose}
					className="fixed inset-0 z-30 bg-black/50 lg:hidden"
				/>
			)}

			{/* transition-transform 으로 부드러운 전환 */}
			<aside
				className={[
					"fixed top-0 left-0 z-40 flex flex-col w-56",
					"h-full bg-black border-r border-gray-800 pt-16",
					"transition-transform duration-300 ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full",
					"lg:translate-x-0 lg:sticky lg:top-14 lg:z-0 lg:pt-4",
					"lg:h-[calc(100dvh-3.5rem)] lg:self-start",
				].join(" ")}
			>
				<nav className="flex flex-col gap-1 px-4 py-4">
					<button
						type="button"
						onClick={() => { onClose(); setSearchOpen(true); }}
						className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors text-left w-full"
					>
						<span>🔍</span>
						<span>찾기</span>
					</button>

					{accessToken && (
						<Link
							to="/my"
							onClick={onClose}
							className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
						>
							<span>👤</span>
							<span>마이페이지</span>
						</Link>
					)}
				</nav>

				{accessToken && (
					<div className="mt-auto px-4 pb-6">
						<button
							type="button"
							onClick={() => setShowConfirm(true)}
							className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors text-left"
						>
							<span>🚪</span>
							<span>탈퇴하기</span>
						</button>
					</div>
				)}
			</aside>

			<SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

			{showConfirm && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
					onClick={() => setShowConfirm(false)}
				>
					<div
						className="relative rounded-2xl bg-gray-900 p-8 shadow-xl text-center w-72"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={() => setShowConfirm(false)}
							className="absolute right-4 top-4 text-gray-400 hover:text-white text-xl"
						>
							×
						</button>
						<p className="mb-6 text-white font-semibold text-lg">
							정말 탈퇴하시겠습니까?
						</p>
						<div className="flex justify-center gap-3">
							<button
								type="button"
								onClick={handleWithdraw}
								disabled={isPending}
								className="rounded-md bg-white text-gray-900 px-6 py-2 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
							>
								{isPending ? "처리중..." : "예"}
							</button>
							<button
								type="button"
								onClick={() => setShowConfirm(false)}
								className="rounded-md bg-pink-500 text-white px-6 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
							>
								아니오
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Sidebar;
