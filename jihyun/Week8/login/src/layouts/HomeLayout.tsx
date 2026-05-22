import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';
import { HamburgerButton } from '../components/HamburgerButton';
import { Sidebar } from '../components/Sidebar';
import useSidebar from '../hooks/useSidebar';

export default function HomeLayout() {
  const { accessToken, logout } = useAuth();
  const { isOpen, toggle, close } = useSidebar();

  const { data: myData } = useQuery({
    queryKey: ['me'],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const myName = myData?.data?.name;

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-[#222] px-6 py-4">
        <div className="flex items-center gap-3">
          <HamburgerButton onClick={toggle} isOpen={isOpen} />
          <Link to="/" className="text-3xl font-bold text-pink-500">
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {accessToken ? (
            <>
              {myName && (
                <span className="text-sm text-gray-300">{myName}</span>
              )}
              <Link
                to="/my"
                className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                마이페이지
              </Link>
              <button
                onClick={logout}
                className="rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111]"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111]"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </header>

      <Sidebar isOpen={isOpen} onClose={close} />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}