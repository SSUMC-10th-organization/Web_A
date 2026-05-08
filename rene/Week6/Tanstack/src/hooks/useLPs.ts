import { useQuery } from "@tanstack/react-query";
import { getLPs, type SortType } from "../apis/lp";

export const useLPs = (sort: SortType) =>
  useQuery({
    queryKey: ["lps", sort],
    queryFn: () => getLPs(sort),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
