import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

function useGetLpList({ cursor, search, order, limit }: PaginationDto = {}) {
	return useQuery({
		// order(정렬)가 queryKey 에 포함되어 정렬 변경 시 자동 리패칭됨
		queryKey: [QUERY_KEY.lps, search, order],
		queryFn: () => getLpList({ cursor, search, order, limit }),
		staleTime: 1000 * 60 * 5, // 5분간 fresh
		gcTime: 1000 * 60 * 10, // 10분간 캐시 보관
		select: (response) => response.data.data, // Lp[] 만 반환
	});
}

export default useGetLpList;
