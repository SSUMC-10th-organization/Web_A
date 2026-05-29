import axiosInstance from './axios';
import type {
  GetLPDetailResponse,
  GetLPListParams,
  GetLPListResponse,
  GetCommentListParams,
  GetCommentListResponse,
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

export const createLP = async (formData: FormData) => {
  const { data } = await axiosInstance.post('/v1/lps', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const createComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const updateComment = async (lpId: number, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
    content,
  });
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};