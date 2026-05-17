import { useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../api/lp';
import { withdrawUser } from '../api/auth';
import EditProfileModal from './mypage/EditProfileModal';
import { authStorage } from '../utils/authStorage';
import * as S from './Layout.styles';

const Layout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [lpName, setLpName] = useState('');
  const [lpContent, setLpContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const user = authStorage.getUserInfo();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, trimmedTag]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleAddTag();
    }
  };

  const handleDeleteTag = (targetTag: string) => {
    setTags((prev) => prev.filter((tag) => tag !== targetTag));
  };

  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => console.log('서버 탈퇴 성공'),
    onError: () => console.warn('서버 탈퇴 에러')
  });

  const handleWithdrawSubmit = () => {
    withdrawMutation.mutate();
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    setIsWithdrawModalOpen(false);
    setIsSidebarOpen(false);
    navigate('/login', { replace: true });
  };

  const createLPMutation = useMutation({
    mutationFn: async () => {
      if (!lpName.trim() || !lpContent.trim()) {
        alert("제목과 내용을 모두 입력해주세요.");
        throw new Error("Required fields are missing");
      }
      if (tags.length === 0) {
        alert("최소 하나의 태그를 입력해주세요.");
        throw new Error("At least one tag is required");
      }

      const requestBody = {
        title: lpName.trim(),
        content: lpContent.trim(),
        thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Vinyl_record.svg/768px-Vinyl_record.svg.png",
        tags: tags.map(tag => tag.trim()),
        published: true 
      };

      return createLP(requestBody);
    },
    onSuccess: () => {
      setIsCreateModalOpen(false);
      setLpName('');
      setLpContent('');
      setTags([]);
      setTagInput('');
      setPreviewImage(null);
      setSelectedFile(null);

      queryClient.invalidateQueries({ 
        queryKey: ['lps'],
        exact: false
      });
      
      alert('LP가 성공적으로 등록되었습니다!');
    },
    onError: (error: any) => {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'LP 생성에 실패했습니다.';
      alert(`등록 실패: ${errorMsg}`);
    },
  });

  return (
    <S.LayoutWrapper>
      <Navbar onMenuClick={toggleSidebar} />

      <S.Body>
        {isSidebarOpen && <S.Overlay onClick={toggleSidebar} />}

        <S.Sidebar $isOpen={isSidebarOpen}>
          <S.MenuSection>
            <S.MenuItem onClick={() => { navigate('/'); setIsSidebarOpen(false); }}>
              🔍 찾기
            </S.MenuItem>
            <S.MenuItem onClick={() => { navigate('/mypage'); setIsSidebarOpen(false); setIsEditOpen(true); }}>
              👤 마이페이지
            </S.MenuItem>
          </S.MenuSection>

          <S.BottomSection>
            <S.MenuItem onClick={() => setIsWithdrawModalOpen(true)}>
              탈퇴하기
            </S.MenuItem>
          </S.BottomSection>
        </S.Sidebar>

        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.Body>

      <S.FloatingButton onClick={() => setIsCreateModalOpen(true)}>+</S.FloatingButton>

      {isCreateModalOpen && (
        <S.ModalOverlay onClick={() => setIsCreateModalOpen(false)}>
          <S.ModalContainer onClick={(e) => e.stopPropagation()}>
            <S.CloseButton onClick={() => setIsCreateModalOpen(false)}>✕</S.CloseButton>

            <S.LPImageWrapper onClick={() => fileInputRef.current?.click()}>
              <S.LPImage
                src={previewImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Vinyl_record.svg/768px-Vinyl_record.svg.png'}
                alt="lp"
              />
            </S.LPImageWrapper>

            <S.HiddenFileInput 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange} 
            />
            
            <S.Input placeholder="LP Name" value={lpName} onChange={(e) => setLpName(e.target.value)} />
            <S.Input placeholder="LP Content" value={lpContent} onChange={(e) => setLpContent(e.target.value)} />

            <S.TagRow>
              <S.TagInput 
                placeholder="LP Tag" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                onKeyDown={handleTagKeyDown}
              />
              <S.AddTagButton onClick={handleAddTag}>Add</S.AddTagButton>
            </S.TagRow>

            <S.TagList>
              {tags.map((tag) => (
                <S.TagItem key={tag}>
                  #{tag}
                  <S.DeleteTagButton onClick={() => handleDeleteTag(tag)}>✕</S.DeleteTagButton>
                </S.TagItem>
              ))}
            </S.TagList>

            <S.SubmitButton 
              onClick={() => createLPMutation.mutate()} 
              disabled={createLPMutation.isPending}
            >
              {createLPMutation.isPending ? '등록 중...' : 'Add LP'}
            </S.SubmitButton>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}

      {isWithdrawModalOpen && (
        <S.ModalOverlay onClick={() => setIsWithdrawModalOpen(false)}>
          <S.ModalContainer onClick={(e) => e.stopPropagation()} style={{ width: '380px', padding: '35px 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <S.CloseButton onClick={() => setIsWithdrawModalOpen(false)}>✕</S.CloseButton>
            
            <h3 style={{ color: '#fff', marginBottom: '30px', fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.5px' }}>정말 탈퇴하시겠습니까?</h3>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}>
              <button 
                onClick={handleWithdrawSubmit}
                style={{ 
                  flex: '0 0 110px', 
                  width: '110px', 
                  height: '42px', 
                  background: '#ced4da', 
                  color: '#000000', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.95rem', 
                  cursor: 'pointer' 
                }}
              >
                예
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                style={{ 
                  flex: '0 0 110px', 
                  width: '110px', 
                  height: '42px', 
                  background: '#ff0080', 
                  color: '#ffffff', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '0.95rem', 
                  cursor: 'pointer' 
                }}
              >
                아니오
              </button>
            </div>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}

      {isEditOpen && <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />}
    </S.LayoutWrapper>
  );
};

export default Layout;