import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function HomePage() {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['lps', order],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.get('/v1/lps', { params: { cursor: pageParam, limit: 8, order } });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lpList = data?.pages.flatMap(p => p.data.data) ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex justify-end gap-4">
        <button onClick={() => setOrder('desc')} className={`text-sm ${order === 'desc' ? 'text-pink-500' : 'text-gray-500'}`}>최신순</button>
        <button onClick={() => setOrder('asc')} className={`text-sm ${order === 'asc' ? 'text-pink-500' : 'text-gray-500'}`}>오래된순</button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? [...Array(8)].map((_, i) => <Skeleton key={i} />) : 
          lpList.map(lp => (
            <div key={lp.id} onClick={() => navigate(`/lps/${lp.id}`)} className="group cursor-pointer rounded-2xl bg-[#111] border border-[#222] overflow-hidden transition hover:border-pink-500">
              <div className="aspect-square relative overflow-hidden">
                <img src={lp.thumbnail} className="h-full w-full object-cover transition group-hover:scale-110" alt=""/>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-4">
                   <h4 className="font-bold text-pink-500">{lp.title}</h4>
                   <p className="text-xs text-gray-300 mt-2">좋아요 {lp.likes.length}개</p>
                </div>
              </div>
              <div className="p-4"><h3 className="truncate font-semibold">{lp.title}</h3></div>
            </div>
          ))
        }
      </div>
      <div ref={sentinelRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <Skeleton isList />}
      </div>
    </div>
  );
}

const Skeleton = ({ isList }: { isList?: boolean }) => (
  <div className={isList ? "grid grid-cols-4 gap-8 w-full" : "animate-pulse rounded-2xl bg-[#111] border border-[#222] overflow-hidden"}>
    <div className="aspect-square bg-[#222]" />
    <div className="p-4"><div className="h-4 w-3/4 bg-[#222] rounded" /></div>
  </div>
);