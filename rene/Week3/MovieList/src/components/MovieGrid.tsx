import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
};

const MovieGrid = ({ movies }: Props) => {
  if (movies.length === 0) {
    return <div className="text-center py-20 text-white">검색 결과가 없습니다.</div>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="aspect-[2/3]">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
