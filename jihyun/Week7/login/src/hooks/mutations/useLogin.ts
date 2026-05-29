import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { postSignIn } from '../../apis/auth';
import type { RequestSignInDto } from '../../types/auth';

export const useLogin = () => {
  const { setTokens } = useAuth();

  return useMutation({
    mutationFn: (data: RequestSignInDto) => postSignIn(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
    },
  });
};