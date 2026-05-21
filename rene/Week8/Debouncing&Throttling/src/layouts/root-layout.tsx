import { Outlet } from "react-router-dom";
import NavBar from "../components/Layout/NavBar";
import SideBar from "../components/Layout/SideBar";
import Footer from "../components/Layout/Footer";
import { useSidebar } from "../hooks/useSidebar";

const RootLayout = () => {
  const { isOpen: isSidebarOpen, open: handleOpen, close: handleClose } = useSidebar();

  return (
    <div className="flex flex-col h-screen bg-black">
      <NavBar onMenuMouseEnter={handleOpen} onMenuMouseLeave={handleClose} isOpen={isSidebarOpen} />
      <div className="flex-1 relative overflow-hidden">

        {/* 사이드바 */}
        <div
          className={`absolute top-0 left-0 h-full z-20 transition-transform duration-200 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <SideBar />
        </div>

        {/* 사이드바 열리면, 반투명 오버레이 */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-10"
            onMouseEnter={handleClose}
          />
        )}

        {/* 메인 콘텐츠 */}
        <main className="h-full bg-zinc-950 overflow-y-auto flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
