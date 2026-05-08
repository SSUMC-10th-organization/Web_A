import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BurgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
  </svg>
);

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { accessToken, nickname, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden">
      <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-[#1a1a1a] bg-black px-8 z-[100] shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="flex items-center justify-center h-10 w-10 text-gray-400 hover:text-white transition">
            <BurgerIcon />
          </button>
          <Link to="/" className="text-2xl font-black text-pink-500 tracking-tighter">돌려돌려LP판</Link>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-gray-400 hover:text-white flex items-center"><span className="text-xl">🔍</span></button>
          
          <div className="flex items-center gap-6">
            {accessToken ? (
              <div className="flex items-center gap-5">
                <span className="text-sm font-bold text-gray-300">{nickname}님 반갑습니다.</span>
                <button onClick={logout} className="text-sm font-bold text-gray-500 hover:text-white transition">로그아웃</button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition">로그인</Link>
                <Link to="/signup" className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-bold text-white hover:bg-pink-600 transition shadow-lg shadow-pink-500/20">회원가입</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside ref={sidebarRef} className={`z-[90] flex shrink-0 flex-col justify-between border-r border-[#1a1a1a] bg-black p-8 transition-all duration-300 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 p-0 opacity-0 overflow-hidden'}`}>
          <nav className="space-y-10 mt-4">
            <Link to="/lplist" className="flex items-center gap-4 text-xl font-bold text-gray-400 hover:text-white transition whitespace-nowrap">🔍 찾기</Link>
            <Link to="/my" className="flex items-center gap-4 text-xl font-bold text-gray-400 hover:text-white transition whitespace-nowrap">👤 마이페이지</Link>
          </nav>
          <button className="text-left text-sm text-gray-800 hover:text-red-500 mb-4 px-2">탈퇴하기</button>
        </aside>

        <main className="flex-1 overflow-y-auto bg-black p-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      <button onClick={() => navigate('/write')} className="fixed bottom-10 right-10 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-4xl font-black text-white shadow-2xl hover:scale-110 active:scale-95 transition shadow-pink-500/30">+</button>
    </div>
  );
}