import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../apis/lp';

interface CreateLPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLPModal = ({ isOpen, onClose }: CreateLPModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => { createLP(formData)
      const response = await fetch('/api/lps', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
      setImagePreview(null);
      setImageFile(null);
      setTitle('');
      setContent('');
      setTags([]);
    },
  });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !imageFile || isPending) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    tags.forEach((tag) => formData.append('tags', tag));
    formData.append('image', imageFile);

    mutate(formData);
  };

  const isFormValid = title.trim() !== '' && content.trim() !== '' && imageFile !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className="relative w-full max-w-[400px] rounded-2xl bg-[#2A2B36] p-6 shadow-2xl"
      >
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div 
          className="relative mx-auto mb-8 mt-2 flex h-[160px] w-full cursor-pointer items-center justify-center" 
          onClick={handleImageClick}
        >
          <div 
            className={`relative h-[140px] w-[140px] rounded-full transition-all duration-500 ease-in-out ${
              imagePreview ? 'translate-x-[40px]' : 'translate-x-0'
            }`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#111] bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <div className="flex h-1/3 w-1/3 items-center justify-center rounded-full bg-white">
                <div className="h-2 w-2 rounded-full bg-black"></div>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="absolute left-[60px] z-10 h-[150px] w-[150px] bg-gray-800 shadow-xl transition-all duration-500">
              <img 
                src={imagePreview} 
                alt="LP Cover" 
                className="h-full w-full object-cover" 
              />
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>

        <div className="flex flex-col gap-3">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="LP Name" 
            className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" 
          />
          <input 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="LP Content" 
            className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" 
          />

          <div className="flex gap-2">
            <input 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="LP Tag" 
              className="flex-1 rounded-md border border-gray-600 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-pink-500" 
            />
            <button 
              onClick={handleAddTag} 
              className="rounded-md bg-[#A0A0AB] px-5 text-sm font-semibold text-white hover:bg-gray-500"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="flex items-center gap-1 rounded-md bg-[#3B4A6B] px-2 py-1 text-xs text-white"
                >
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)} 
                    className="ml-1 text-gray-300 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={!isFormValid || isPending}
            className={`mt-2 w-full rounded-md py-3 text-sm font-bold text-white transition-colors ${
              isFormValid && !isPending ? 'bg-[#E83B8F] hover:bg-pink-600' : 'cursor-not-allowed bg-[#BDBDBD]'
            }`}
          >
            {isPending ? 'Adding...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLPModal;