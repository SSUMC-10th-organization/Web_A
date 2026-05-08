import { useQuery } from '@tanstack/react-query';
import { getLps, getLpDetail } from '../api/lp';

export const useLpsQuery = (sort: string) => {
  return useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps(sort),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLpDetailQuery = (lpid: string | undefined) => {
  return useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid,
  });
};