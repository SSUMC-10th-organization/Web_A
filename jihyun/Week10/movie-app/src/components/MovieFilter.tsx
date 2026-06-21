import { memo, useState, useCallback } from "react";
import type { MovieFilter as MovieFilterType } from "../types/movie";
import { LANGUAGE_OPTIONS } from "../constants/movie";
import { Input } from "./Input";
import { CheckBox } from "./CheckBox";
import { LanguageSelector } from "./LanguageSelector";

interface MovieFilterProps {
  onChange: (filters: MovieFilterType) => void;
}

const MovieFilter = memo(({ onChange }: MovieFilterProps) => {
  const [query, setQuery] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onChange({
        query,
        include_adult: includeAdult,
        language: language as MovieFilterType["language"],
      });
    },
    [query, includeAdult, language, onChange]
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* 1행: 영화 제목 + 옵션 */}
      <div className="flex gap-6 mb-4">
        {/* 영화 제목 */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎬 영화 제목
          </label>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="영화 제목을 입력하세요"
          />
        </div>

        {/* 옵션 (성인 콘텐츠) */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔞 옵션
          </label>
          <div className="flex items-center h-10">
            <CheckBox
              id="include_adult"
              checked={includeAdult}
              onChange={setIncludeAdult}
              label="성인 콘텐츠 표시"
            />
          </div>
        </div>
      </div>

      {/* 2행: 언어 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🌐 언어
        </label>
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          options={LANGUAGE_OPTIONS}
        />
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition active:scale-95"
      >
        🔍 검색하기
      </button>
    </form>
  );
});

MovieFilter.displayName = "MovieFilter";
export default MovieFilter;