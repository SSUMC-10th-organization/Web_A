import { useState, useRef } from "react";
import FloatingButton from "../components/FloatingButton";
import LPGrid from "../components/LPCard/LPGrid";
import LPCardSkeleton from "../components/LPCard/LPCardSkeleton";
import ErrorFallback from "../components/ErrorFallback";
import { useInfiniteLPs } from "../hooks/queries/useInfiniteLPs";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { SortType } from "../apis/lp";

// 스켈레톤 UI
const SKELETON_COLS = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2";

const SkeletonGrid = ({ count }: { count: number }) => (
  <div className={SKELETON_COLS}>
    {Array.from({ length: count }).map((_, i) => (
      <LPCardSkeleton key={i} />
    ))}
  </div>
);

const HomePage = () => {
  const [sort, setSort] = useState<SortType>("oldest");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLPs(sort);

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  useIntersectionObserver(
    sentinelRef,
    fetchNextPage,
    hasNextPage && !isFetchingNextPage
  );

  return (
    <div className="relative min-h-full px-12">
      {/* 정렬 버튼 */}
      <div className="flex justify-end p-4">
        <div className="flex rounded-lg border border-zinc-600 overflow-hidden">
          <button
            onClick={() => setSort("oldest")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "oldest" ? "bg-white text-black" : "text-white hover:bg-zinc-800"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setSort("newest")}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              sort === "newest" ? "bg-white text-black" : "text-white hover:bg-zinc-800"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 초기 로딩 스켈레톤 */}
      {isPending && <SkeletonGrid count={18} />}

      {/* 에러 */}
      {isError && (
        <ErrorFallback
          message="LP 목록을 불러오지 못했습니다."
          onRetry={refetch}
        />
      )}

      {/* 목록 + 무한스크롤 */}
      {!isPending && !isError && (
        <>
          <LPGrid lps={lps} />

          {/* sentinel: 이 요소가 뷰포트에 들어오면 fetchNextPage 호출 */}
          <div ref={sentinelRef} className="h-4" />

          {/* 다음 페이지 로딩 스켈레톤 */}
          {isFetchingNextPage && <SkeletonGrid count={6} />}

          {/* 마지막 페이지 도달 */}
          {!hasNextPage && lps.length > 0 && (
            <p className="text-center text-zinc-600 text-xs py-8">
              모든 LP를 불러왔습니다.
            </p>
          )}
        </>
      )}

      <FloatingButton />
    </div>
  );
};

export default HomePage;
