import { useQuery } from '@tanstack/react-query'
import type { MovieDetail } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function fetchMovieDetail(movieId: number, language: string): Promise<MovieDetail> {
  const params = new URLSearchParams({ language })

  const res = await fetch(`${BASE_URL}/movie/${movieId}?${params}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      accept: 'application/json',
    },
  })

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
  return res.json()
}

export function useMovieDetail(movieId: number | null, language: string) {
  return useQuery({
    queryKey: ['movie-detail', movieId, language],
    queryFn: () => fetchMovieDetail(movieId!, language),
    enabled: movieId !== null,
  })
}
