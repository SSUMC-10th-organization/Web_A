import type { CommonResponse } from "./common";

export type LPTag = {
  id: number;
  name: string;
};

export type LPLike = {
  id: number;
  userId: number;
  lpId: number;
};

// LP 정보
export type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: LPTag[];
  likes: LPLike[];
};

export type LPListData = {
  data: LP[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type LPAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LPDetail = LP & {
  author: LPAuthor;
};

export type ResponseLPListDto = CommonResponse<LPListData>;
export type ResponseLPDetailDto = CommonResponse<LPDetail>;
