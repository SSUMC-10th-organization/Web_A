import { axiosInstance } from "./axios";
import type { ResponseCommentListDto } from "../types/lp";

export type OrderType = "asc" | "desc";

// LP별 댓글 목록 조회
export const getComments = async (
  lpId: number,
  order: OrderType,
  cursor?: number,
  limit = 10
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get<ResponseCommentListDto>(
    `/v1/lps/${lpId}/comments`,
    { params: { order, cursor, limit } }
  );
  return data;
};

// 댓글 생성
export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};

// 댓글 수정
export const updateComment = async (lpId: number, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

// 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};