import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../apis/upload";
import { useCreateLp, useUpdateLp } from "../hooks/queries/useLpMutations";
import type { Lp } from "../types/lp";

interface LpFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	/* 수정 모드일 때 기존 LP 데이터 전달 */
	initialData?: Lp & { author?: unknown };
}

const LpFormModal = ({ isOpen, onClose, initialData }: LpFormModalProps) => {
	const isEditMode = !!initialData;

	const [thumbnail, setThumbnail] = useState("");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const { mutate: createLp, isPending: isCreating } = useCreateLp();
	const { mutate: updateLp, isPending: isUpdating } = useUpdateLp(
		initialData?.id ?? 0,
	);

	// 수정 모드면 기존 값으로 초기화
	useEffect(() => {
		if (initialData) {
			setThumbnail(initialData.thumbnail ?? "");
			setTitle(initialData.title ?? "");
			setContent(initialData.content ?? "");
			setTags(initialData.tags?.map((t) => t.name) ?? []);
		} else {
			setThumbnail("");
			setTitle("");
			setContent("");
			setTags([]);
		}
		setTagInput("");
	}, [initialData, isOpen]);

	const handleFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setIsUploading(true);
			const imageUrl = await uploadImage(file);
			setThumbnail(imageUrl);
		} catch {
			alert("이미지 업로드에 실패했습니다.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleAddTag = () => {
		const trimmed = tagInput.trim();
		if (!trimmed || tags.includes(trimmed)) return;
		setTags((prev) => [...prev, trimmed]);
		setTagInput("");
	};

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	const handleSubmit = () => {
		if (!title.trim() || !content.trim()) {
			alert("제목과 내용을 입력해주세요.");
			return;
		}

		const body = {
			title: title.trim(),
			content: content.trim(),
			thumbnail,
			tags,
			published: true,
		};

		if (isEditMode) {
			updateLp(body, { onSuccess: onClose });
		} else {
			createLp(body, { onSuccess: onClose });
		}
	};

	if (!isOpen) return null;

	const isPending = isCreating || isUpdating || isUploading;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			onClick={onClose}
		>
			<div
				className="relative w-[360px] rounded-2xl bg-gray-900 p-6 shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 닫기 버튼 */}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-400 hover:text-white text-xl leading-none"
				>
					×
				</button>

				{/* LP 썸네일 클릭하면 파일 선택 */}
				<div className="mb-4 flex justify-center">
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
					>
						{thumbnail ? (
							<img
								src={thumbnail}
								alt="LP 썸네일"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex flex-col items-center gap-1">
								{/* LP 레코드 SVG */}
								<svg
									viewBox="0 0 100 100"
									className="w-20 h-20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>LP 이미지</title>
									<circle cx="50" cy="50" r="48" fill="#222" />
									<circle cx="50" cy="50" r="32" fill="#333" />
									<circle cx="50" cy="50" r="14" fill="#444" />
									<circle cx="50" cy="50" r="5" fill="#666" />
								</svg>
								{isUploading && (
									<span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
										업로드중...
									</span>
								)}
							</div>
						)}
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
				</div>

				{/* 입력 필드 */}
				<div className="flex flex-col gap-3">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="LP Name"
						className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
					/>
					<input
						type="text"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="LP Content"
						className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
					/>

					{/* 태그 입력 */}
					<div className="flex gap-2">
						<input
							type="text"
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddTag();
								}
							}}
							placeholder="LP Tag"
							className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
						/>
						<button
							type="button"
							onClick={handleAddTag}
							className="rounded-md bg-pink-500 px-3 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
						>
							Add
						</button>
					</div>

					{/* 태그 목록 */}
					{tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="flex items-center gap-1 rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-200"
								>
									{tag}
									<button
										type="button"
										onClick={() => handleRemoveTag(tag)}
										className="text-gray-400 hover:text-red-400 transition-colors leading-none"
									>
										×
									</button>
								</span>
							))}
						</div>
					)}

					<button
						type="button"
						onClick={handleSubmit}
						disabled={isPending || !title.trim() || !content.trim()}
						className="mt-1 w-full rounded-md bg-pink-500 py-3 text-sm font-bold text-white hover:bg-pink-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
					>
						{isPending ? "처리중..." : isEditMode ? "수정 완료" : "Add LP"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LpFormModal;
