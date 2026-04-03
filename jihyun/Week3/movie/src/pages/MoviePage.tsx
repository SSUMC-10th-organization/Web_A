import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') ?? 'popular';
  const currentPage = Number(searchParams.get('page') ?? '1');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsPending(true);
        setIsError(false);

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${currentCategory}?language=ko-KR&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('영화 목록 요청 실패');
        }

        const data: MovieResponse = await response.json();
        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [currentCategory, currentPage]);

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setSearchParams({
      category: currentCategory,
      page: String(currentPage - 1),
    });
  };

  const handleNextPage = () => {
    setSearchParams({
      category: currentCategory,
      page: String(currentPage + 1),
    });
  };

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <strong className="text-2xl text-red-500">에러가 발생했습니다.</strong>
      </div>
    );
  }

  return (
    <div>
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="cursor-pointer rounded-lg bg-[#BEDAB1] px-6 py-3 text-white shadow-md transition duration-200 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          이전
        </button>

        <span className="font-semibold">{currentPage} 페이지</span>

        <button
          onClick={handleNextPage}
          className="cursor-pointer rounded-lg bg-[#BEDAB1] px-6 py-3 text-white shadow-md transition duration-200"
        >
          다음
        </button>
      </div>
    </div>
  );
}