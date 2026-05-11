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
import type {
  UpdateMyInfoBody,
} from '../types/auth';

export const updateMyInfo = async (body: UpdateMyInfoBody) => {
  const { data } = await axiosInstance.patch('/v1/users', body);
  return data;
};

export const deleteMyAccount = async () => {
  const { data } = await axiosInstance.delete('/v1/users');
  return data;
};

export const postLogout = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/logout');
};