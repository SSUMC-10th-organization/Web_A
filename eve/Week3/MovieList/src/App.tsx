import { useEffect, useState } from 'react';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <div className="relative group overflow-hidden rounded-xl bg-gray-900 cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition duration-300 group-hover:blur-md"
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold text-lg mb-2 border-b border-gray-600 pb-1">{movie.title}</h3>
        <p className="text-gray-200 text-xs line-clamp-6 leading-relaxed">{movie.overview || "상세 정보 없음"}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const API_KEY = "538e0fee88fad6784ed923e64596bc87";
      const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
      try {
        const response = await axios.get(URL);
        setMovies(response.data.results);
        console.log("미션 체크: 데이터 로드 성공", response.data.results);
      } catch (error) {
        console.error("에러:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-red-600 italic uppercase">Popular Movies</h1>
      </header>
      <main className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </main>
    </div>
  );
}