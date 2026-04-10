 import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // API 키 읽어오기
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=1`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((err) => console.error("데이터 로딩 에러:", err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">🍿 영찬이의 인기 영화 리스트</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 shadow-lg">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:blur-sm"
            />
            
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
              <p className="text-[10px] line-clamp-5 text-zinc-300">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;