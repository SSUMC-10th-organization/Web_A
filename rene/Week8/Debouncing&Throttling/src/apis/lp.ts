import { axiosInstance } from "./axios";
import type { ResponseLPListDto, ResponseLPDetailDto, CreateLPRequest } from "../types/lp";

export type SortType = "oldest" | "newest";
export type OrderType = "asc" | "desc";

// LP 목록 조회
export const getLPs = async (sort: SortType, cursor?: number, limit = 18): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>("/v1/lps", {
    params: { sort, cursor, limit },
  });
  return data;
};

// 제목 검색 LP 목록 조회
export const getSearchLPs = async (
  search: string,
  order: OrderType,
  cursor?: number,
  limit = 18
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>("/v1/lps", {
    params: { search, order, cursor, limit },
  });
  return data;
};

// 태그 검색 LP 목록 조회
export const getTagLPs = async (
  tagName: string,
  order: OrderType,
  cursor?: number,
  limit = 18
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>(`/v1/lps/tag/${encodeURIComponent(tagName)}`, {
    params: { order, cursor, limit },
  });
  return data;
};

// LP 상세 조회
export const getLPDetail = async (id: number): Promise<ResponseLPDetailDto> => {
  const { data } = await axiosInstance.get<ResponseLPDetailDto>(`/v1/lps/${id}`);
  return data;
};

// LP 생성
export const createLP = async (body: CreateLPRequest): Promise<ResponseLPDetailDto> => {
  const { data } = await axiosInstance.post<ResponseLPDetailDto>("/v1/lps", body);
  return data;
};