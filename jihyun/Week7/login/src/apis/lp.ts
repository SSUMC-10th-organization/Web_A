import axiosInstance from './axios';
import type {
  GetLPDetailResponse,
  GetLPListParams,
  GetLPListResponse,
  GetCommentListParams,
  GetCommentListResponse,
  CreateLPBody,
  CreateLPResponse,
  UpdateCommentBody,
  UpdateCommentResponse,
  DeleteCommentResponse,
  CommonResponse,
} from '../types/lp';

export const getLPList = async ({
  cursor = 0,
  limit = 10,
  search = '',
  order = 'desc',
}: GetLPListParams): Promise<GetLPListResponse> => {
  const { data } = await axiosInstance.get('/v1/lps', {
    params: { cursor, limit, search, order },
  });
  return data;
};

export const getLPDetail = async (lpId: number): Promise<GetLPDetailResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const getCommentList = async (
  lpId: number,
  { cursor = 0, limit = 10, order = 'asc' }: GetCommentListParams
): Promise<GetCommentListResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};

export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const createLP = async (body: CreateLPBody): Promise<CreateLPResponse> => {
  const { data } = await axiosInstance.post('/v1/lps', body);
  return data;
};

export const updateComment = async (
  lpId: number,
  commentId: number,
  body: UpdateCommentBody
): Promise<UpdateCommentResponse> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    body
  );
  return data;
};

export const deleteComment = async (
  lpId: number,
  commentId: number
): Promise<DeleteCommentResponse> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};

export const likeLp = async (lpId: number): Promise<CommonResponse<{ liked: boolean }>> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const unlikeLp = async (lpId: number): Promise<CommonResponse<{ liked: boolean }>> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post('/v1/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.imageUrl;
};

export const getMyLPList = async ({
  cursor = 0,
  limit = 10,
  order = 'desc',
}: GetLPListParams): Promise<GetLPListResponse> => {
  const { data } = await axiosInstance.get('/v1/lps/user', {
    params: { cursor, limit, order },
  });
  return data;
};

export const getMyLikedLPList = async ({
  cursor = 0,
  limit = 10,
  order = 'desc',
}: GetLPListParams): Promise<GetLPListResponse> => {
  const { data } = await axiosInstance.get('/v1/lps/likes/me', {
    params: { cursor, limit, order },
  });
  return data;
};