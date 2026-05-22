import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyLPList } from '../../apis/lp';

export const useGetMyLPList = () => {
  return useInfiniteQuery({
    queryKey: ['myLps'],
    queryFn: ({ pageParam = 0 }) =>
      getMyLPList({ cursor: pageParam, limit: 10, order: 'desc' }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};