import type { PaginationDto } from "../types/common";
import type {
	RequestCreateLpDto,
	RequestUpdateLpDto,
	ResponseLpDetailDto,
	ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

// LP 목록 조회 (이름 검색 포함)
export const getLpList = async (
	paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
	const { data } = await axiosInstance.get("/v1/lps", {
		params: paginationDto,
	});
	return data;
};

// LP 태그 검색 
export const getLpsByTag = async (
	tagName: string,
	paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
	const { data } = await axiosInstance.get(
		`/v1/lps/tag/${encodeURIComponent(tagName)}`,
		{ params: paginationDto },
	);
	return data;
};

// LP 상세 조회
export const getLpDetail = async (
	lpId: number,
): Promise<ResponseLpDetailDto> => {
	const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
	return data;
};

// LP 생성
export const postLp = async (body: RequestCreateLpDto) => {
	const { data } = await axiosInstance.post("/v1/lps", body);
	return data;
};

// LP 수정
export const patchLp = async (lpId: number, body: RequestUpdateLpDto) => {
	const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
	return data;
};

// LP 삭제
export const deleteLp = async (lpId: number) => {
	const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
	return data;
};

// 좋아요 추가
export const postLike = async (lpId: number) => {
	const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
	return data;
};

// 좋아요 취소
export const deleteLike = async (lpId: number) => {
	const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
	return data;
};
