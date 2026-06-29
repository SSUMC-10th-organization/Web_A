import { memo } from 'react'
import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'

interface Props {
  movies: Movie[]
  onCardClick: (id: number) => void
}

const MovieCardGrid = memo(function MovieCardGrid({ movies, onCardClick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onCardClick} />
      ))}
    </div>
  )
})

export default MovieCardGrid
