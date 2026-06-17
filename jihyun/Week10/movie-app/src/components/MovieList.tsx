import { memo } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieList = memo(({ movies, onMovieClick }: MovieListProps) => {
  if (movies.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-lg font-bold text-gray-500">
          🎬 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
});

MovieList.displayName = "MovieList";
export default MovieList;