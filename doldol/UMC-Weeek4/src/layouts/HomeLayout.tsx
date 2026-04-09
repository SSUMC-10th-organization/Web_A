import { Outlet, useLocation, useNavigate } from "react-router-dom";

const HomeLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const isHome = location.pathname === "/";

	const navItems = [
		{ label: "로그인", path: "/login" },
		{ label: "회원가입", path: "/signup" },
	];

	return (
		<div className="h-dvh flex flex-col">
			<nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
				<div className="flex items-center gap-3">
					{/* 홈이 아닐 때만 뒤로가기 버튼 표시 */}
					{!isHome && (
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="text-gray-600 hover:text-blue-600 text-xl font-bold transition-colors cursor-pointer"
						>
							‹
						</button>
					)}
					<button
						type="button"
						className="font-bold text-lg cursor-pointer bg-transparent border-none p-0"
						onClick={() => navigate("/")}
					>
						홈
					</button>
				</div>
				<div className="flex gap-2">
					{navItems.map((item) => (
						<button
							key={item.path}
							type="button"
							onClick={() => navigate(item.path)}
							className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer
                                ${
																	location.pathname === item.path
																		? "bg-blue-600 text-white"
																		: "bg-gray-100 text-gray-700 hover:bg-blue-100"
																}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</nav>
			<main className="flex-1">
				<Outlet />
			</main>
			<footer>푸터</footer>
		</div>
	);
};

export default HomeLayout;
