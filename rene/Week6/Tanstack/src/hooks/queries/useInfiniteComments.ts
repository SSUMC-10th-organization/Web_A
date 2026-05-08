import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments, type OrderType } from "../../apis/lp";

export const useInfiniteComments = (lpId: number, order: OrderType, enabled = true) =>
  useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) => getComments(lpId, order, pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    enabled: !!lpId && enabled,
  });
