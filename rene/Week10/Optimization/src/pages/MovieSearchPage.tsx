import { useState, useCallback } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import SearchForm from '../components/SearchForm'
import MovieCardGrid from '../components/MovieCardGrid'
import MovieModal from '../components/MovieModal'
import { useMovieSearch } from '../hooks/useMovieSearch'
import type { SearchParams } from '../types/movie'

export default function MovieSearchPage() {
  const searchParams = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const { data, isLoading, error } = useMovieSearch(searchParams)

  const handleSearch = useCallback((params: SearchParams) => {
    navigate({ search: params })
  }, [navigate])

  return (
    <div className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <SearchForm defaultValues={searchParams} onSearch={handleSearch} />

        {isLoading && (
          <p className="text-center text-gray-500">검색 중...</p>
        )}

        {error && (
          <p className="text-center text-red-500">오류가 발생했습니다.</p>
        )}

        {data && data.results.length === 0 && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}

        {data && data.results.length > 0 && (
          <MovieCardGrid
            movies={data.results}
            onCardClick={setSelectedMovieId}
          />
        )}
      </div>

      {selectedMovieId !== null && (
        <MovieModal
          movieId={selectedMovieId}
          language={searchParams.language}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  )
}
