import { memo } from 'react'
import type { Movie } from '../types/movie'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

interface Props {
  movie: Movie
  onClick: (id: number) => void
}

const MovieCard = memo(function MovieCard({ movie, onClick }: Props) {
  const posterUrl = movie.poster_path
    ? `${POSTER_BASE}${movie.poster_path}`
    : null

  return (
    <div onClick={() => onClick(movie.id)} className="bg-surface rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-surface-alt flex items-center justify-center text-text-muted text-sm">
            No Image
          </div>
        )}
        <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-bold text-sm text-text-primary line-clamp-1">{movie.title}</h3>
        <p className="text-xs text-text-muted">{movie.release_date}</p>
        <p className="text-xs text-text-secondary line-clamp-3 mt-1">{movie.overview}</p>
      </div>
    </div>
  )
})

export default MovieCard
