import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  tagline: string;
  runtime: number;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>(); 
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const BASE_URL = 'https://api.themoviedb.org/3';

      if (!API_KEY) {
        setError("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [movieRes, creditRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`),
          fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`)
        ]);

        if (!movieRes.ok || !creditRes.ok) throw new Error('영화 정보를 불러올 수 없습니다.');

        const movieData = await movieRes.json();
        const creditData = await creditRes.json();

        setMovie(movieData);
        setCast(creditData.cast);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-bold italic">데이터 로딩 중...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-500 text-2xl font-black p-10">
      ⚠️ {error}
    </div>
  );

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div 
        className="relative h-[600px] w-full bg-cover bg-top"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent flex items-center px-10">
          <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto w-full">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              className="w-48 md:w-80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/20"
              alt={movie.title}
            />
            <div className="flex-1 flex flex-col justify-end pb-4">
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">{movie.title}</h1>
              <div className="flex items-center gap-4 text-xl mb-6 font-bold">
                <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">|</span>
                <span>{movie.release_date.split('-')[0]}</span>
                <span className="text-gray-400">|</span>
                <span>{movie.runtime}분</span>
              </div>
              <p className="text-2xl italic text-gray-300 mb-6 leading-relaxed">"{movie.tagline}"</p>
              <h3 className="text-2xl font-bold mb-3 border-l-4 border-red-600 pl-4">개요</h3>
              <p className="text-gray-200 leading-relaxed text-lg max-w-3xl">
                {movie.overview || "영화 설명이 등록되어 있지 않습니다."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-4xl font-black mb-12 border-b-2 border-red-600 pb-2 w-fit">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {cast.slice(0, 12).map((person) => (
            <div key={person.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-3 shadow-lg">
                <img 
                  src={person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={person.name}
                />
              </div>
              <p className="font-bold text-md truncate text-white">{person.name}</p>
              <p className="text-sm text-gray-400 truncate">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;