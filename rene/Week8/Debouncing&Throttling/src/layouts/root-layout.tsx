import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Layout/NavBar";
import SideBar from "../components/Layout/SideBar";
import Footer from "../components/Layout/Footer";
import SearchOverlay from "../components/Layout/SearchOverlay";
import { SearchProvider, useSearchOverlay } from "../context/SearchContext";

const RootLayoutInner = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isOpen: isSearchOpen } = useSearchOverlay(); // 검색 오버레이 상태

  const handleOpen = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsSidebarOpen(true);
  };

  const handleClose = () => {
    closeTimerRef.current = setTimeout(() => setIsSidebarOpen(false), 150);
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <NavBar onMenuMouseEnter={handleOpen} onMenuMouseLeave={handleClose} />
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

        {/* 반투명 오버레이 */}
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

        {/* 검색 오버레이 */}
        {isSearchOpen && <SearchOverlay />}
      </div>
    </div>
  );
};

const RootLayout = () => (
  <SearchProvider>
    <RootLayoutInner />
  </SearchProvider>
);

export default RootLayout;
