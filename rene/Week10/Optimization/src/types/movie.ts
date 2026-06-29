export type Movie = {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  vote_count: number
  poster_path: string | null
  backdrop_path: string | null
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export type MovieSearchResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type SearchParams = {
  query: string
  includeAdult: boolean
  language: 'ko-KR' | 'en-US' | 'ja-JP'
}

export type MovieDetail = {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  poster_path: string | null
  backdrop_path: string | null
  imdb_id: string | null
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string
}
