import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
	id: number;
	name: string;
};

export type Likes = {
	id: number;
	userId: number;
	lpId: number;
};

export type Lp = {
	id: number;
	title: string;
	content: string;
	thumbnail: string;
	published: boolean;
	authorId: number;
	createdAt: Date;
	updatedAt: Date;
	tags: Tag[];
	likes: Likes[];
};

// GET /v1/lps  (목록)
export type ResponseLpListDto = CursorBasedResponse<{
	data: Lp[];
	nextCursor: number;
	hasNext: boolean;
}>;

// GET /v1/lps/{lpId}  (상세) - author 가 추가됨
export type Author = {
	id: number;
	name: string;
	email: string;
	bio: string | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ResponseLpDetailDto = CommonResponse<
	Lp & {
		author: Author;
	}
>;
