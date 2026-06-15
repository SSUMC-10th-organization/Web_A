import { useMovieDetail } from '../hooks/useMovieDetail'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

type Props = {
  movieId: number
  language: string
  onClose: () => void
}

export default function MovieModal({ movieId, language, onClose }: Props) {
  const { data: movie, isLoading } = useMovieDetail(movieId, language)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !movie ? (
          <div className="flex items-center justify-center h-60 text-text-muted">
            불러오는 중...
          </div>
        ) : (
          <>
            {/* 상단 backdrop */}
            <div className="relative">
              {movie.backdrop_path ? (
                <img
                  src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                  alt=""
                  className="w-full h-52 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-52 bg-surface-alt rounded-t-2xl" />
              )}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 제목 영역 */}
            <div className="px-6 pt-4 pb-3 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary">{movie.title}</h2>
              <p className="text-sm text-text-muted mt-0.5">{movie.original_title}</p>
            </div>

            {/* 본문 */}
            <div className="flex gap-5 px-6 py-5">
              {movie.poster_path && (
                <img
                  src={`${POSTER_BASE}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-28 h-auto rounded-lg shrink-0 object-cover self-start"
                />
              )}

              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <p className="text-blue-500 font-bold text-lg">
                  {movie.vote_average.toFixed(1)}
                  <span className="text-text-muted font-normal text-sm ml-1">
                    ({movie.vote_count.toLocaleString()} 평가)
                  </span>
                </p>

                <div>
                  <p className="text-sm font-semibold text-text-secondary">개봉일</p>
                  <p className="text-sm text-text-muted">{movie.release_date}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-text-secondary">인기도</p>
                  <div className="w-full bg-surface-alt rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min((movie.popularity / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {movie.overview && (
                  <div>
                    <p className="text-sm font-semibold text-text-secondary">줄거리</p>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{movie.overview}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-3 px-6 pb-6">
              <a
                href={`https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                IMDb에서 검색
              </a>
              <button
                onClick={onClose}
                className="border border-blue-500 text-blue-500 hover:bg-surface-alt text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
