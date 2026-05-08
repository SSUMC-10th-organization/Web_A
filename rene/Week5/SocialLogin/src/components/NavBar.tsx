import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { accessToken } = useAuth();

  return (
    <nav className="w-full bg-black px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-pink-500 text-xl font-bold tracking-tight">
        RENE Movie
      </Link>
      <div className="flex items-center gap-3">
        {accessToken ? (
          <Link
            to="/mypage"
            className="px-4 py-1.5 border border-white text-white text-sm rounded hover:bg-white hover:text-black transition-colors"
          >
            마이페이지
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;