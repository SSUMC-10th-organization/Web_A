import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
  const { category } = useParams();
  const currentCategory = category ?? 'popular';

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsPending(true);
        setIsError(false);

        const response = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${currentCategory}?language=ko-KR&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovies(response.data.results);
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
    setSearchParams({ page: String(currentPage - 1) });
  };

  const handleNextPage = () => {
    setSearchParams({ page: String(currentPage + 1) });
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