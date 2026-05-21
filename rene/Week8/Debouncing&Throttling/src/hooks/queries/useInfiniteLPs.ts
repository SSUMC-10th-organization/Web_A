import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPs, type OrderType } from "../../apis/lp";

export const useInfiniteLPs = (order: OrderType) =>
  useInfiniteQuery({
    queryKey: ["lps", order],
    queryFn: async ({ pageParam }) => {
      const response = await getLPs({ order, cursor: pageParam, limit: 20 });
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
