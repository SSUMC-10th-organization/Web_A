import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-black">
      <NavBar />
      <div className="flex-1 relative overflow-hidden">
        {/* 메인 콘텐츠 */}
        <main className="h-full bg-white overflow-y-auto flex flex-col">
          <div className="flex-1 max-w-5xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
