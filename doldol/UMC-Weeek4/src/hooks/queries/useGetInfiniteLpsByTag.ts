import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpsByTag } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

interface UseGetInfiniteLpsByTagParams {
	tagName: string;
	limit?: number;
	enabled?: boolean;
}

function useGetInfiniteLpsByTag({
	tagName,
	limit = 12,
	enabled = true,
}: UseGetInfiniteLpsByTagParams) {
	return useInfiniteQuery({
		queryKey: [QUERY_KEY.lps, "tag", tagName],
		queryFn: ({ pageParam }) =>
			getLpsByTag(tagName, {
				cursor: pageParam as number | undefined,
				limit,
			}),
		initialPageParam: undefined as number | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		enabled: enabled && tagName.trim().length > 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}

export default useGetInfiniteLpsByTag;
