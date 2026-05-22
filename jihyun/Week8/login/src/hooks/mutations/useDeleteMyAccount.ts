import { useMutation } from '@tanstack/react-query';
import { deleteMyAccount } from '../../apis/auth';

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};