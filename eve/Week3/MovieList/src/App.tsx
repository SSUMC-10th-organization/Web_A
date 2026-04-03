import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;

      try {
        const response = await axios.get(URL);
        setMovies(response.data.results);
        console.log("데이터 로드 성공:", response.data.results);
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-red-600 italic uppercase tracking-tighter">
          Popular Movies
        </h1>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </main>
    </div>
  );
}