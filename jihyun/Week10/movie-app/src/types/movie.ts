export type MovieLanguage = "ko-KR" | "en-US" | "ja-JP";

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieFilter {
  query: string;
  include_adult: boolean;
  language: MovieLanguage;
}