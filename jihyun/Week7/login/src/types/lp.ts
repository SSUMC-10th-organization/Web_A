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

export type GetCommentListResponse = CommonResponse<CursorBasedResponse<Comment[]>>;
export type GetLPListResponse = CommonResponse<CursorBasedResponse<LP[]>>;

export type GetLPDetailResponse = CommonResponse<LP>;
export type InfiniteLPListResponse = CursorBasedResponse<LP[]>;
// 기존 내용 유지 + 아래 추가

export type CreateLPBody = {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
};

export type CreateLPResponse = CommonResponse<LP>;

export type CreateCommentResponse = CommonResponse<Comment>;

export type UpdateCommentBody = { content: string };
export type UpdateCommentResponse = CommonResponse<Comment>;

export type DeleteCommentResponse = CommonResponse<null>;