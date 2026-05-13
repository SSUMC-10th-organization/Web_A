import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../api/axios';
import { fetchComments } from '../api/comment';
import styled from 'styled-components';

const LPCommentSection = ({ lpId }: { lpId: string | number }) => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [commentInput, setCommentInput] = useState('');
  const [order, setOrder] = useState<'latest' | 'oldest'>('latest');

  const normalizedId = Number(lpId);

  // 1. 댓글 조회
  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['lpComments', normalizedId, order],
    queryFn: ({ pageParam }) => fetchComments({ lpId: String(normalizedId), pageParam, order }),
    initialPageParam: 0,
    getNextPageParam: (last: any) => {
      const items = last?.result || (Array.isArray(last) ? last : []);
      return items.length < 10 ? undefined : items[items.length - 1].id;
    },
  });

  // 2. 댓글 작성 (400 에러 방지용 명시적 전송)
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      // 🚨 서버 규격에 맞게 { content: "내용" } 형식으로 전송
      return await api.post(`/v1/lps/${normalizedId}/comments`, { 
        content: content.trim() 
      });
    },
    onSuccess: () => {
      setCommentInput('');
      // 캐시 즉시 무효화 및 강제 새로고침
      queryClient.invalidateQueries({ queryKey: ['lpComments', normalizedId] });
      refetch();
    },
    onError: (err: any) => {
      console.error("댓글 작성 실패 상세:", err.response?.data);
      alert(err.response?.data?.message || "작성 실패 (400)");
    }
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  const comments = data?.pages.flatMap(p => p?.result || (Array.isArray(p) ? p : [])) || [];

  return (
    <Wrapper>
      <SortRow>
        <SortBtn $active={order === 'oldest'} onClick={() => setOrder('oldest')}>오래된순</SortBtn>
        <SortBtn $active={order === 'latest'} onClick={() => setOrder('latest')}>최신순</SortBtn>
      </SortRow>

      <InputRow>
        <input 
          value={commentInput} 
          onChange={e => setCommentInput(e.target.value)} 
          placeholder="댓글을 입력하세요" 
          onKeyDown={(e) => e.key === 'Enter' && !mutation.isPending && mutation.mutate(commentInput)}
        />
        <button onClick={() => mutation.mutate(commentInput)} disabled={mutation.isPending}>
          {mutation.isPending ? '...' : '작성'}
        </button>
      </InputRow>

      <List>
        {comments.map((c: any) => (
          <Item key={c.id}>
            <Avatar src={c.user_profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user_nickname}`} />
            <Body>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <strong>{c.user_nickname}</strong>
                <span style={{color:'#555'}}>⋮</span>
              </div>
              <p>{c.content}</p>
            </Body>
          </Item>
        ))}
        <div ref={ref} style={{height: '20px'}} />
      </List>
    </Wrapper>
  );
};

export default LPCommentSection;

const Wrapper = styled.div` padding: 10px; `;
const SortRow = styled.div` display: flex; gap: 10px; margin-bottom: 15px; justify-content: flex-end; `;
const SortBtn = styled.button<{ $active: boolean }>` background: ${p => p.$active ? '#fff' : '#333'}; color: ${p => p.$active ? '#000' : '#888'}; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; `;
const InputRow = styled.div` display: flex; gap: 10px; margin-bottom: 20px; input { flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #333; background: #1a1b1e; color: #fff; outline: none; } button { background: #4a4d55; color: #fff; border: none; padding: 0 15px; border-radius: 8px; cursor: pointer; } `;
const List = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const Item = styled.div` display: flex; gap: 12px; `;
const Avatar = styled.img` width: 35px; height: 35px; border-radius: 50%; `;
const Body = styled.div` flex: 1; p { color: #ccc; margin: 4px 0 0; font-size: 0.9rem; } strong { color: #fff; font-size: 0.9rem; } `;