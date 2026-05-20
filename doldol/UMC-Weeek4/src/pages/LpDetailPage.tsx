import { useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import CommentSection from "../components/CommentSection";

const LpDetailPage = () => {
	const { lpId } = useParams();
	const navigate = useNavigate();
	const id = Number(lpId);

	const { data, isPending, isError, refetch } = useGetLpDetail(id);

	if (isPending) {
		return (
			<div className="flex justify-center p-10">
				<div className="w-full max-w-2xl animate-pulse">
					<div className="mb-4 h-6 w-1/2 bg-gray-800" />
					<div className="aspect-square w-full rounded-full bg-gray-800" />
				</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-20">
				<p className="text-gray-400">정보를 불러오지 못했습니다.</p>
				<button
					type="button"
					onClick={() => refetch()}
					className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
				>
					다시 시도
				</button>
			</div>
		);
	}

	const formattedDate = new Date(data.createdAt).toLocaleDateString();

	return (
		// 바깥 여백을 클릭하면 이전 페이지로 돌아감
		<div
			onClick={() => navigate(-1)}
			className="flex justify-center p-6 cursor-pointer"
		>
			{/* 카드 내부 클릭은 바깥으로 전파되지 않도록 차단 */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-2xl rounded-xl bg-gray-900 p-6 cursor-default"
			>
				{/* 작성자 / 업로드일 */}
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs">
							{data.author.name.slice(0, 1)}
						</div>
						<span className="text-sm text-gray-200">
							{data.author.name}
						</span>
					</div>
					<span className="text-xs text-gray-500">
						{formattedDate}
					</span>
				</div>

				{/* 제목 + 수정/삭제 버튼 */}
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-white">
						{data.title}
					</h1>
					<div className="flex gap-3 text-gray-400">
						<button
							type="button"
							aria-label="수정"
							className="hover:text-white transition-colors"
						>
							✏️
						</button>
						<button
							type="button"
							aria-label="삭제"
							className="hover:text-white transition-colors"
						>
							🗑️
						</button>
					</div>
				</div>

				{/* 썸네일 */}
				<div className="mx-auto mb-6 aspect-square w-full max-w-md overflow-hidden rounded-full bg-gray-800">
					<img
						src={data.thumbnail}
						alt={data.title}
						referrerPolicy="no-referrer"
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display =
								"none";
						}}
						className="h-full w-full object-cover"
					/>
				</div>

				{/* 본문 */}
				<p className="mb-6 text-center text-sm text-gray-400">
					{data.content}
				</p>

				{/* 태그 */}
				<div className="mb-6 flex flex-wrap justify-center gap-2">
					{data.tags.map((tag) => (
						<span
							key={tag.id}
							className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
						>
							#{tag.name}
						</span>
					))}
				</div>

				{/* 좋아요 */}
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						aria-label="좋아요"
						className="text-pink-500 text-xl hover:scale-110 transition-transform"
					>
						♥
					</button>
					<span className="text-sm text-gray-300">
						{data.likes.length}
					</span>
				</div>

				{/* 댓글 섹션 */}
				<CommentSection lpId={id} />
			</div>
		</div>
	);
};

export default LpDetailPage;
