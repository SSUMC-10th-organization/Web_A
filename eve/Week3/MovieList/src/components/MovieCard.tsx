import { jsx } from "react/jsx-runtime";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="relative group overflow-hidden rounded-xl bg-gray-900 cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition duration-300 group-hover:blur-md"
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-lg mb-2 border-b border-gray-600 pb-1">
          {movie.title}
        </h3>
        <p className="text-gray-200 text-xs line-clamp-6 leading-relaxed">
          {movie.overview || "상세 정보가 없습니다."}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;