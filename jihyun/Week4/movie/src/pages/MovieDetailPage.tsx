import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useFetch from '../hooks/useFetch';
import type { Cast, Crew, CreditsResponse, MovieDetail } from '../types/movie';

export default function MovieDetailPage() {
  const { movieId } = useParams();

  const detailUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
    : '';

  const creditsUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
    : '';

  const requestOptions: RequestInit = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    },
  };

  const {
    data: movie,
    isPending: isMoviePending,
    isError: isMovieError,
  } = useFetch<MovieDetail>(detailUrl, requestOptions);

  const {
    data: credits,
    isPending: isCreditsPending,
    isError: isCreditsError,
  } = useFetch<CreditsResponse>(creditsUrl, requestOptions);

  const isPending = isMoviePending || isCreditsPending;
  const isError = isMovieError || isCreditsError;

  if (isPending) return <LoadingSpinner />;

  if (isError || !movie || !credits) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <strong className="text-2xl text-red-500">
          상세 정보를 불러오지 못했습니다.
        </strong>
      </div>
    );
  }

  const directors = credits.crew.filter((person: Crew) => person.job === 'Director');
  const topCast = credits.cast.slice(0, 10);

  return (
    <div className="space-y-8 py-6">
      <section className="overflow-hidden rounded-2xl bg-black text-white shadow-lg">
        <div className="relative">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="h-[260px] w-full object-cover opacity-70 md:h-[360px]"
            />
          ) : (
            <div className="h-[260px] w-full bg-gray-800 md:h-[360px]" />
          )}

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{movie.title}</h1>
            <p className="mb-2 text-sm text-gray-200">
              평점 {movie.vote_average} · 개봉일 {movie.release_date}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/20 px-3 py-1 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="max-w-3xl text-sm leading-6 text-gray-100 md:text-base">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">감독/출연</h2>

        {directors.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 font-semibold">감독</p>
            <div className="flex flex-wrap gap-2">
              {directors.map((director) => (
                <span
                  key={director.id}
                  className="rounded-full bg-[#BEDAB1] px-3 py-1 text-sm text-white"
                >
                  {director.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {topCast.map((person: Cast) => (
            <div
              key={person.cast_id ?? person.id}
              className="rounded-xl bg-gray-50 p-3 text-center shadow-sm"
            >
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 h-24 w-24 rounded-full bg-gray-300" />
              )}

              <p className="text-sm font-semibold">{person.name}</p>
              <p className="mt-1 text-xs text-gray-500">{person.character}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}