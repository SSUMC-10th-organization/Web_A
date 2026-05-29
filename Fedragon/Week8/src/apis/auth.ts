import axiosInstance from './axios';
import type {
  RequestSignInDto,
  RequestSignUpDto,
  ResponseSignInDto,
  ResponseSignUpDto,
} from '../types/auth';

export const postSignIn = async (
  body: RequestSignInDto
): Promise<ResponseSignInDto> => {
  const { data } = await axiosInstance.post<ResponseSignInDto>(
    '/v1/auth/signin',
    body
  );
  return data;
};

export const postSignUp = async (
  body: RequestSignUpDto
): Promise<ResponseSignUpDto> => {
  const { data } = await axiosInstance.post<ResponseSignUpDto>(
    '/v1/auth/signup',
    body
  );
  return data;
};

export const getMyInfo = async () => {
  const { data } = await axiosInstance.get('/v1/users/me');
  return data;
};

export const updateUserProfile = async (formData: FormData) => {
  const { data } = await axiosInstance.patch('/v1/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};