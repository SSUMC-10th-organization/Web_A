import { useEffect, useRef, useState } from 'react';
import LPCard from '../components/LPCard';
import SkeletonCard from '../components/SkeletonCard';
import { useGetLPList } from '../hooks/queries/useGetLPList';
import CreateLPModal from '../components/CreateLPModal';
import useDebounce from '../hooks/useDebounce';
import { SEARCH_DEBOUNCE_DELAY } from '../constants/debounce';

const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 미션1: useDebounce 적용 (inputValue를 300ms 지연)
  const debouncedSearch = useDebounce(inputValue, SEARCH_DEBOUNCE_DELAY);

  const {
    data, isPending, isError, error,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useGetLPList(order, debouncedSearch); // ← search 대신 debouncedSearch

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

  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          // ✅ 버튼/Enter 없이 자동 검색됨 (debounce가 처리)
          placeholder="LP 검색"
          className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
        />

        {/* ✅ 디바운스 상태 표시 (네트워크 탭 확인용) */}
        {inputValue !== debouncedSearch && (
          <span className="self-center text-xs text-gray-400">⏳ 대기 중...</span>
        )}

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="rounded-md border border-gray-700 bg-black px-4 py-2 text-white outline-none"
        >
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </div>

      {/* 나머지는 기존 코드 그대로 */}
      {isPending && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center text-red-500">에러 발생: {error.message}</div>
      )}

      {!isPending && !isError && (
        <>
          {lpList.length === 0 ? (
            <div className="p-6 text-center text-gray-400">조회된 LP가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {lpList.map((lp) => <LPCard key={lp.id} lp={lp} />)}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          <div ref={sentinelRef} className="h-1" />

          {!hasNextPage && lpList.length > 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">모든 LP를 불러왔습니다.</p>
          )}
        </>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl text-white shadow-lg hover:bg-pink-600"
      >
        +
      </button>

      {isModalOpen && <CreateLPModal onClose={() => setIsModalOpen(false)} />}
    </main>
  );
};

export default HomePage;