import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = { id: number; name: string };
export type Likes = { id: number; userId: number; lpId: number };

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

export type Author = {
	id: number;
	name: string;
	email: string;
	bio: string | null;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type ResponseLpListDto = CursorBasedResponse<{
	data: Lp[];
	nextCursor: number;
	hasNext: boolean;
}>;

export type ResponseLpDetailDto = CommonResponse<Lp & { author: Author }>;

export type RequestCreateLpDto = {
	title: string;
	content: string;
	thumbnail: string; // imageUrl from /v1/uploads
	tags: string[];
	published: boolean;
};

export type RequestUpdateLpDto = Partial<RequestCreateLpDto>;