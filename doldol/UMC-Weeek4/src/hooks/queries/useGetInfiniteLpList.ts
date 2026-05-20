import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../types/common";

interface UseGetInfiniteLpListParams {
	limit?: number;
	search?: string;
	order?: PAGINATION_ORDER;
}

function useGetInfiniteLpList({
	limit = 12,
	search,
	order,
}: UseGetInfiniteLpListParams = {}) {
	return useInfiniteQuery({
		// 정렬이 바뀌면 새로 첫 페이지부터 불러옴
		queryKey: [QUERY_KEY.lps, search, order],
		queryFn: ({ pageParam }) =>
			getLpList({
				cursor: pageParam as number | undefined,
				limit,
				search,
				order,
			}),
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}

export default useGetInfiniteLpList;
