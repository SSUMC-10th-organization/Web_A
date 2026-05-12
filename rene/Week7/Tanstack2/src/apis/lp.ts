import { axiosInstance } from "./axios";
import type { ResponseLPListDto, ResponseLPDetailDto, CreateLPRequest } from "../types/lp";

export type SortType = "oldest" | "newest";

// LP 목록 조회
export const getLPs = async (sort: SortType, cursor?: number, limit = 18): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>("/v1/lps", {
    params: { sort, cursor, limit },
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