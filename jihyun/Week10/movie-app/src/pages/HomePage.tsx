import { useState, useMemo, useCallback } from "react";
import type { MovieFilter as MovieFilterType, Movie, MovieResponse } from "../types/movie";
import useFetch from "../hooks/useFetch";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";

const HomePage = () => {
  const [filters, setFilters] = useState<MovieFilterType>({
    query: "",
    include_adult: false,
    language: "ko-KR",
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // useMemo로 options 참조값 고정 → useFetch 내부 useEffect 무한루프 방지
  const searchOptions = useMemo(
    () => ({
      params: {
        query: filters.query,
        include_adult: filters.include_adult,
        language: filters.language,
      },
    }),
    [filters]
  );

  const { data, isLoading, error } = useFetch<MovieResponse>(
    filters.query ? "/search/movie" : "",
    filters.query ? searchOptions : undefined
  );

  // useCallback으로 함수 참조 고정 → MovieFilter memo 효과 극대화
  const handleFilterChange = useCallback((newFilters: MovieFilterType) => {
    setFilters(newFilters);
  }, []);

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const movies = useMemo(() => data?.results ?? [], [data]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* 검색 필터 */}
        <MovieFilter onChange={handleFilterChange} />

        {/* 결과 영역 */}
        <div className="mt-8">
          {!filters.query && (
            <div className="flex h-60 items-center justify-center">
              <p className="text-gray-400">검색어를 입력하고 검색하기를 눌러주세요.</p>
            </div>
          )}

          {filters.query && isLoading && (
            <div className="flex h-60 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                <p className="text-gray-500">로딩 중...</p>
              </div>
            </div>
          )}

          {filters.query && error && !isLoading && (
            <div className="flex h-60 items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {filters.query && !isLoading && !error && data && (
            <p className="mb-4 text-sm text-gray-500">
              총 <span className="font-bold text-blue-600">{data.total_results.toLocaleString()}</span>개의 결과
            </p>
          )}

          {filters.query && !isLoading && !error && (
            <MovieList movies={movies} onMovieClick={handleMovieClick} />
          )}
        </div>
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default HomePage;