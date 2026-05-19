import { useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import lpRecord from "../assets/lp-record.png";
import FormInput from "./FormInput";

import { useAuth } from "../context/AuthContext";
import { useCreateLP } from "../hooks/mutations/useCreateLP";

type CreateLPModalProps = {
  onClose: () => void;
};

const CreateLPModal = ({ onClose }: CreateLPModalProps) => {
  const { accessToken } = useAuth(); // 로그인된 사용자만 LP 생성 가능
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const { mutate: createLP, isPending } = useCreateLP(onClose);

  const handleSubmit = () => {
    createLP({
      title: title.trim(),
      content: content.trim(),
      thumbnail: thumbnail ?? "",
      tags,
      published: true,
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

        {/* LP 이미지 - 클릭 시 파일 선택 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-36 h-36 rounded-full overflow-hidden group focus:outline-none"
          >
            <img
              src={thumbnail ?? lpRecord}
              alt="LP 디스크"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">사진 변경</span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailChange}
          />
        </div>

        {/* 비로그인인 경우 모달 UI */}
        {!accessToken ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-zinc-300 text-sm text-center">
              로그인 후 이용 가능한 서비스입니다.
            </p>
            <button
              onClick={() => { onClose(); navigate("/login"); }}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              로그인하러 가기
            </button>
          </div>
        ) : (
          <>
            {/* LP Name */}
            <FormInput
              type="text"
              placeholder="LP Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* LP Content */}
            <FormInput
              type="text"
              placeholder="LP Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* LP Tag + Add 버튼 */}
            <div className="flex gap-2">
              <FormInput
                type="text"
                placeholder="LP Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-4 py-3 text-white text-sm rounded-lg transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed bg-pink-500 hover:bg-pink-600"
              >
                Add
              </button>
            </div>

            {/* 추가된 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-zinc-700 text-zinc-200 text-xs rounded-full"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-zinc-400 hover:text-white ml-1"
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || isPending}
              className="w-full py-3 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed bg-pink-500 hover:bg-pink-600"
            >
              {isPending ? "추가 중..." : "Add LP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateLPModal;
