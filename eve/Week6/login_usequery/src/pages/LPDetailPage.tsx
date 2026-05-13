import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { getLpDetail } from '../api/lp';
import { fetchComments } from '../api/comment';
import api from '../api/axios';

const LPDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const { ref, inView } = useInView();

  // --- [사용자 정보 복구] ---
  const storedUser = JSON.parse(localStorage.getItem('user_info') || '{}');
  const loginName = storedUser.nickname || "사석훈";
  const loginProfile = storedUser.profileImage || "https://picsum.photos/seed/user/40/40";

  // --- [하트 카운팅: 0부터 시작] ---
  const [likeCount, setLikeCount] = useState(0); 
  const [isLiked, setIsLiked] = useState(false);

  // --- [로컬 스토리지 댓글 관리] ---
  const STORAGE_KEY = `lp_comments_${id}`;
  const [localComments, setLocalComments] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setLocalComments(JSON.parse(saved));
  }, [id, STORAGE_KEY]);

  // --- [데이터 로드] ---
  const { data: lpData, isLoading } = useQuery({
    queryKey: ['lp', id],
    queryFn: () => getLpDetail(id!),
  });

  const { data: commentData, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['lpComments', id],
    queryFn: ({ pageParam }) => fetchComments({ lpId: id!, pageParam, order: 'latest' }),
    initialPageParam: 0,
    getNextPageParam: (last: any) => {
      const items = last?.result || (Array.isArray(last) ? last : []);
      return items.length < 10 ? undefined : items[items.length - 1].id;
    },
    enabled: isModalOpen,
  });

  const mutation = useMutation({
    mutationFn: (content: string) => api.post(`/v1/lps/${id}/comments`, { content: content.trim() }),
    onSuccess: () => {
      const newComment = {
        id: Date.now(),
        user_nickname: loginName,
        user_profile: loginProfile,
        content: commentInput,
        created_at: new Date().toISOString()
      };
      const updatedLocal = [newComment, ...localComments];
      setLocalComments(updatedLocal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocal));
      setCommentInput('');
      refetch();
    },
  });

  useEffect(() => { if (inView && hasNextPage) fetchNextPage(); }, [inView, hasNextPage]);

  // 🚨 Center 에러 해결: 컴포넌트 정의 여부 확인
  if (isLoading) return <Center>💿 LP 정보를 가져오는 중...</Center>;
  
  const lp = lpData?.result || lpData?.data || lpData;
  const lpImage = lp?.image_url || lp?.coverImage || `https://picsum.photos/seed/${id}/400/400`;
  const serverComments = commentData?.pages.flatMap(p => p?.result || (Array.isArray(p) ? p : [])) || [];
  const allComments = [...localComments, ...serverComments].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  return (
    <Container>
      <ContentCard>
        <Header>
          <UserInfo>
            <Avatar src={loginProfile} />
            <UserName>{loginName}님</UserName>
          </UserInfo>
          <DateText>방금 전</DateText>
        </Header>

        <ImageArea>
          <OuterBox>
            <LPCircle src={lpImage} onError={(e:any) => e.target.src = `https://picsum.photos/seed/${id}/400/400`} />
          </OuterBox>
        </ImageArea>

        <Description>{lp?.content}</Description>
        
        <TagGroup>
          <Tag># {loginName}</Tag>
          <Tag># LP판</Tag>
        </TagGroup>

        <FooterRow>
          <LikeSection onClick={() => { setLikeCount(prev => isLiked ? prev - 1 : prev + 1); setIsLiked(!isLiked); }}>
            <span style={{ fontSize: '1.4rem' }}>{isLiked ? '❤️' : '🤍'}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{likeCount}</span>
          </LikeSection>
          <OpenCommentBtn onClick={() => setIsModalOpen(true)}>💬 댓글 보기</OpenCommentBtn>
        </FooterRow>
      </ContentCard>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3 style={{color:'#fff', margin:0}}>댓글</h3>
              <CloseBtn onClick={() => setIsModalOpen(false)}>✕</CloseBtn>
            </ModalHeader>
            <ScrollArea>
              <InputRow>
                <input 
                  value={commentInput} 
                  onChange={e => setCommentInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && mutation.mutate(commentInput)}
                  placeholder="댓글을 입력해주세요" 
                />
                <button onClick={() => mutation.mutate(commentInput)}>작성</button>
              </InputRow>
              <CommentList>
                {allComments.map((c: any) => (
                  <CommentItem key={c.id}>
                    <Avatar src={c.user_profile || "https://via.placeholder.com/35"} />
                    <div style={{flex:1}}>
                      <strong style={{color:'#fff'}}>{c.user_nickname}</strong>
                      <p style={{color:'#ccc', margin:'5px 0', fontSize:'0.9rem'}}>{c.content}</p>
                    </div>
                  </CommentItem>
                ))}
                <div ref={ref} />
              </CommentList>
            </ScrollArea>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default LPDetailPage;

// --- [스타일 정의] ---
const Container = styled.div` max-width: 800px; margin: 0 auto; padding: 20px; `;
const Center = styled.div` text-align: center; color: #fff; padding-top: 100px; font-size: 1.2rem; `;
const ContentCard = styled.div` background: #1c1d21; border-radius: 20px; padding: 30px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; `;
const UserInfo = styled.div` display: flex; align-items: center; gap: 12px; `;
const Avatar = styled.img` width: 45px; height: 45px; border-radius: 50%; object-fit: cover; `;
const UserName = styled.span` color: #fff; font-weight: bold; font-size: 1.1rem; `;
const DateText = styled.span` color: #666; font-size: 0.85rem; `;
const ImageArea = styled.div` display: flex; justify-content: center; padding: 20px 0; `;
const OuterBox = styled.div` width: 320px; height: 320px; background: #121212; border-radius: 24px; display: flex; justify-content: center; align-items: center; `;
const LPCircle = styled.img` width: 260px; height: 260px; border-radius: 50%; object-fit: cover; border: 4px solid #333; `;
const Description = styled.p` color: #ccc; text-align: center; line-height: 1.8; margin: 30px 0; font-size: 1rem; `;
const TagGroup = styled.div` display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; `;
const Tag = styled.span` background: #343a40; color: #fff; padding: 6px 15px; border-radius: 20px; font-size: 0.85rem; `;
const FooterRow = styled.div` display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 25px; `;
const LikeSection = styled.div` color: #fff; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; gap: 5px; `;
const OpenCommentBtn = styled.button` background: #343a40; color: #fff; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; font-weight: bold; `;
const ModalOverlay = styled.div` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; z-index: 9999; `;
const ModalContent = styled.div` background: #1a1b1e; width: 90%; max-width: 500px; height: 80vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #333; `;
const ModalHeader = styled.div` padding: 20px 25px; display: flex; justify-content: space-between; border-bottom: 1px solid #333; `;
const CloseBtn = styled.button` background: none; border: none; color: #888; font-size: 1.8rem; cursor: pointer; `;
const ScrollArea = styled.div` flex: 1; overflow-y: auto; padding: 25px; `;
const InputRow = styled.div` display: flex; gap: 10px; margin-bottom: 30px; input { flex: 1; background: #121212; border: 1px solid #333; border-radius: 10px; padding: 14px; color: #fff; outline: none; } button { background: #4a4d55; color: #fff; border: none; padding: 0 20px; border-radius: 10px; font-weight: bold; cursor: pointer; } `;
const CommentList = styled.div` display: flex; flex-direction: column; gap: 25px; `;
const CommentItem = styled.div` display: flex; gap: 15px; `;