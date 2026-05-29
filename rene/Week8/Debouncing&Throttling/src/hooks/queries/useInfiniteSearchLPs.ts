import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPs, getTagLPs, type OrderType } from "../../apis/lp";

export type SearchType = "title" | "tag";

// 검색어, 검색 타입, 정렬 방식에 따른 LP 무한 스크롤 훅
// useInfiniteLPs 쿼리 훅과 용도와 동작이 다르기 때문에 분리
export const useInfiniteSearchLPs = (
  keyword: string,
  searchType: SearchType,
  order: OrderType
) =>
  useInfiniteQuery({
    queryKey: ["lps", "search", keyword, searchType, order],
    queryFn: async ({ pageParam }) => {
      if (searchType === "tag") {
        const response = await getTagLPs(keyword, pageParam, 18, order);
        return response.data;
      }
      const response = await getLPs({ cursor: pageParam, limit: 18, search: keyword, order });
      return response.data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: keyword.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
