import { axiosInstance } from "./axios";

// 좋아요 추가
export const postLike = async (lpId: number): Promise<void> => {
  await axiosInstance.post(`/v1/lps/${lpId}/likes`);
};

// 좋아요 취소
export const deleteLike = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
};