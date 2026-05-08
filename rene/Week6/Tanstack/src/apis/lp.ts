import { axiosInstance } from "./axios";
import type { ResponseLPListDto, ResponseLPDetailDto, ResponseCommentListDto } from "../types/lp";

export type SortType = "oldest" | "newest";
export type OrderType = "asc" | "desc";

// LP 목록 조회
export const getLPs = async (sort: SortType, cursor?: number, limit = 18) => {
  const { data } = await axiosInstance.get<ResponseLPListDto>("/v1/lps", {
    params: { sort, cursor, limit },
  });
  return data.data;
};

// LP 상세 조회
export const getLPDetail = async (id: number) => {
  const { data } = await axiosInstance.get<ResponseLPDetailDto>(`/v1/lps/${id}`);
  return data.data;
};

// LP 댓글 목록 조회
export const getComments = async (
  lpId: number,
  order: OrderType,
  cursor?: number,
  limit = 10
) => {
  const { data } = await axiosInstance.get<ResponseCommentListDto>(
    `/v1/lps/${lpId}/comments`,
    { params: { order, cursor, limit } }
  );
  return data.data;
};
