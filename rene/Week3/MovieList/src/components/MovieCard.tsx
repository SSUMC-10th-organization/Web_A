import type { Movie } from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="relative group h-full rounded-xl overflow-hidden cursor-pointer
    transition-transform duration-500 hover:scale-105">
      {/* 포스터 이미지 */}
      {movie.poster_path ? (
        <img
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-center text-white text-sm">
          No Image
        </div>
      )}

      {/* 평점 뱃지 */}
      <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1.5 rounded-full">
        ⭐ {movie.vote_average?.toFixed(1)}
      </div>

      {/* hover 오버레이: 제목 + overview */}
      <div className="absolute inset-0 bg-black/80 text-white flex flex-col gap-3 justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-bold mb-3 text-center">{movie.title}</p>
        <p className="text-xs text-gray-300 text-center line-clamp-4 leading-snug">
          {movie.overview || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
