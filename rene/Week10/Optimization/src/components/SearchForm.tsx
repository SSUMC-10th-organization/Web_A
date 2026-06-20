import { memo, useState } from 'react'
import type { SearchParams } from '../types/movie'

interface Props {
  defaultValues: SearchParams
  onSearch: (params: SearchParams) => void
}

const SearchForm = memo(function SearchForm({ defaultValues, onSearch }: Props) {
  const [query, setQuery] = useState(defaultValues.query)
  const [includeAdult, setIncludeAdult] = useState(defaultValues.includeAdult)
  const [language, setLanguage] = useState<SearchParams['language']>(defaultValues.language)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ query, includeAdult, language })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-2xl shadow-md p-6 flex flex-col gap-4"
    >
      <div className="flex gap-6">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold text-text-secondary">🎬 영화 제목</label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="영화 제목을 입력하세요"
              className="w-full bg-surface-alt border border-border text-text-primary placeholder:text-text-muted rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute pr-2 right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-semibold text-text-secondary">⚙️ 옵션</label>
          <label className="flex items-center gap-2 border border-border bg-surface-alt rounded-lg px-4 py-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
              className="w-4 h-4"
            />
            성인 콘텐츠 표시
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-text-secondary">🌐 언어</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SearchParams['language'])}
          className="bg-surface-alt border border-border text-text-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="ko-KR">한국어</option>
          <option value="en-US">영어</option>
          <option value="ja-JP">일본어</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        검색하기
      </button>
    </form>
  )
})

export default SearchForm
