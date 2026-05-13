import api from './axios';

/**
 * LP 목록 가져오기 (무한 스크롤 대응)
 * @param pageParam - 다음 데이터를 가져오기 위한 기준점 (cursor)
 * @param sort - 정렬 기준 (latest | oldest)
 */
export const fetchLPs = async ({ pageParam = 0, sort }: { pageParam?: number; sort: string }) => {
  try {
    // [x] 이미지 56f064.png 명세에 맞춰 cursor와 sort를 쿼리 파라미터로 전달
    const response = await api.get(`/v1/lps`, {
      params: {
        cursor: pageParam,
        sort: sort,
      },
    });
    
    // 서버 응답 구조가 { result: [...] } 또는 { data: [...] } 인 경우를 모두 대응
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    console.error("LP 목록 로드 실패:", error);
    throw error;
  }
};

/**
 * LP 상세 정보 가져오기
 * @param id - LP 고유 ID
 */
export const getLpDetail = async (id: string) => {
  try {
    const response = await api.get(`/v1/lps/${id}`);
    
    // 상세 데이터 객체 반환
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    console.error(`LP 상세(${id}) 로드 실패:`, error);
    throw error;
  }
};