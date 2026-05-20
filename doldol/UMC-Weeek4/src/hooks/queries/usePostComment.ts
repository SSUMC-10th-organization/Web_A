import { useMutation } from "@tanstack/react-query";
import { postComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateCommentDto } from "../../types/comment";
import { queryClient } from "../../lib/queryClient";

function usePostComment(lpId: number) {
	return useMutation({
		mutationFn: (body: RequestCreateCommentDto) =>
			postComment(lpId, body),
		onSuccess: () => {
			// 해당 LP 의 댓글 목록 캐시를 모두 무효화 -> 정렬 옵션 상관없이 갱신
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEY.lpComments, lpId],
			});
		},
	});
}

export default usePostComment;
