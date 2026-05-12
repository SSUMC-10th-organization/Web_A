import { useRef, useState, type KeyboardEvent } from "react";
import lpRecord from "../assets/lp-record.png";

type CreateLPModalProps = {
  onClose: () => void;
};

const CreateLPModal = ({ onClose }: CreateLPModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    // API 연결 예정
    console.log({ title, content, tags });
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm mx-4 bg-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
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

        {/* LP 이미지 */}
        <div className="flex justify-center">
          <img src={lpRecord} alt="LP 디스크" className="w-36 h-36 object-cover rounded-full" />
        </div>

        {/* LP Name */}
        <input
          type="text"
          placeholder="LP Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-zinc-600 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 bg-zinc-700 outline-none focus:border-pink-400 transition-colors"
        />

        {/* LP Content */}
        <input
          type="text"
          placeholder="LP Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-zinc-600 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 bg-zinc-700 outline-none focus:border-pink-400 transition-colors"
        />

        {/* LP Tag + Add 버튼 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 border border-zinc-600 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 bg-zinc-700 outline-none focus:border-pink-400 transition-colors"
          />
          <button
            onClick={addTag}
            className="px-4 py-3 bg-zinc-600 hover:bg-zinc-500 text-white text-sm rounded-lg transition-colors"
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
          className="w-full py-3 bg-zinc-600 hover:bg-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add LP
        </button>
      </div>
    </div>
  );
};

export default CreateLPModal;
