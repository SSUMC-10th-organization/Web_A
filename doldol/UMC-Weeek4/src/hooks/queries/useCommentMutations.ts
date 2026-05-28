import { useMutation } from "@tanstack/react-query";
import { deleteComment, patchComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../lib/queryClient";

// 댓글 수정
export function usePatchComment(lpId: number) {
	return useMutation({
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: number;
			content: string;
		}) => patchComment(lpId, commentId, { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEY.lpComments, lpId],
			});
		},
	});
}

// 댓글 삭제
export function useDeleteComment(lpId: number) {
	return useMutation({
		mutationFn: (commentId: number) => deleteComment(lpId, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEY.lpComments, lpId],
			});
		},
	});
}
