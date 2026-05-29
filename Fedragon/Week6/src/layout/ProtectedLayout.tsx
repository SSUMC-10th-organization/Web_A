import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 화면 최상단에 고정되는 네비게이션 바 */}
      <Navbar />

      {/* p-8: 사방에 기본 여백을 준다.
        pt-24: 위쪽 여백만 특별히 크게 주어서 고정된 Navbar 아래로 콘텐츠를 밀어낸다.
      */}
      <main className="max-w-7xl mx-auto p-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;