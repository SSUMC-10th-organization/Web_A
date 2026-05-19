import { useState, useRef, useEffect } from "react";
import { useSearchOverlay } from "../../context/SearchContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useRecentSearches } from "../../hooks/useRecentSearches";
import { useInfiniteSearchLPs, type SearchType } from "../../hooks/queries/useInfiniteSearchLPs";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import LPCard from "../LPCard/LPCard";
import LPCardSkeleton from "../LPCard/LPCardSkeleton";
import SortButtonGroup from "../SortButtonGroup";
import type { OrderType } from "../../apis/lp";
import searchIcon from "../../assets/search-icon.svg";

const SearchOverlay = () => {
  const { close } = useSearchOverlay();
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [order, setOrder] = useState<OrderType>("desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedKeyword = useDebounce(keyword, 300);
  const { searches, addSearch, removeSearch, clearSearches } = useRecentSearches();

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteSearchLPs(debouncedKeyword, searchType, order);

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  useIntersectionObserver(sentinelRef, fetchNextPage, hasNextPage && !isFetchingNextPage);

  // 마운트 시 input focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ESC로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const handleRecentClick = (term: string) => {
    setKeyword(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      addSearch(keyword.trim());
    }
  };

  const showResults = debouncedKeyword.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      {/* 검색 입력 영역 */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-zinc-900 rounded-lg px-4 py-2.5">
            <img src={searchIcon} alt="search" className="w-5 h-5 opacity-40 shrink-0" />
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력하세요"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-500"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="text-zinc-500 hover:text-white text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* 검색 타입 드롭다운 */}
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
                {(["title", "tag"] as SearchType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSearchType(type);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      searchType === type
                        ? "bg-pink-500 text-white"
                        : "text-white hover:bg-pink-500"
                    }`}
                  >
                    {type === "title" ? "제목" : "태그"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={close}
            className="text-zinc-400 hover:text-white text-sm transition-colors shrink-0"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-6 py-6">
        {!showResults ? (
          /* 최근 검색어 */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm font-medium">최근 검색어</span>
              {searches.length > 0 && (
                <button
                  onClick={clearSearches}
                  className="text-zinc-500 text-xs hover:text-white transition-colors"
                >
                  모두 지우기
                </button>
              )}
            </div>
            {searches.length === 0 ? (
              <p className="text-zinc-600 text-sm">최근 검색어가 없습니다.</p>
            ) : (
              <ul className="flex flex-col">
                {searches.map((s) => (
                  <li
                    key={s}
                    className="flex items-center justify-between py-2.5 border-b border-zinc-900 group"
                  >
                    <button
                      onClick={() => handleRecentClick(s)}
                      className="flex items-center gap-2 text-white text-sm hover:text-pink-400 transition-colors"
                    >
                      <span className="text-zinc-600 text-xs">✕</span>
                      {s}
                    </button>
                    <button
                      onClick={() => removeSearch(s)}
                      className="text-zinc-600 hover:text-white text-xs transition-colors opacity-0 group-hover:opacity-100"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          /* 검색 결과 */
          <div>
            <div className="flex justify-end mb-4">
              <SortButtonGroup
                options={[
                  { value: "asc", label: "오래된순" },
                  { value: "desc", label: "최신순" },
                ]}
                value={order}
                onChange={setOrder}
                size="small"
              />
            </div>

            {isPending && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <LPCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isPending && (
              <>
                {lps.length === 0 ? (
                  <p className="text-center text-zinc-500 text-sm py-16">
                    검색 결과가 없습니다.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {lps.map((lp) => (
                      <LPCard key={lp.id} lp={lp} />
                    ))}
                  </div>
                )}

                <div ref={sentinelRef} className="h-4" />

                {isFetchingNextPage && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <LPCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {!hasNextPage && lps.length > 0 && (
                  <p className="text-center text-zinc-600 text-xs py-8">
                    모든 결과를 불러왔습니다.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
