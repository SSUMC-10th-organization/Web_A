import { useInfiniteQuery } from '@tanstack/react-query';
import { getCommentList } from '../../apis/lp';

export const useGetComments = (lpId: number, order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getCommentList(lpId, { cursor: pageParam, limit: 10, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};