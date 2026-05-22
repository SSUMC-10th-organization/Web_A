import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../apis/lp';

export const useCreateComment = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
    },
  });
};