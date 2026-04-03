import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import type { MovieDetail } from '../types/movie';

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!movieId) return;

      try {
        setIsPending(true);
        setIsError(false);

        const response = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        setMovie(response.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isPending) return <LoadingSpinner />;

  if (isError || !movie) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <strong className="text-2xl text-red-500">
          상세 정보를 불러오지 못했습니다.
        </strong>
      </div>
    );
  }

  return (
    <div className="grid gap-8 py-8 md:grid-cols-[300px_1fr]">
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full rounded-2xl shadow-lg"
      />

      <div>
        <h1 className="mb-4 text-3xl font-bold">{movie.title}</h1>

        <div className="mb-4 flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="rounded-full bg-[#BEDAB1] px-3 py-1 text-sm text-white"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="mb-2 text-gray-700">개봉일: {movie.release_date}</p>
        <p className="mb-2 text-gray-700">평점: {movie.vote_average}</p>
        <p className="mb-6 text-gray-700">상영 시간: {movie.runtime}분</p>

        <p className="leading-7 text-gray-800">{movie.overview}</p>
      </div>
    </div>
  );
}