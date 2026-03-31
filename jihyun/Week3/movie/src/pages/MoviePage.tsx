import axios from 'axios';
import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get<MovieResponse>(
        'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        }
      );

      setMovies(response.data.results);
    };

    fetchMovies();
  }, []);

  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}