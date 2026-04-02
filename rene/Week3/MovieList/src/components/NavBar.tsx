import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Popular" },
  { to: "/movies", label: "Movies" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold tracking-wide text-white hover:text-yellow-500 transition-colors">
          RENE movieList
        </Link>
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  pathname === to
                    ? "text-white"
                    : "text-white/80 hover:text-white/50"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;