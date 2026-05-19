import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, updateComment, deleteComment } from "../../apis/comment";

const commentQueryKey = (lpId: number) => ["lpComments", lpId];

// 댓글 생성
export const useCreateComment = (lpId: number, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKey(lpId) });
      onSuccess?.();
    },
  });
};

// 댓글 수정
export const useUpdateComment = (lpId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKey(lpId) });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = (lpId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKey(lpId) });
    },
  });
};
