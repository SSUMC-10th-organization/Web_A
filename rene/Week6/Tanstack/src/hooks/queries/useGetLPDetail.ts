import { useQuery } from "@tanstack/react-query";
import { getLPDetail } from "../../apis/lp";

export const useGetLPDetail = (id: number, authenticated = true) =>
  useQuery({
    queryKey: ["lp", id],
    queryFn: () => getLPDetail(id),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    enabled: !!id && authenticated,
    // retry: 1,   // 실패 시 재시도 횟수(기본 3에서 낮추기 등)
    //refetchOnWindowFocus: true, // 포커스 복귀 시 최신화(팀 정책에 따라 on/off)
    // placeholderData: [], // 첫 페치 이전에 잠깐 보여줄 값(깜빡임 완화)
  });

// response는 queryFn에서 반환된 전체 응답 객체. 그 중에서 실제 LP 상세 데이터는 response.data에 담겨있음.
// select 옵션을 사용해서 queryFn의 반환값을 가공하여 LP 상세 데이터(data)만 반환하도록 설정. 
// 이렇게 하면 컴포넌트에서는 useGetLPDetail을 사용할 때 LP 상세 데이터에 바로 접근할 수 있음.
