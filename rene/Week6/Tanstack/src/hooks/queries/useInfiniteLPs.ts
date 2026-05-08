import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPs, type SortType } from "../../apis/lp";

export const useInfiniteLPs = (sort: SortType) =>
  useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: async ({ pageParam }) => {
      const response = await getLPs(sort, pageParam, 20);
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
