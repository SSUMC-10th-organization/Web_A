import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const API_KEY = '538e0fee88fad6784ed923e64596bc87';

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-black mb-10 border-b-4 border-red-600 w-fit pb-2">현재 인기 영화</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`} className="group">
            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-lg hover:ring-4 hover:ring-red-600 transition-all">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
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