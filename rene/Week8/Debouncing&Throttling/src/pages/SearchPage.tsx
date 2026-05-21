import { useRef, useEffect } from "react";
import { useDebounce } from "../hooks/utils/useDebounce";
import { useThrottle } from "../hooks/utils/useThrottle";
import { useSearchState } from "../hooks/useSearchState";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useInfiniteSearchLPs } from "../hooks/queries/useInfiniteSearchLPs";
import { useIntersectionObserver } from "../hooks/utils/useIntersectionObserver";
import LPGrid from "../components/LPCard/LPGrid";
import LPCardSkeleton from "../components/LPCard/LPCardSkeleton";
import SortButtonGroup from "../components/common/SortButtonGroup";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SearchInput from "../components/SearchInput";


const SearchPage = () => {
  // 검색 상태 훅
  const { keyword, searchType, order, setKeyword, setSearchType, setOrder } = useSearchState();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // 검색어 입력창에 포커스 주기 위한 ref

  const debouncedKeyword = useDebounce(keyword, 300); // 검색어 디바운스
  const showResults = debouncedKeyword.trim().length > 0;  

  // 최근 검색어 훅
  const { searches, addSearch, removeSearch, clearSearches } = useRecentSearches(); 

  // 검색 결과 훅
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteSearchLPs(debouncedKeyword, searchType, order);
  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  // 무한 스크롤
  const throttledFetchNextPage = useThrottle(fetchNextPage, 1000*3);
  useIntersectionObserver(sentinelRef, throttledFetchNextPage, hasNextPage && !isFetchingNextPage);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 최근 검색어 클릭 핸들러
  const handleRecentClick = (term: string) => {
    setKeyword(term);
  };
  // 검색어 입력창에서 Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      addSearch(keyword.trim());
    }
  };


  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {/* 검색 입력 영역 */}
      <SearchInput
        keyword={keyword}
        onKeywordChange={setKeyword}
        searchType={searchType}
        onSearchTypeChange={setSearchType}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />

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

          {isPending && <LoadingSpinner />}

          {!isPending && (
            <>
              <LPGrid
                lps={lps}
                gridClass="grid-cols-3"
                emptyMessage="검색 결과가 없습니다."
              />

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
  );
};

export default SearchPage;
