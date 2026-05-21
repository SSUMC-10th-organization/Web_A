import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDeleteUser } from "../hooks/queries/useUserMutations";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const { accessToken, logout } = useAuth();
	const navigate = useNavigate();
	const [showConfirm, setShowConfirm] = useState(false);
	const { mutate: deleteUser, isPending } = useDeleteUser();

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
			{isOpen && (
				<button
					type="button"
					aria-label="사이드바 닫기"
					onClick={onClose}
					className="fixed inset-0 z-30 bg-black/50 lg:hidden"
				/>
			)}

			<aside
				className={[
					"fixed top-0 left-0 z-40 flex flex-col w-56",
					"h-full bg-black border-r border-gray-800 pt-16",
					"transform transition-transform duration-300 ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full",
					"lg:translate-x-0 lg:static lg:z-0 lg:pt-4",
					"lg:h-[calc(100dvh-3.5rem)]",
				].join(" ")}
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
							x
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
