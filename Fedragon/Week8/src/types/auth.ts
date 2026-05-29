import type { CommonResponse } from './common';

export interface RequestSignInDto {
  email: string;
  password: string;
}

export interface ResponseSignInData {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export type ResponseSignInDto = CommonResponse<ResponseSignInData>;

export interface RequestSignUpDto {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}

export interface ResponseSignUpData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ResponseSignUpDto = CommonResponse<ResponseSignUpData>;