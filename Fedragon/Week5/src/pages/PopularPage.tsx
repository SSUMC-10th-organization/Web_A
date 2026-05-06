import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

const PopularPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`
        );
        if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  if (isLoading) return <div className="text-center py-20 text-2xl">로딩 중... 🍿</div>;
  if (isError) return <div className="text-center py-20 text-red-500 text-2xl">에러 발생! 다시 시도해주세요.</div>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="relative group cursor-pointer overflow-hidden rounded-xl bg-zinc-900">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:blur-sm"
            />
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
              <p className="text-[10px] line-clamp-5 text-zinc-300">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-12 mb-20">
        <button 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-zinc-800 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
        >
          이전
        </button>
        <span className="font-bold text-xl">{page} 페이지</span>
        <button 
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 transition"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PopularPage;