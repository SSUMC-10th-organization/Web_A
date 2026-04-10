import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="w-full bg-black px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-pink-500 text-xl font-bold tracking-tight">
        돌려돌려LP판
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-1.5 border border-white text-white text-sm rounded hover:bg-white hover:text-black transition-colors"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded hover:bg-pink-600 transition-colors"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
