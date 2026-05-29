import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CreateLPModal from '../components/CreateLPModal';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../apis/auth'; 

type UserProfile = {
  id: number;
  name: string;
  bio?: string;
  profileImage?: string;
  email?: string;
};

const MyPage = () => {
  const { user } = useAuth() as { user?: UserProfile };
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user?.bio || '');
      setImagePreview(user?.profileImage || null);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => updateUserProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setIsEditing(false);
    },
  });

  const handleImageClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || updateProfileMutation.isPending) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-8 pt-20">
        
        <div className="flex items-center gap-8">
          <div 
            className={`relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gray-200 overflow-hidden ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-20 w-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-xs font-bold text-white">사진 변경</span>
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
            {isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    className="w-64 rounded-md border border-white bg-transparent px-4 py-2 text-lg font-bold text-white outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={updateProfileMutation.isPending || !name.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
                
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="소개글을 입력하세요 (선택)"
                  className="w-64 rounded-md border border-white bg-transparent px-4 py-2 text-sm text-white outline-none"
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{name || '이름 없음'}</h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-300">{bio || '소개글이 없습니다.'}</p>
              </>
            )}

            <p className="mt-1 text-sm font-light text-gray-400">{user?.email || 'kyj0719@gmail.com'}</p>
          </div>
        </div>

      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-light text-white shadow-lg transition-transform hover:scale-110"
      >
        +
      </button>

      <CreateLPModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default MyPage;