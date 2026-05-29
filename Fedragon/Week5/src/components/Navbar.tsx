import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // 현재 활성화된 메뉴일 때 적용할 스타일
  const activeStyle = "text-red-500 font-bold text-lg";
  const defaultStyle = "text-white hover:text-red-300 text-lg transition-colors";

  return (
    <nav className="flex gap-8 p-6 bg-zinc-900 sticky top-0 z-50 border-b border-zinc-800">
      <div className="font-extrabold text-red-600 text-2xl mr-4">YCMovie</div>
      <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>홈</NavLink>
      <NavLink to="/popular" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>인기 영화</NavLink>
      <NavLink to="/now-playing" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>현재 상영중</NavLink>
      <NavLink to="/top-rated" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>높은 평점</NavLink>
      <NavLink to="/upcoming" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>개봉 예정</NavLink>
    </nav>
  );
};

export default Navbar;