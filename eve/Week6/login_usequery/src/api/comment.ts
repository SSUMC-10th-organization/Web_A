import api from './axios';
// src/api/comment.ts
export const fetchComments = async ({ lpId, pageParam, order }: any) => {
  const response = await api.get(`/v1/lps/${lpId}/comments`, {
    params: {
      cursor: pageParam,
      sort: order,
      _t: Date.now() // 🚨 이 한 줄이 브라우저 캐시를 뚫어줍니다.
    }
  });
  return response.data;
};