import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/mutations/useLogout";
import { useSearchOverlay } from "../../context/SearchContext";
import menuIcon from "../../assets/menu-icon.svg";
import searchIcon from "../../assets/search-icon.svg";

interface NavBarProps {
  onMenuMouseEnter: () => void;
  onMenuMouseLeave: () => void;
};

const NavBar = ({ onMenuMouseEnter, onMenuMouseLeave }: NavBarProps) => {
  const { accessToken, user } = useAuth();
  const { mutate: logout } = useLogout();
  const { open: openSearch } = useSearchOverlay(); // 검색 오버레이 열기 함수

  return (
    <nav className="w-full bg-zinc-900 px-5 py-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
      <div className="flex items-center gap-4">
        <button onMouseEnter={onMenuMouseEnter} onMouseLeave={onMenuMouseLeave} className="text-white">
          <img src={menuIcon} alt="menu" className="w-5 h-5" />
        </button>
        <Link to="/" className="text-pink-500 text-2xl font-bold tracking-tight">
          RENE LP
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={openSearch} className="text-white hover:opacity-70 transition-opacity">
          <img src={searchIcon} alt="search" className="w-6 h-6" />
        </button>

        {accessToken ? (
          <>
            <span className="text-white text-sm">{user?.name ?? ""}님 반갑습니다.</span>
            <button
              onClick={() => logout()}
              className="text-white text-sm hover:text-pink-400 transition-colors"
            >
              로그아웃
            </button>
          </>
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
