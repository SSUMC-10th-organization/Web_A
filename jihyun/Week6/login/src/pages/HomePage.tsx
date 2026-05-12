import { useEffect, useRef, useState } from 'react';
import LPCard from '../components/LPCard';
import SkeletonCard from '../components/SkeletonCard';
import { useGetLPList } from '../hooks/queries/useGetLPList';

const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLPList(order, search);

  // 센티널 ref — 이 div가 화면에 보이면 fetchNextPage 호출
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSearch = () => setSearch(inputValue);

  // 전체 LP 목록 — pages 배열을 flat하게 펼침
  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* 검색/정렬 영역 */}
      <div className="mb-6 flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          placeholder="LP 검색"
          className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
        />
        <button
          onClick={handleSearch}
          className="rounded-md bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600"
        >
          검색
        </button>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="rounded-md border border-gray-700 bg-black px-4 py-2 text-white outline-none"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </div>

      {/* 초기 로딩 — 상단 스켈레톤 10개 */}
      {isPending && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center text-red-500">
          에러 발생: {error.message}
        </div>
      )}

      {!isPending && !isError && (
        <>
          {lpList.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              조회된 LP가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {lpList.map((lp) => (
                <LPCard key={lp.id} lp={lp} />
              ))}
            </div>
          )}

          {/* 추가 로딩 — 하단 스켈레톤 4개 */}
          {isFetchingNextPage && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* 센티널 — 이 요소가 뷰포트에 들어오면 다음 페이지 fetch */}
          <div ref={sentinelRef} className="h-1" />

          {!hasNextPage && lpList.length > 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              모든 LP를 불러왔습니다.
            </p>
          )}
        </>
      )}
    </main>
  );
};

export default HomePage;