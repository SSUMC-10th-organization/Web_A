import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";

const HomeLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-dvh bg-black text-white">
			<Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

			<div className="flex pt-14">
				<Sidebar
					isOpen={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
				/>

				<main className="min-h-[calc(100dvh-3.5rem)] flex-1">
					<Outlet />
				</main>
			</div>

			<FloatingButton />
		</div>
	);
};

export default HomeLayout;
