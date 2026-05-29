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
	// 빈 문자열은 허용, 공백만 있는 경우는 요청 차단
	const isEnabled = search === undefined || search === "" || search.trim().length > 0;

	// 커서 기반으로 필요할때만 다음 페이지를 가져옴
	return useInfiniteQuery({
		// debouncedQuery(search) 가 queryKey 에 포함 → 변경 시 첫 페이지부터 재요청
		queryKey: [QUERY_KEY.lps, search, order],
		queryFn: ({ pageParam }) =>
			getLpList({
				cursor: pageParam as number | undefined,
				limit,
				search: search?.trim() || undefined,
				order,
			}),
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		enabled: isEnabled,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}

export default useGetInfiniteLpList;
