import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/",            label: "홈" },
  { to: "/movies/popular",     label: "인기 영화" },
  { to: "/movies/now-playing", label: "상영 중" },
  { to: "/movies/top-rated",   label: "평점 높은" },
  { to: "/movies/upcoming",    label: "개봉 예정" },
];

const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="text-xl font-bold tracking-wide text-white hover:text-yellow-500 transition-colors">
          RENE movieList
        </NavLink>
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive ? "text-white" : "text-white/80 hover:text-white/50"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;