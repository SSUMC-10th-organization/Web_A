import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeLp, unlikeLp } from '../../apis/lp';
import type { GetLPDetailResponse } from '../../types/lp';

export const useToggleLike = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isLiked: boolean) => isLiked ? unlikeLp(lpId) : likeLp(lpId),
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });
      const previous = queryClient.getQueryData<GetLPDetailResponse>(['lp', lpId]);

      queryClient.setQueryData<GetLPDetailResponse>(['lp', lpId], (old) => {
        if (!old) return old;
        const myId = (queryClient.getQueryData<{ data: { id: number } }>(['me']))?.data?.id;

        return {
          ...old,
          data: {
            ...old.data,
            likes: isLiked
              ? old.data.likes.filter((like) => like.userId !== myId)
              : [...old.data.likes, { id: 0, userId: myId ?? 0, lpId }],
          },
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['lp', lpId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['myLikedLps'] });
    },
  });
};