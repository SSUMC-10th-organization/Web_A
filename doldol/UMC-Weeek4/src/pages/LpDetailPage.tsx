import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useMyInfo from "../hooks/queries/useMyInfo";
import { useDeleteLp, useLikeLp } from "../hooks/queries/useLpMutations";
import CommentSection from "../components/CommentSection";
import LpFormModal from "../components/LpFormModal";

const LpDetailPage = () => {
	const { lpId } = useParams();
	const navigate = useNavigate();
	const id = Number(lpId);

	const { data, isPending, isError, refetch } = useGetLpDetail(id);
	const { data: myInfo } = useMyInfo();

	// myInfo.id 를 전달 → 낙관적 업데이트 시 userId 매칭에 사용
	const { like, unlike } = useLikeLp(id, myInfo?.id);
	const { mutate: deleteLp } = useDeleteLp();
	const [editOpen, setEditOpen] = useState(false);

	if (isPending) {
		return (
			<div className="flex justify-center p-10">
				<div className="w-full max-w-2xl animate-pulse">
					<div className="mb-4 h-6 w-1/2 bg-gray-800 rounded" />
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

	const isOwn = myInfo && data.authorId === myInfo.id;
	const isLiked = myInfo && data.likes.some((l) => l.userId === myInfo.id);
	const isLikePending = like.isPending || unlike.isPending;

	const handleLike = () => {
		if (!myInfo) { alert("로그인이 필요합니다."); return; }
		if (isLiked) { unlike.mutate(); } else { like.mutate(); }
	};

	const handleDelete = () => {
		if (!confirm("정말 삭제하시겠습니까?")) return;
		deleteLp(id, { onSuccess: () => navigate("/") });
	};

	const formattedDate = new Date(data.createdAt).toLocaleDateString();

	return (
		<>
			<div onClick={() => navigate(-1)} className="flex justify-center p-6 cursor-pointer">
				<div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl bg-gray-900 p-6 cursor-default">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs">
								{data.author.name.slice(0, 1)}
							</div>
							<span className="text-sm text-gray-200">{data.author.name}</span>
						</div>
						<span className="text-xs text-gray-500">{formattedDate}</span>
					</div>

					<div className="mb-6 flex items-center justify-between">
						<h1 className="text-2xl font-bold text-white">{data.title}</h1>
						{isOwn && (
							<div className="flex gap-3 text-gray-400">
								<button type="button" aria-label="수정" onClick={() => setEditOpen(true)} className="hover:text-white transition-colors">✏️</button>
								<button type="button" aria-label="삭제" onClick={handleDelete} className="hover:text-red-400 transition-colors">🗑️</button>
							</div>
						)}
					</div>

					<div className="mx-auto mb-6 aspect-square w-full max-w-md overflow-hidden rounded-full bg-gray-800">
						<img
							src={data.thumbnail}
							alt={data.title}
							referrerPolicy="no-referrer"
							onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
							className="h-full w-full object-cover"
						/>
					</div>

					<p className="mb-6 text-center text-sm text-gray-400">{data.content}</p>

					<div className="mb-6 flex flex-wrap justify-center gap-2">
						{data.tags.map((tag) => (
							<span key={tag.id} className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
								#{tag.name}
							</span>
						))}
					</div>

					<div className="flex items-center justify-center gap-2">
						<button
							type="button"
							aria-label="좋아요"
							onClick={handleLike}
							disabled={isLikePending}
							className={`text-xl transition-transform hover:scale-110 disabled:opacity-50 ${isLiked ? "text-pink-500" : "text-gray-400"}`}
						>
							♥
						</button>
						<span className="text-sm text-gray-300">{data.likes.length}</span>
					</div>

					<CommentSection lpId={id} />
				</div>
			</div>

			<LpFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} initialData={data} />
		</>
	);
};

export default LpDetailPage;
