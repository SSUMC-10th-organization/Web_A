import { useInfiniteQuery } from "@tanstack/react-query";
import { getSearchLPs, getTagLPs, type OrderType } from "../../apis/lp";

export type SearchType = "title" | "tag";

export const useInfiniteSearchLPs = (
  keyword: string,
  searchType: SearchType,
  order: OrderType
) =>
  useInfiniteQuery({
    queryKey: ["lps", "search", keyword, searchType, order],
    queryFn: async ({ pageParam }) => {
      if (searchType === "tag") {
        const response = await getTagLPs(keyword, order, pageParam, 18);
        return response.data;
      }
      const response = await getSearchLPs(keyword, order, pageParam, 18);
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
