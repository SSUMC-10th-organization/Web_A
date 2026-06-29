import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../apis/axios'
import type { MovieDetail } from '../types/movie'

async function fetchMovieDetail(movieId: number, language: string): Promise<MovieDetail> {
  const { data } = await axiosInstance.get<MovieDetail>(`movie/${movieId}`, {
    params: { language },
  })
  return data
}

export function useMovieDetail(movieId: number | null, language: string) {
  return useQuery({
    queryKey: ['movie-detail', movieId, language],
    queryFn: () => fetchMovieDetail(movieId!, language),
    enabled: movieId !== null,
  })
}
