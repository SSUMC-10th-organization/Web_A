import type { CommonResponse } from "./common.ts";

// 전역 사용자 정보 타입
export type UserInfo = {
  id: number;
  name: string;
  avatar: string | null;
};

export type RequestUpdateProfileDto = {
  name?: string;
  bio?: string;
  avatar?: string;
};

// 내 정보 요청 데이터 타입
export type ResponseMyInfoDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

// 회원가입관련 데이터 타입
export type RequestSignupDto = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};
export type ResponseSignupDto = CommonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}>;

// 로그인관련 데이터 타입
export type RequestSigninDto = {
  email: string;
  password: string;
};
export type ResponseSigninDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

// 토큰 재발급 응답 타입
export type ResponseRefreshDto = CommonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;