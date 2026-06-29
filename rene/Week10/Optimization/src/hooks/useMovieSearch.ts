import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../apis/axios'
import type { MovieSearchResponse, SearchParams } from '../types/movie'

async function fetchMovies(params: SearchParams): Promise<MovieSearchResponse> {
  const isSearch = !!params.query.trim();
  const endpoint = isSearch ? 'search/movie' : 'movie/popular';

  const queryParams: Record<string, string> = {
    include_adult: String(params.includeAdult),
    language: params.language,
    page: '1',
  };

  if (isSearch) queryParams.query = params.query;

  const { data } = await axiosInstance.get<MovieSearchResponse>(endpoint, { params: queryParams });

  return data;
}

export function useMovieSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => fetchMovies(params),
  });
}
