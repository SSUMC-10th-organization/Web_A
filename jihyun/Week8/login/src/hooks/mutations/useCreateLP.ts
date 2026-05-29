import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../../apis/lp';
import type { CreateLPBody } from '../../types/lp';

export const useCreateLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateLPBody) => createLP(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    },
  });
};