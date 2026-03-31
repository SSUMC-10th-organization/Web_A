import { NavLink } from 'react-router-dom';

const menus = [
  { path: '/', label: '홈' },
  { path: '/movies/popular', label: '인기 영화' },
  { path: '/movies/now_playing', label: '상영 중' },
  { path: '/movies/top_rated', label: '평점 높은 영화' },
  { path: '/movies/upcoming', label: '개봉 예정' },
];

export default function Navbar() {
  return (
    <nav className="flex flex-wrap gap-4 border-b px-6 py-4">
      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          className={({ isActive }) =>
            isActive
              ? 'font-bold text-[#BEDAB1]'
              : 'text-gray-500 hover:text-gray-700'
          }
        >
          {menu.label}
        </NavLink>
      ))}
    </nav>
  );
}