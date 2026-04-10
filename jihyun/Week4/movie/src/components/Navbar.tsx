import { Link, useLocation } from 'react-router-dom';

const menus = [
  { category: 'popular', label: '인기 영화' },
  { category: 'now_playing', label: '상영 중' },
  { category: 'top_rated', label: '평점 높은 영화' },
  { category: 'upcoming', label: '개봉 예정' },
];

export default function Navbar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category') ?? 'popular';

  return (
    <nav className="flex flex-wrap gap-4 border-b px-6 py-4">
      <Link
        to="/movies?category=popular&page=1"
        className="font-bold text-gray-700"
      >
        홈
      </Link>

      {menus.map((menu) => {
        const isActive =
          location.pathname === '/movies' && currentCategory === menu.category;

        return (
          <Link
            key={menu.category}
            to={`/movies?category=${menu.category}&page=1`}
            className={
              isActive
                ? 'font-bold text-[#BEDAB1]'
                : 'text-gray-500 hover:text-gray-700'
            }
          >
            {menu.label}
          </Link>
        );
      })}
    </nav>
  );
}