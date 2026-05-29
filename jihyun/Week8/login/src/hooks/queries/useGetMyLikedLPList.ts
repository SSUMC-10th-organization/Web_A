import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyLikedLPList } from '../../apis/lp';

export const useGetMyLikedLPList = () => {
  return useInfiniteQuery({
    queryKey: ['myLikedLps'],
    queryFn: ({ pageParam = 0 }) =>
      getMyLikedLPList({ cursor: pageParam, limit: 10, order: 'desc' }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};