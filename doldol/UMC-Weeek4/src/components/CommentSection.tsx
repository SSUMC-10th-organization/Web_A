import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import usePostComment from "../hooks/queries/usePostComment";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { PAGINATION_ORDER } from "../types/common";
import { CommentListSkeleton } from "./CommentSkeleton";

interface CommentSectionProps {
	lpId: number;
}

const CommentSection = ({ lpId }: CommentSectionProps) => {
	const { accessToken } = useAuth();
	const [order, setOrder] = useState<PAGINATION_ORDER>(
		PAGINATION_ORDER.desc,
	);
	const [content, setContent] = useState("");

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

	return (
		<div className="mt-8 border-t border-gray-800 pt-6">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-bold text-white">댓글</h2>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setOrder(PAGINATION_ORDER.asc)}
						className={`rounded-md px-3 py-1 text-xs transition-colors ${
							order === PAGINATION_ORDER.asc
								? "bg-pink-500 text-white"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						오래된순
					</button>
					<button
						type="button"
						onClick={() => setOrder(PAGINATION_ORDER.desc)}
						className={`rounded-md px-3 py-1 text-xs transition-colors ${
							order === PAGINATION_ORDER.desc
								? "bg-pink-500 text-white"
								: "bg-gray-800 text-gray-300 hover:bg-gray-700"
						}`}
					>
						최신순
					</button>
				</div>
			</div>

			{/* 댓글 작성란 */}
			<div className="mb-6 flex gap-2">
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
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
					{isPosting ? "작성중..." : "작성"}
				</button>
			</div>
			{/* 유효성 안내 */}
			{accessToken && content.length > 0 && !isContentValid && (
				<p className="-mt-4 mb-4 text-xs text-red-400">
					공백만으로는 작성할 수 없습니다.
				</p>
			)}

			{/* 에러 */}
			{isError && (
				<p className="py-6 text-center text-sm text-gray-400">
					댓글을 불러오지 못했습니다.
				</p>
			)}

			{/* 초기 로딩: 상단 스켈레톤 */}
			{isPending && !isError && <CommentListSkeleton count={5} />}

			{/* 목록 */}
			{!isPending && !isError && (
				<>
					<ul className="divide-y divide-gray-800">
						{comments.map((c) => (
							<li
								key={c.id}
								className="flex items-start gap-3 py-3"
							>
								<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
									{c.author?.name?.slice(0, 1) ?? "?"}
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-200">
										{c.author?.name ?? "익명"}
									</p>
									<p className="text-sm text-gray-400">
										{c.content}
									</p>
								</div>
							</li>
						))}
					</ul>

					{comments.length === 0 && (
						<p className="py-6 text-center text-sm text-gray-500">
							아직 댓글이 없습니다.
						</p>
					)}

					{/* 추가 로딩: 하단 스켈레톤 */}
					{isFetchingNextPage && (
						<CommentListSkeleton count={3} />
					)}

					{hasNextPage && (
						<div ref={triggerRef} className="h-6 w-full" />
					)}
				</>
			)}
		</div>
	);
};

export default CommentSection;
