import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../types/common";

interface UseGetInfiniteCommentsParams {
	lpId: number;
	order?: PAGINATION_ORDER;
	limit?: number;
}

function useGetInfiniteComments({
	lpId,
	order,
	limit = 10,
}: UseGetInfiniteCommentsParams) {
	return useInfiniteQuery({
		queryKey: [QUERY_KEY.lpComments, lpId, order],
		queryFn: ({ pageParam }) =>
			getCommentList(lpId, {
				cursor: pageParam as number | undefined,
				limit,
				order,
			}),
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		enabled: !!lpId && !Number.isNaN(lpId),
		staleTime: 1000 * 60,
	});
}

export default useGetInfiniteComments;
