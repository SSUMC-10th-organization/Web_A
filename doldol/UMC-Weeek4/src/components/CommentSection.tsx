import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import usePostComment from "../hooks/queries/usePostComment";
import {
	useDeleteComment,
	usePatchComment,
} from "../hooks/queries/useCommentMutations";
import useMyInfo from "../hooks/queries/useMyInfo";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { PAGINATION_ORDER } from "../types/common";
import { CommentListSkeleton } from "./CommentSkeleton";

interface CommentSectionProps {
	lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
	const { accessToken } = useAuth();
	const { data: myInfo } = useMyInfo();

	const [order, setOrder] = useState<PAGINATION_ORDER>(
		PAGINATION_ORDER.desc,
	);
	const [content, setContent] = useState("");
	// 메뉴 열린 댓글 id
	const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
	// 수정 중인 댓글
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editContent, setEditContent] = useState("");

	const {
		data,
		isPending,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetInfiniteComments({ lpId, order });

	const { mutate: createComment, isPending: isPosting } =
		usePostComment(lpId);
	const { mutate: patchComment, isPending: isPatching } =
		usePatchComment(lpId);
	const { mutate: deleteCommentMutate } = useDeleteComment(lpId);

	const triggerRef = useIntersectionObserver<HTMLDivElement>({
		onIntersect: () => {
			if (hasNextPage && !isFetchingNextPage) fetchNextPage();
		},
		enabled: hasNextPage && !isFetchingNextPage,
	});

	const comments = data?.pages.flatMap((page) => page.data.data) ?? [];
	const isContentValid = content.trim().length > 0;

	const handleSubmit = () => {
		if (!isContentValid) return;
		createComment(
			{ content: content.trim() },
			{ onSuccess: () => setContent("") },
		);
	};

	const handleEditStart = (commentId: number, currentContent: string) => {
		setEditingId(commentId);
		setEditContent(currentContent);
		setMenuOpenId(null);
	};

	const handleEditConfirm = (commentId: number) => {
		if (!editContent.trim()) return;
		patchComment(
			{ commentId, content: editContent.trim() },
			{
				onSuccess: () => {
					setEditingId(null);
					setEditContent("");
				},
			},
		);
	};

	const handleDelete = (commentId: number) => {
		deleteCommentMutate(commentId);
		setMenuOpenId(null);
	};

	return (
		<div className="mt-8 border-t border-gray-800 pt-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-bold text-white">댓글</h2>
				<div className="flex gap-2">
					{[
						{ label: "오래된순", val: PAGINATION_ORDER.asc },
						{ label: "최신순", val: PAGINATION_ORDER.desc },
					].map(({ label, val }) => (
						<button
							key={val}
							type="button"
							onClick={() => setOrder(val)}
							className={`rounded-md px-3 py-1 text-xs transition-colors ${
								order === val
									? "bg-pink-500 text-white"
									: "bg-gray-800 text-gray-300 hover:bg-gray-700"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* 댓글 작성란 */}
			<div className="mb-2 flex gap-2">
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSubmit();
					}}
					placeholder={
						accessToken
							? "댓글을 입력해주세요"
							: "로그인 후 작성할 수 있습니다"
					}
					disabled={!accessToken || isPosting}
					className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none disabled:opacity-50"
				/>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={!accessToken || !isContentValid || isPosting}
					className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors disabled:bg-gray-700"
				>
					{isPosting ? "..." : "작성"}
				</button>
			</div>
			{accessToken && content.length > 0 && !isContentValid && (
				<p className="mb-3 text-xs text-red-400">
					공백만으로는 작성할 수 없습니다.
				</p>
			)}

			{isError && (
				<p className="py-6 text-center text-sm text-gray-400">
					댓글을 불러오지 못했습니다.
				</p>
			)}
			{isPending && !isError && <CommentListSkeleton count={5} />}

			{!isPending && !isError && (
				<>
					<ul className="divide-y divide-gray-800">
						{comments.map((c) => {
							const isOwn = myInfo && c.authorId === myInfo.id;
							const isEditing = editingId === c.id;
							const isMenuOpen = menuOpenId === c.id;

							return (
								<li key={c.id} className="py-3">
									<div className="flex items-start gap-3">
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
											{c.author?.name?.slice(0, 1) ?? "?"}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-200">
												{c.author?.name ?? "익명"}
											</p>

											{isEditing ? (
												<div className="mt-1 flex gap-2">
													<input
														type="text"
														value={editContent}
														onChange={(e) =>
															setEditContent(e.target.value)
														}
														className="flex-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-sm text-white focus:border-pink-500 focus:outline-none"
													/>
													<button
														type="button"
														onClick={() =>
															handleEditConfirm(c.id)
														}
														disabled={isPatching}
														className="text-green-400 hover:text-green-300 text-sm px-1"
													>
														✓
													</button>
													<button
														type="button"
														onClick={() => setEditingId(null)}
														className="text-gray-400 hover:text-white text-sm px-1"
													>
														✕
													</button>
												</div>
											) : (
												<p className="text-sm text-gray-400">
													{c.content}
												</p>
											)}
										</div>

										{/* 본인 댓글에만 버튼 표시 */}
										{isOwn && !isEditing && (
											<div className="relative flex-shrink-0">
												<button
													type="button"
													onClick={() =>
														setMenuOpenId(
															isMenuOpen ? null : c.id,
														)
													}
													className="p-1 text-gray-500 hover:text-white transition-colors"
												>
													⋮
												</button>
												{isMenuOpen && (
													<div className="absolute right-0 top-7 z-10 flex gap-2 rounded-md bg-gray-800 px-2 py-1 shadow-lg">
														<button
															type="button"
															onClick={() =>
																handleEditStart(c.id, c.content)
															}
															className="text-gray-300 hover:text-white transition-colors"
															aria-label="수정"
														>
															✏️
														</button>
														<button
															type="button"
															onClick={() => handleDelete(c.id)}
															className="text-gray-300 hover:text-red-400 transition-colors"
															aria-label="삭제"
														>
															🗑️
														</button>
													</div>
												)}
											</div>
										)}
									</div>
								</li>
							);
						})}
					</ul>

					{comments.length === 0 && (
						<p className="py-6 text-center text-sm text-gray-500">
							아직 댓글이 없습니다.
						</p>
					)}

					{isFetchingNextPage && <CommentListSkeleton count={3} />}
					{hasNextPage && (
						<div ref={triggerRef} className="h-6 w-full" />
					)}
				</>
			)}
		</div>
	);
};

export default CommentSection;
