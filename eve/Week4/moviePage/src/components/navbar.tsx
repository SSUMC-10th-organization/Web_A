import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const activeStyle = ({ isActive }: { isActive: boolean }) => 
        isActive 
            ? "text-[#ff4757] font-bold underline underline-offset-8 decoration-2" 
            : "text-gray-500 hover:text-black transition-colors";

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
            <Link to="/" className="text-[#ff4757] font-extrabold text-2xl tracking-tighter">
                HOON MOVIE
            </Link>

            <div className="flex gap-8 text-[15px] font-medium">
                <NavLink to="/" className={activeStyle} end>
                    홈
                </NavLink>
                <NavLink to="/movies/popular" className={activeStyle}>
                    인기 영화
                </NavLink>
                <NavLink to="/movies/now-playing" className={activeStyle}>
                    현재 상영 중
                </NavLink>
                <NavLink to="/movies/top-rated" className={activeStyle}>
                    높은 평점
                </NavLink>
                <NavLink to="/movies/upcoming" className={activeStyle}>
                    개봉 예정
                </NavLink>
            </div>

            <div className="hidden md:block w-[100px]"></div>
        </nav>
    );
}