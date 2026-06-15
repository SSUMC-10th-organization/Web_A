import { useQuery } from '@tanstack/react-query'
import type { MovieSearchResponse, SearchParams } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function fetchMovies(params: SearchParams): Promise<MovieSearchResponse> {
  const isSearch = !!params.query.trim()
  const endpoint = isSearch ? 'search/movie' : 'movie/popular'

  const searchParams = new URLSearchParams({
    include_adult: String(params.includeAdult),
    language: params.language,
    page: '1',
  })

  if (isSearch) searchParams.set('query', params.query)

  const res = await fetch(`${BASE_URL}/${endpoint}?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      accept: 'application/json',
    },
  })

  if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
  return res.json()
}

export function useMovieSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => fetchMovies(params),
  })
}
