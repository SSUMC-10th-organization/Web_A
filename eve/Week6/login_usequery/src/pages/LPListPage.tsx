import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function LpListPage() {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['lps', order],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.get('/v1/lps', { params: { cursor: pageParam, limit: 12, order } });
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
    <div className="w-full">
      <div className="mb-6 flex justify-end">
        <div className="flex rounded-lg bg-[#1a1a1a] p-1">
          <button onClick={() => setOrder('asc')} className={`rounded-md px-4 py-1 text-sm font-bold transition ${order === 'asc' ? 'bg-white text-black' : 'text-gray-400'}`}>오래된순</button>
          <button onClick={() => setOrder('desc')} className={`rounded-md px-4 py-1 text-sm font-bold transition ${order === 'desc' ? 'bg-white text-black' : 'text-gray-400'}`}>최신순</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading ? [...Array(10)].map((_, i) => <div key={i} className="aspect-square animate-pulse bg-[#1a1a1a] rounded-sm" />) : 
          lpList.map(lp => (
            <div 
              key={lp.id} 
              onClick={() => navigate(`/lp/${lp.id}`)} 
              className="group relative aspect-square cursor-pointer overflow-hidden bg-[#111] transition-all hover:scale-[1.02]"
            >
              <img src={lp.thumbnail || lp.image_url} className="h-full w-full object-cover" alt=""/>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="truncate text-lg font-bold text-white">{lp.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                   <span>1 days ago</span>
                   <span>❤️ {lp.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div ref={sentinelRef} className="h-20" />
    </div>
  );
}