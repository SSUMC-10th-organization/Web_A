import { useQuery } from "@tanstack/react-query";
import { getLPDetail } from "../../apis/lp";

export const useGetLPDetail = (id: number, authenticated = true) =>
  useQuery({
    queryKey: ["lp", id],
    queryFn: () => getLPDetail(id),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!id && authenticated,
  });
