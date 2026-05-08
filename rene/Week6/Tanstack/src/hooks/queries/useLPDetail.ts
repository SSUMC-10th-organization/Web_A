import { useQuery } from "@tanstack/react-query";
import { getLPDetail } from "../apis/lp";

export const useLPDetail = (id: number, authenticated = true) =>
  useQuery({
    queryKey: ["lp", id],
    queryFn: () => getLPDetail(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!id && authenticated,
  });
