import type { CommonResponse, CursorBasedResponse } from "./common";

// 댓글 한 건
export type Comment = {
	id: number;
	content: string;
	authorId: number;
	lpId: number;
	createdAt: Date;
	updatedAt: Date;
	author: {
		id: number;
		name: string;
		avatar: string | null;
	};
};

// GET /v1/lps/{lpId}/comments
export type ResponseCommentListDto = CursorBasedResponse<{
	data: Comment[];
	nextCursor: number;
	hasNext: boolean;
}>;

// POST /v1/lps/{lpId}/comments
export type RequestCreateCommentDto = {
	content: string;
};

export type ResponseCreateCommentDto = CommonResponse<Comment>;
