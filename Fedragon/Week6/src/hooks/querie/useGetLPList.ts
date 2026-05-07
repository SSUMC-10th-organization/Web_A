import { useInfiniteQuery } from '@tanstack/react-query';
import { getLPList } from '../../apis/lp';

export const useGetLPList = (order: 'asc' | 'desc', search: string) => {
  return useInfiniteQuery({
    queryKey: ['lps', order, search],
    queryFn: ({ pageParam = 0 }) =>
      getLPList({ cursor: pageParam, limit: 10, order, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // lastPage는 CommonResponse<CursorBasedResponse<LP[]>> 구조
      // hasNext가 true일 때만 nextCursor 반환, 아니면 undefined → hasNextPage = false
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
};