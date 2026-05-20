import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";

interface NavbarProps {
	onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
	const { accessToken, logout } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState<string>("");

	// 로그인 상태면 내 정보(닉네임)를 가져와 환영 문구에 사용
	useEffect(() => {
		if (!accessToken) {
			return;
		}
		let active = true;
		getMyInfo()
			.then((res) => {
				if (active) setName(res.data.name);
			})
			.catch(() => {
				if (active) setName("");
			});
		return () => {
			active = false;
		};
	}, [accessToken]);

    const displayName = accessToken ? name : "";

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-black px-4 border-b border-gray-800">
			<div className="flex items-center gap-3">
				{/* 버거 버튼 - 사이드바 토글 */}
				<button
					type="button"
					aria-label="메뉴 열기"
					onClick={onToggleSidebar}
					className="text-white hover:text-pink-500 transition-colors"
				>
					<svg
						width="28"
						height="28"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
					>
						<title>메뉴</title>
						<line x1="8" y1="14" x2="40" y2="14" />
						<line x1="8" y1="24" x2="40" y2="24" />
						<line x1="8" y1="34" x2="40" y2="34" />
					</svg>
				</button>
				<Link to="/" className="text-xl font-extrabold text-pink-500">
					DolDol LP판
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<button
					type="button"
					aria-label="검색"
					className="text-white hover:text-pink-500 transition-colors"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<title>검색</title>
						<circle cx="11" cy="11" r="7" />
						<line x1="16.5" y1="16.5" x2="21" y2="21" />
					</svg>
				</button>

				{accessToken ? (
					<>
						<span className="text-sm text-gray-200">
							{displayName ? `${displayName}님 반갑습니다.` : "반갑습니다."}
						</span>
						<button
							type="button"
							onClick={handleLogout}
							className="text-sm text-gray-300 hover:text-white transition-colors"
						>
							로그아웃
						</button>
					</>
				) : (
					<>
						<Link
							to="/login"
							className="text-sm text-gray-300 hover:text-white transition-colors"
						>
							로그인
						</Link>
						<Link
							to="/signup"
							className="rounded-md bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
						>
							회원가입
						</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Navbar;
