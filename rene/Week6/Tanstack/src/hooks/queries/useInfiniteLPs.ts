import { useInfiniteQuery } from "@tanstack/react-query";
import { getLPs, type SortType } from "../../apis/lp";

const PAGE_SIZE = 20; // 한 번에 가져올 데이터 개수

export const useInfiniteLPs = (sort: SortType) =>
  useInfiniteQuery({
    queryKey: ["lps", sort], // 정렬 방식(sort)이 바뀔 때마다 새로운 무한 스크롤 리스트를 만듦
    queryFn: async ({ pageParam }) => {
      const response = await getLPs(sort, pageParam, PAGE_SIZE);
      return response.data; // response 중에 data만 캐시에 저장
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

// 1. 첫 요청: 훅이 실행되면 initialPageParam인 undefined를 가지고 getLPs(sort, undefined, PAGE_SIZE)를 호출
// 2. 데이터 수신: 서버에서 PAGE_SIZE개의 데이터와 함께 "다음 데이터는 여기서부터 시작해"라는 의미의 nextCursor를 보냄.
// 3. 다음 페이지 준비: getNextPageParam 함수가 실행됩니다. 서버가 준 lastPage.nextCursor 값을 받아서 저장해둡니다.
// 4. 추가 요청: 사용자가 스크롤을 끝까지 내리면, 저장해뒀던 nextCursor가 pageParam으로 전달되면서 getLPs(sort, 차기커서값, PAGE_SIZE)를 호출합니다.

