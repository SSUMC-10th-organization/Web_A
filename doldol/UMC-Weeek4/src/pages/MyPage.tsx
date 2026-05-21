import { useRef, useState } from "react";
import useMyInfo from "../hooks/queries/useMyInfo";
import { useUpdateUser } from "../hooks/queries/useUserMutations";
import { uploadImage } from "../apis/upload";

const MyPage = () => {
	const { data: myInfo, isPending } = useMyInfo();

	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [avatar, setAvatar] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

	const startEdit = () => {
		setName(myInfo?.name ?? "");
		setBio(myInfo?.bio ?? "");
		setAvatar(myInfo?.avatar ?? "");
		setIsEditing(true);
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setIsUploading(true);
			const imageUrl = await uploadImage(file);
			setAvatar(imageUrl);
		} catch {
			alert("이미지 업로드에 실패했습니다.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSave = () => {
		updateUser(
			{
				name: name.trim() || undefined,
				bio: bio.trim() || undefined,
				avatar: avatar || undefined,
			},
			{
				onSuccess: () => setIsEditing(false),
				onError: () => alert("수정에 실패했습니다."),
			},
		);
	};

	if (isPending) {
		return (
			<div className="flex justify-center p-10">
				<div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-md">
					<div className="h-24 w-24 rounded-full bg-gray-800" />
					<div className="h-5 w-32 bg-gray-800 rounded" />
					<div className="h-4 w-48 bg-gray-800 rounded" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center p-6">
			<div className="w-full max-w-md rounded-xl bg-gray-900 p-8">
				<div className="flex flex-col items-center gap-6">
					{/* 프로필 사진 */}
					<div className="relative">
						<div className="h-24 w-24 overflow-hidden rounded-full bg-gray-700">
							{(isEditing ? avatar : myInfo?.avatar) ? (
								<img
									src={isEditing ? avatar : (myInfo?.avatar ?? "")}
									alt="프로필"
									className="h-full w-full object-cover"
								/>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-full w-full text-gray-500 p-4"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<title>프로필</title>
									<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
								</svg>
							)}
						</div>
						{isEditing && (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 hover:opacity-100 transition-opacity"
							>
								{isUploading ? "업로드중..." : "변경"}
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleAvatarChange}
						/>
					</div>

					{isEditing ? (
						<div className="w-full flex flex-col gap-3">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="이름"
								className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none"
							/>
							<input
								type="text"
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Bio (선택)"
								className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-pink-500 focus:outline-none"
							/>
							<p className="text-xs text-gray-500 text-center">
								이메일: {myInfo?.email}
							</p>
							<div className="flex gap-2 mt-1">
								<button
									type="button"
									onClick={handleSave}
									disabled={isUpdating || isUploading || !name.trim()}
									className="flex-1 rounded-md bg-pink-500 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
								>
									{isUpdating ? "저장 중..." : "저장"}
								</button>
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="flex-1 rounded-md bg-gray-700 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
								>
									취소
								</button>
							</div>
						</div>
					) : (
						<div className="w-full flex flex-col items-center gap-2">
							<span className="text-xl font-bold text-white">{myInfo?.name}</span>
							{myInfo?.bio && (
								<p className="text-sm text-gray-400">{myInfo.bio}</p>
							)}
							<p className="text-sm text-gray-500">{myInfo?.email}</p>
							<button
								type="button"
								onClick={startEdit}
								className="mt-2 rounded-md bg-gray-700 px-5 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
							>
								설정
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyPage;
