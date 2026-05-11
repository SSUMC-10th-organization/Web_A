import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyInfo } from '../../apis/auth';
import type { UpdateMyInfoBody } from '../../types/auth';

interface MyInfoData {
  data: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMyInfoBody) => updateMyInfo(body),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['me'] });
      const previous = queryClient.getQueryData<MyInfoData>(['me']);

      queryClient.setQueryData<MyInfoData>(['me'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ...(newData.name && { name: newData.name }),
            ...(newData.bio !== undefined && { bio: newData.bio }),
            ...(newData.avatar && { avatar: newData.avatar }),
          },
        };
      });

      return { previous };
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(['me'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};