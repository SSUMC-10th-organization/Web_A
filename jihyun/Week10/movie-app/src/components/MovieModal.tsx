import { useEffect } from "react";
import type { Movie } from "../types/movie";
import { IMAGE_BASE_URL, FALLBACK_IMAGE } from "../constants/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : FALLBACK_IMAGE;

  const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

  return (
    /* 배경 오버레이 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* 모달 카드 */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 포스터 이미지 */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-2xl sm:h-80">
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* 제목 오버레이 */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {movie.title}
            </h2>
            {movie.original_title !== movie.title && (
              <p className="mt-1 text-sm text-gray-300">{movie.original_title}</p>
            )}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="p-6">
          {/* 평점 · 개봉일 · 인기도 */}
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex flex-col items-center rounded-lg bg-yellow-50 px-4 py-2">
              <span className="text-xs text-gray-500">평점</span>
              <span className="font-bold text-yellow-500">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({movie.vote_count.toLocaleString()}명)</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-blue-50 px-4 py-2">
              <span className="text-xs text-gray-500">개봉일</span>
              <span className="font-semibold text-blue-600">
                {movie.release_date || "미정"}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-green-50 px-4 py-2">
              <span className="text-xs text-gray-500">인기도</span>
              <span className="font-semibold text-green-600">
                {movie.popularity.toFixed(1)}
              </span>
            </div>
          </div>

          {/* 줄거리 */}
          <div className="mb-6">
            <h3 className="mb-2 font-bold text-gray-800">줄거리</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <a
              href={imdbSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-yellow-400 py-2.5 text-center font-bold text-black transition hover:bg-yellow-500"
            >
              IMDb에서 검색
            </a>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 font-bold text-gray-700 transition hover:bg-gray-100"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;