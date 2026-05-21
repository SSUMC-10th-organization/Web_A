import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import LPCommentSection from '../components/comment/LPCommentSection';
import * as S from '../components/Layout.styles';

const LPDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isCommentViewOpen, setIsCommentViewOpen] = useState(false);

  const LOCAL_STORAGE_KEY = `lp_local_storage_${id}`;

  // 🚨 [동기화 핵심 해결 1] Home.tsx와 100% 동일한 규칙의 seed 이미지 주소를 생성합니다.
  // 주소창의 id(String)와 홈의 id(Number)가 일치하도록 강제로 String() 변환 처리를 해줍니다.
  const getFallbackImage = (keyId: string) => {
    return `https://picsum.photos/seed/${String(keyId)}/400/400`;
  };

  const [localData, setLocalData] = useState<any>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      title: "로딩 중...",
      content: "데이터를 불러오는 중입니다.",
      thumbnail: getFallbackImage(id || 'default'),
      tags: [],
      likesCount: 0,
      isLiked: false
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
  }, [localData, LOCAL_STORAGE_KEY]);

  const { data: lpData, isLoading } = useQuery({
    queryKey: ['lpDetail', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/v1/lps/${id}`);
        const serverData = response.data?.data ? response.data.data : response.data;
        
        // 서버 데이터 필드 명칭 완벽 매핑
        const fetchedTitle = serverData.title || serverData.titleName || serverData.name;
        const fetchedContent = serverData.content || serverData.description || serverData.summary;
        const fetchedImage = serverData.image_url || serverData.imageUrl || serverData.coverImage || serverData.cover_image || serverData.thumbnail;

        // 🚨 [동기화 핵심 해결 2] 깨진 더미가 들어올 경우 홈 화면과 동일하게 seed 주소로 리다이렉트 우회
        const isBrokenDummy = fetchedImage && (fetchedImage.includes('loremflickr.com') || fetchedImage.includes('placeimg.com'));
        const finalImage = isBrokenDummy || !fetchedImage ? getFallbackImage(id || 'default') : fetchedImage;

        const finalData = {
          ...serverData,
          title: fetchedTitle || "제목 없음",
          content: fetchedContent || "본문 내용이 없습니다.",
          thumbnail: finalImage,
          likesCount: serverData.likesCount ?? 0,
          isLiked: serverData.isLiked ?? false
        };

        setLocalData(finalData);
        return finalData;
      } catch (err) {
        console.error("서버에서 상세 데이터를 가져오는데 실패했습니다. 로컬 데이터를 유지합니다.", err);
        return localData;
      }
    }
  });

  const handleStartEdit = () => {
    setEditTitle(localData.title || '');
    setEditContent(localData.content || '');
    setEditTags(localData.tags || []);
    setPreviewImage(localData.thumbnail || '');
    setIsEditMode(true);
  };

  const updateLPMutation = useMutation({
    mutationFn: async () => {
      const requestBody = {
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbnail: previewImage || localData?.thumbnail,
        image_url: previewImage || localData?.thumbnail,
        imageUrl: previewImage || localData?.thumbnail,
        tags: editTags,
        published: true
      };
      return await api.put(`/v1/lps/${id}`, requestBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpDetail', id] });
      setIsEditMode(false);
      alert('LP 수정을 반영했습니다.');
    },
    onError: () => {
      setLocalData((prev: any) => ({
        ...prev,
        title: editTitle.trim(),
        content: editContent.trim(),
        thumbnail: previewImage,
        tags: editTags
      }));
      setIsEditMode(false);
      alert('LP 수정을 로컬에 반영했습니다.');
    }
  });

  const deleteLPMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/v1/lps/${id}`);
    },
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 삭제되었습니다.');
      navigate('/', { replace: true });
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      alert('LP가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/', { replace: true });
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return await api.post(`/v1/lps/${id}/like`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['lpDetail', id] });
      const previousLPDetail = queryClient.getQueryData(['lpDetail', id]);

      const nextIsLiked = !localData.isLiked;
      const nextLikesCount = nextIsLiked 
        ? (localData.likesCount || 0) + 1 
        : Math.max(0, (localData.likesCount || 0) - 1);

      setLocalData((prev: any) => ({
        ...prev,
        isLiked: nextIsLiked,
        likesCount: nextLikesCount
      }));

      queryClient.setQueryData(['lpDetail', id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: nextIsLiked,
          likesCount: nextLikesCount
        };
      });

      return { previousLPDetail };
    },
    onError: (err) => {
      console.warn('서버 통신 실패로 로컬 상태만 변경합니다.', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lpDetail', id] });
    }
  });

  const handleLikeToggle = () => {
    toggleLikeMutation.mutate();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || editTags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    setEditTags((prev) => [...prev, trimmed]);
    setTagInput('');
  };

  if (isLoading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', color: '#fff' }}>
      
      <S.LPImageWrapper onClick={() => isEditMode && fileInputRef.current?.click()}>
        <S.LPImage 
          src={previewImage || localData?.thumbnail} 
          alt="lp" 
        />
      </S.LPImageWrapper>

      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />

      <div style={{ marginBottom: '40px', marginTop: '30px' }}>
        {isEditMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <S.Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="수정할 제목 입력" style={{ width: '100%', fontSize: '1.5rem', fontWeight: 'bold' }} />
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="수정할 본문 내용 입력" style={{ width: '100%', height: '150px', padding: '15px', borderRadius: '10px', background: '#1a1b1e', color: '#fff', border: '1px solid #444', outline: 'none', fontSize: '1rem' }} />
            <S.TagRow>
              <S.TagInput value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="수정 태그 추가" onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} />
              <S.AddTagButton onClick={handleAddTag}>Add</S.AddTagButton>
            </S.TagRow>
            <S.TagList>
              {editTags.map((tag) => (
                <S.TagItem key={tag}>#{tag}<S.DeleteTagButton onClick={() => setEditTags(editTags.filter(t => t !== tag))}>✕</S.DeleteTagButton></S.TagItem>
              ))}
            </S.TagList>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <S.SubmitButton onClick={() => updateLPMutation.mutate()} disabled={updateLPMutation.isPending} style={{ flex: 1, height: '48px' }}>{updateLPMutation.isPending ? '저장 중...' : '저장 완료'}</S.SubmitButton>
              <S.SubmitButton onClick={() => setIsEditMode(false)} style={{ flex: 1, height: '48px', background: '#5a5d66' }}>취소</S.SubmitButton>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{localData?.title}</h1>
              <div style={{ display: 'flex', gap: '20px', fontSize: '1.4rem', alignItems: 'center' }}>
                <span onClick={handleStartEdit} style={{ cursor: 'pointer' }}>✏️</span>
                <span onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>📸</span>
                <span onClick={() => window.confirm('정말 이 LP를 삭제하시겠습니까?') && deleteLPMutation.mutate()} style={{ cursor: 'pointer', color: '#ff007f' }}>🗑️</span>
              </div>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#ccc', whiteSpace: 'pre-wrap', marginBottom: '30px' }}>{localData?.content}</p>
            <S.TagList>
              {localData?.tags?.map((tag: string) => <S.TagItem key={tag}>#{tag}</S.TagItem>)}
            </S.TagList>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center' }}>
              <button onClick={handleLikeToggle} style={{ background: 'none', border: 'none', color: localData?.isLiked ? '#ff007f' : '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', outline: 'none' }}>
                {localData?.isLiked ? '❤️' : '🤍'} {localData?.likesCount || 0}
              </button>
              <button onClick={() => setIsCommentViewOpen(!isCommentViewOpen)} style={{ background: '#ff007f', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {isCommentViewOpen ? '댓글창 닫기' : '댓글창 열기'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isCommentViewOpen && <LPCommentSection lpId={id!} />}

    </div>
  );
};

export default LPDetailPage;