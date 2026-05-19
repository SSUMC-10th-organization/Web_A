import type {
  RequestSigninDto, RequestSignupDto,
  RequestUpdateProfileDto,
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

// 내 정보 수정
export const patchMyInfo = async (body: RequestUpdateProfileDto): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.patch<ResponseMyInfoDto>("/v1/users", body);
  return data;
};

// 회원 탈퇴
export const deleteMyAccount = async (): Promise<void> => {
  await axiosInstance.delete("/v1/users");
};