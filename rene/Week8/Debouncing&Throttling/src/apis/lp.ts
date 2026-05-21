import { axiosInstance } from "./axios";
import type { ResponseLPListDto, ResponseLPDetailDto, CreateLPRequest } from "../types/lp";

export type OrderType = "asc" | "desc";

// LP 목록 조회 파라미터 인터페이스
interface GetLPsParams {
  cursor?: number;
  limit: number;
  search?: string;
  order: OrderType;
}

// LP 목록 조회 (검색어, 정렬 방식 등 다양한 옵션 지원)
export const getLPs = async ({
  cursor,
  limit = 18,
  search,
  order,
}: GetLPsParams): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>("/v1/lps", {
    params: { cursor, limit, search, order },
  });
  return data;
};

// 태그 검색 LP 목록 조회
export const getTagLPs = async (
  tagName: string,
  cursor?: number,
  limit = 18,
  order: OrderType = "desc"
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get<ResponseLPListDto>(`/v1/lps/tag/${encodeURIComponent(tagName)}`, {
    params: { cursor, limit, order },
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