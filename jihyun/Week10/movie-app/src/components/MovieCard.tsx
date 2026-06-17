import { memo } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, FALLBACK_IMAGE } from "../constants/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = memo(({ movie, onClick }: MovieCardProps) => {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : FALLBACK_IMAGE;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl hover:-translate-y-1"
      onClick={() => onClick(movie)}
    >
      {/* 포스터 */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* 평점 배지 */}
        <div className="absolute left-2 top-2 rounded-md bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
        {/* 성인 배지 */}
        {movie.adult && (
          <div className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            18+
          </div>
        )}
      </div>

      {/* 영화 정보 */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-bold text-gray-800">{movie.title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{movie.release_date}</p>
        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
          {movie.overview || "줄거리 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
});

MovieCard.displayName = "MovieCard";
export default MovieCard;