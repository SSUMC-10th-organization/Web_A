import api from './axios';

export const fetchLPs = async ({
  pageParam = 0,
  sort,
}: {
  pageParam?: number;
  sort: string;
}) => {
  try {
    const response = await api.get(`/v1/lps`, {
      params: {
        cursor: pageParam,
        sort: sort,
      },
    });
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    console.error('LP 목록 로드 실패:', error);
    throw error;
  }
};

export const getLpDetail = async (id: string) => {
  try {
    const response = await api.get(`/v1/lps/${id}`);
    return response.data?.result || response.data?.data || response.data;
  } catch (error) {
    console.error(`LP 상세(${id}) 로드 실패:`, error);
    throw error;
  }
};

export const createLP = async (lpData: {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}) => {
  try {
    const response = await api.post('/v1/lps', lpData);
    return response.data;
  } catch (error) {
    console.error('LP 생성 실패:', error);
    throw error;
  }
};