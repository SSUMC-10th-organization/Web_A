import { Link, Outlet } from 'react-router-dom';

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-[#222] px-6 py-4">
        <Link to="/" className="text-3xl font-bold text-pink-500">
          돌려돌려LP판
        </Link>

        <div className="flex items-center gap-3">
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
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}