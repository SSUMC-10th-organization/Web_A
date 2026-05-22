import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../../apis/lp';

export const useDeleteComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
  });
};