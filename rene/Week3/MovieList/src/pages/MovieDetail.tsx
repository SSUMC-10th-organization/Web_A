import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, MovieCredits, CastMember, CrewMember } from "../types/movie";
import LoadingSpinner from "../components/LoadingSpinner";
import CastCard from "../components/CastCard";
import GenreChip from "../components/GenreChip";

// 감독과 출연진을 보여주는 섹션 컴포넌트
interface CastSectionProps {
  directors: CrewMember[];
  cast: CastMember[];
}

const CastSection = ({ directors, cast }: CastSectionProps) => (
  <div className="border-t border-gray-800 py-8">
    <p className="text-xl font-semibold mb-4">감독/출연</p>
    <div className="py-5 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-4">
      {directors.map((director) => (
        <CastCard key={`director-${director.id}`} name={director.name} sub="감독" profile_path={director.profile_path} />
      ))}
      {cast.map((actor) => (
        <CastCard key={`cast-${actor.id}-${actor.order}`} name={actor.name} sub={actor.character} profile_path={actor.profile_path} />
      ))}
    </div>
  </div>
);

// 영화 메타 정보(평점, 개봉 연도, 상영 시간)를 보여주는 컴포넌트
interface MovieMetaProps {
  voteAverage: number;
  releaseDate: string;
  runtime: number;
}

const MovieMeta = ({ voteAverage, releaseDate, runtime }: MovieMetaProps) => (
  <div className="flex items-center gap-4 text-sm text-gray-300">
    <span className="text-yellow-400 font-bold text-base">⭐ {voteAverage.toFixed(1)}</span>
    <span>{releaseDate.slice(0, 4)}년</span>
    {runtime > 0 && <span>{runtime}분</span>}
  </div>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const HEADERS = { Authorization: `Bearer ${TMDB_API_KEY}` };

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetail>(`${API_BASE_URL}/movie/${id}?language=en-US`, { headers: HEADERS }),
          axios.get<MovieCredits>(`${API_BASE_URL}/movie/${id}/credits?language=en-US`, { headers: HEADERS }),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchAll();
  }, [id]);

  if (isPending) return <div className="bg-black min-h-screen"><LoadingSpinner /></div>;

  if (isError || !movie) return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-lg">영화 정보를 불러올 수 없습니다.</p>
      <button onClick={() => navigate(-1)} className="text-white underline text-sm">돌아가기</button>
    </div>
  );

  const directors: CrewMember[] = credits?.crew.filter((c) => c.job === "Director") ?? [];
  const cast: CastMember[] = credits?.cast.slice(0, 20) ?? [];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* 백드롭 */}
      <div className="relative w-full h-[400px]">
        {movie.backdrop_path ? (
          <img src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-6 text-white bg-black/50 hover:bg-black/80 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          ← 뒤로가기
        </button>
      </div>

      <div className="max-w-[1280px] mx-auto px-8">
        {/* 상세 정보 */}
        <div className="py-5 flex gap-8">
          {/* 포스터 */}
          <div className="shrink-0 w-52 rounded-xl overflow-hidden shadow-2xl">
            {movie.poster_path ? (
              <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} 
              className="w-full" />
            ) : (
              <div className="w-full h-72 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">No Image</div>
            )}
          </div>
          {/* 텍스트 정보*/}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic text-lg">"{movie.tagline}"</p>}
            <MovieMeta voteAverage={movie.vote_average} releaseDate={movie.release_date} runtime={movie.runtime} />
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <GenreChip key={genre.id} name={genre.name} />
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed max-w-2xl">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>

        {/* 감독/출연 */}
        {credits && <CastSection directors={directors} cast={cast} />}
      </div>
    </div>
  );
};

export default MovieDetailPage;
