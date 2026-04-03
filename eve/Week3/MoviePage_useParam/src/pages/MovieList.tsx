import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    
    if (!API_KEY) {
      console.error("API Key가 설정되지 않았습니다. .env 파일을 확인하세요.");
      return;
    }

    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`)
      .then((res) => {
        if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
        return res.json();
      })
      .then((data) => setMovies(data.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-black mb-10 border-b-4 border-red-600 w-fit pb-2 font-sans">
        현재 인기 영화
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`} className="group">
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-lg hover:ring-4 hover:ring-red-600 transition-all duration-300">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title}
                className="w-full h-auto group-hover:scale-110 transition-transform duration-300"
              />
              <div className="p-3">
                <p className="font-bold text-sm truncate">{movie.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;