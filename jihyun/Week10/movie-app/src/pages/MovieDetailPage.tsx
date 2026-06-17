import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import useFetch from "../hooks/useFetch";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, FALLBACK_IMAGE } from "../constants/movie";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const detailOptions = useMemo(
    () => ({ params: { language: "ko-KR" } }),
    []
  );

  const { data: movie, isLoading, error } = useFetch<Movie>(
    movieId ? `/movie/${movieId}` : "",
    detailOptions
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error ?? "영화를 찾을 수 없습니다."}</p>
        <Link to="/" className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          홈으로
        </Link>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 px-6 py-4 text-white shadow-md">
        <Link to="/" className="text-sm text-blue-200 hover:text-white">
          ← 검색으로 돌아가기
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-8 sm:flex-row">
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-xl shadow-lg sm:w-64 sm:shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-gray-800">
              {movie.title}
            </h1>
            {movie.original_title !== movie.title && (
              <p className="mt-1 text-sm text-gray-500">
                {movie.original_title}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-yellow-100 px-3 py-1 font-bold text-yellow-700">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                📅 {movie.release_date}
              </span>
            </div>
            <p className="mt-6 leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
            
              <a href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-yellow-400 px-6 py-2.5 font-bold text-black hover:bg-yellow-500"
            >
              IMDb에서 검색
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailPage;