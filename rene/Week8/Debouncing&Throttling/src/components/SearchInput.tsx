import { useState } from "react";
import type { SearchType } from "../hooks/queries/useInfiniteSearchLPs";
import { searchIcon } from "../assets";

interface SearchInputProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  searchType: SearchType;
  onSearchTypeChange: (value: SearchType) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const SearchInput = ({
  keyword,
  onKeywordChange,
  searchType,
  onSearchTypeChange,
  onKeyDown,
  inputRef,
}: SearchInputProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 flex items-center gap-2 bg-zinc-900 rounded-lg px-4 py-2.5">
        <img src={searchIcon} alt="search" className="w-5 h-5 opacity-40 shrink-0" />
        <input
          ref={inputRef}
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="검색어를 입력하세요"
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-500"
        />
        {keyword && (
          <button
            onClick={() => onKeywordChange("")}
            className="text-zinc-500 hover:text-white text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          {searchType === "title" ? "제목" : "태그"}
          <span className="text-zinc-400 text-xs">▾</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-zinc-800 rounded-lg overflow-hidden z-20 min-w-[80px]">
            {(["title", "tag"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  onSearchTypeChange(type);
                  setIsDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  searchType === type ? "bg-pink-500 text-white" : "text-white hover:bg-pink-500"
                }`}
              >
                {type === "title" ? "제목" : "태그"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
