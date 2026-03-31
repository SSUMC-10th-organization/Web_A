import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/detail/${movie.id}`);
  };

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="h-full w-full object-cover"
      />

      {isHover && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-black/40 p-4 text-white backdrop-blur-sm">
          <h2 className="text-center text-lg font-bold leading-snug">
            {movie.title}
          </h2>
          <p className="mt-2 line-clamp-5 text-center text-sm text-gray-200">
            {movie.overview}
          </p>
        </div>
      )}
    </div>
  );
}