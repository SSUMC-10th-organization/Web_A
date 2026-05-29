import { useRef, useState } from 'react';
import { useCreateLP } from '../hooks/mutations/useCreateLP';
import { uploadImage } from '../apis/lp';

interface Props {
  onClose: () => void;
}

const CreateLPModal = ({ onClose }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { mutate: createLP, isPending } = useCreateLP();

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    // 서버 업로드
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setThumbnail(imageUrl);
    } catch (e) {
      console.error('이미지 업로드 실패', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || isUploading) return;
    createLP(
      { title, content, thumbnail, tags, published: true },
      { onSuccess: onClose }
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="mb-6 text-xl font-bold text-white">LP 작성</h2>

        <div className="flex flex-col gap-4">
          {/* 제목 */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
          />

          {/* 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            rows={4}
            className="resize-none rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
          />

          {/* 썸네일 파일 업로드 */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              LP 사진
              {isUploading && (
                <span className="ml-2 text-pink-400">업로드 중...</span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-white hover:file:bg-pink-600"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 h-32 w-full rounded-md object-cover"
              />
            )}
          </div>

          {/* 태그 입력 */}
          <div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(); }}
                placeholder="태그 입력"
                className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
              />
              <button
                onClick={handleAddTag}
                className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                추가
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-sm text-white"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 제출 */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isPending || isUploading}
            className="rounded-md bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600 disabled:bg-gray-600"
          >
            {isPending ? '등록 중...' : isUploading ? '이미지 업로드 중...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLPModal;