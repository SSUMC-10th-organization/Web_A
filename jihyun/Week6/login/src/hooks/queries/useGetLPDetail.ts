import { useQuery } from '@tanstack/react-query';
import { getLPDetail } from '../../apis/lp';

export const useGetLPDetail = (lpId: number) => {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => getLPDetail(lpId),
    enabled: !!lpId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};