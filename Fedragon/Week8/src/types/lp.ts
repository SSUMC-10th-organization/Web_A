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

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type LP = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tags: Tag[];
  likes: Like[];
};

export type CommonResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type CursorBasedResponse<T> = {
  data: T;
  nextCursor: number | null;
  hasNext: boolean;
};

export type GetLPListParams = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
};

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetCommentListParams = {
  cursor?: number;
  limit?: number;
  order?: 'asc' | 'desc';
};

export type ResponseSignInDto = CommonResponse<ResponseSignInData>;
export type ResponseSignUpDto = CommonResponse<ResponseSignUpData>;
export type GetCommentListResponse = CommonResponse<CursorBasedResponse<Comment[]>>;
export type GetLPListResponse = CommonResponse<CursorBasedResponse<LP[]>>;
export type GetLPDetailResponse = CommonResponse<LP>;
export type InfiniteLPListResponse = CursorBasedResponse<LP[]>;