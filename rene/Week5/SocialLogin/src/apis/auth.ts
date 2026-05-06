import type { 
  RequestSigninDto, RequestSignupDto, 
  ResponseMyInfoDto, 
  ResponseSigninDto, ResponseSignupDto 
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post<ResponseSignupDto>("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post<ResponseSigninDto>("/v1/auth/signin", body);
  return data;
};

export const postSignout = async (): Promise<void> => {
  await axiosInstance.post("/v1/auth/signout");
}; // 로그아웃

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get<ResponseMyInfoDto>("/v1/users/me");
  return data;
};