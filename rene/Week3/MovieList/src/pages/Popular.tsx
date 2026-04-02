import useMovies from "../hooks/useMovies";
import MovieGrid from "../components/MovieGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Popular = () => {
  const { movies, isPending, isError, page, setPage, totalPages } = useMovies(
    `${API_BASE_URL}/movie/popular?language=en-US`
  );

  return (
    <div className="px-8 py-5 bg-black min-h-screen">
      <p className="text-[48px] pt-12 text-left font-extrabold mb-6 text-white">인기 영화</p>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      {isPending && <LoadingSpinner />}
      {isError && <p className="text-center text-red-400 py-20">오류가 발생했습니다. 다시 시도해주세요.</p>}
      {!isPending && !isError && <MovieGrid movies={movies} />}
    </div>
  );
};

export default Popular;
