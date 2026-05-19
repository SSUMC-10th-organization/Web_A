import { useRef, useState } from "react";
import defaultProfile from "../assets/default_profile.svg";
import FormInput from "./FormInput";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import type { ResponseMyInfoDto } from "../types/auth";

import type { RequestUpdateProfileDto } from "../types/auth";

type EditProfileModalProps = {
  onClose: () => void;
  onSuccess?: (updated: ResponseMyInfoDto["data"]) => void;
  onOptimistic?: (body: RequestUpdateProfileDto) => void;
  onRollback?: () => void;
  initialName: string;
  initialBio: string | null;
  initialAvatar: string | null;
};

const EditProfileModal = ({
  onClose,
  onSuccess,
  onOptimistic,
  onRollback,
  initialName,
  initialBio,
  initialAvatar,
}: EditProfileModalProps) => {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio ?? "");
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const backdropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 뮤테이션 훅 (프로필 업데이트)
  const { mutate: updateProfile, isPending } = useUpdateProfile({
    onSuccess: (updated) => { onSuccess?.(updated); onClose(); },
    onOptimistic,
    onRollback,
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    updateProfile({
      name: name.trim(),
      bio: bio.trim() || undefined,
      avatar: avatar ?? undefined,
    });
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="relative w-full max-w-sm mx-4 bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="모달 닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <h2 className="text-white text-base font-semibold text-center">프로필 수정</h2>

        {/* 프로필 사진 - 클릭 시 파일 선택 */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden group focus:outline-none"
          >
            <img
              src={avatar ?? defaultProfile}
              alt="프로필 사진"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">사진 변경</span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* 이름 */}
        <FormInput
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 소개 */}
        <FormInput
          type="text"
          placeholder="소개 (선택)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* 저장 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || isPending}
          className="w-full py-3 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed bg-pink-500 hover:bg-pink-600"
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
