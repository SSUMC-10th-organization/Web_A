import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchComments, createComment, updateComment, deleteComment } from '../../api/comment'; 

interface LPCommentProps {
  lpId: string;
}

const LPComment = ({ lpId }: LPCommentProps) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const currentUserName = "사석훈";

  const { data: commentsData } = useQuery({
    queryKey: ['comments', lpId, sort],
    queryFn: () => fetchComments({ 
      lpId, 
      pageParam: 0, 
      order: sort    
    }),
    enabled: !!lpId,
  });

  const getCleanComments = () => {
    if (!commentsData) return [];
    if (Array.isArray(commentsData)) return commentsData;
    if (commentsData.data && Array.isArray(commentsData.data)) return commentsData.data;
    if (commentsData.result && Array.isArray(commentsData.result)) return commentsData.result;
    return [];
  };

  const comments = getCleanComments();
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => {
      return createComment({ lpId, content });
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({
        queryKey: ['comments', lpId],
        exact: false
      });
    },
    onError: (error: any) => {
      console.error('❌ 댓글 작성 오류:', error);
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => {
      return updateComment({ 
        lpId, 
        commentId: Number(commentId), 
        content 
      });
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingText('');
      queryClient.invalidateQueries({
        queryKey: ['comments', lpId],
        exact: false
      });
    },
    onError: (error: any) => {
      console.error('❌ 댓글 수정 오류:', error);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      return deleteComment({ 
        lpId, 
        commentId: Number(commentId) 
      });
    },
    onSuccess: () => {
      setActiveMenuId(null);
      queryClient.invalidateQueries({
        queryKey: ['comments', lpId],
        exact: false
      });
    },
    onError: (error: any) => {
      console.error('❌ 댓글 삭제 오류:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createCommentMutation.mutate(commentText.trim());
  };

  const handleUpdateSubmit = (commentId: string) => {
    if (!editingText.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editingText.trim() });
  };

  return (
    <Container>
      <HeaderRow>
        <Title>댓글</Title>
        <SortArea>
          <SortBtn $active={sort === 'oldest'} onClick={() => setSort('oldest')}>오래된순</SortBtn>
          <SortBtn $active={sort === 'latest'} onClick={() => setSort('latest')}>최신순</SortBtn>
        </SortArea>
      </HeaderRow>

      <InputForm onSubmit={handleSubmit}>
        <CommentInput
          placeholder="댓글을 입력해주세요"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={createCommentMutation.isPending}
        />
        <SubmitBtn type="submit" disabled={!commentText.trim() || createCommentMutation.isPending}>
          {createCommentMutation.isPending ? '등록..' : '작성'}
        </SubmitBtn>
      </InputForm>

      <CommentList>
        {comments.map((comment: any) => {
          const commentId = comment.id;
          const authorName = comment.user?.name || comment.userName || '익명 사용자';
          const isMyComment = authorName === currentUserName;

          return (
            <CommentItem key={commentId || Math.random()}>
              <DefaultAvatar viewBox="0 0 24 24">
                <path fill="#888" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </DefaultAvatar>
              
              <ContentBody>
                <AuthorName>{authorName}</AuthorName>
                
                {editingCommentId === commentId ? (
                  <EditInputWrapper>
                    <EditInput 
                      value={editingText} 
                      onChange={(e) => setEditingText(e.target.value)}
                      autoFocus
                    />
                    <EditActionRow>
                      <CancelBtn onClick={() => setEditingCommentId(null)}>취소</CancelBtn>
                      <SaveBtn onClick={() => handleUpdateSubmit(commentId)}>저장</SaveBtn>
                    </EditActionRow>
                  </EditInputWrapper>
                ) : (
                  <CommentText>{comment.content}</CommentText>
                )}
              </ContentBody>

              {isMyComment && editingCommentId !== commentId && (
                <MenuContainer>
                  <MoreIcon onClick={() => setActiveMenuId(activeMenuId === commentId ? null : commentId)}>⋮</MoreIcon>
                  
                  {activeMenuId === commentId && (
                    <DropdownMenu>
                      <MenuButton onClick={() => {
                        setEditingCommentId(commentId);
                        setEditingText(comment.content);
                        setActiveMenuId(null);
                      }}>
                        수정
                      </MenuButton>
                      <MenuButton $isDelete onClick={() => {
                        if(confirm("댓글을 삭제하시겠습니까?")) {
                          deleteCommentMutation.mutate(commentId);
                        }
                      }}>
                        삭제
                      </MenuButton>
                    </DropdownMenu>
                  )}
                </MenuContainer>
              )}
            </CommentItem>
          );
        })}
        {comments.length === 0 && (
          <EmptyText>아직 작성된 댓글이 없습니다.</EmptyText>
        )}
      </CommentList>
    </Container>
  );
};

export default LPComment;

const Container = styled.div` background: #25262b; border-radius: 20px; padding: 30px; color: #fff; width: 100%; box-sizing: border-box; `;
const HeaderRow = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; `;
const Title = styled.h2` font-size: 1.1rem; margin: 0; font-weight: 500; `;
const SortArea = styled.div` display: flex; background: #161719; border: 1px solid #3e4045; border-radius: 6px; padding: 2px; `;
const SortBtn = styled.button<{ $active: boolean }>` background: ${({ $active }) => ($active ? '#fff' : 'none')}; color: ${({ $active }) => ($active ? '#000' : '#8a8d93')}; border: none; border-radius: 4px; padding: 6px 14px; font-size: 0.85rem; cursor: pointer; font-weight: 500; `;
const InputForm = styled.form` display: flex; gap: 12px; margin-bottom: 24px; width: 100%; `;
const CommentInput = styled.input` flex: 1; background: transparent; border: 1px solid #3e4045; border-radius: 6px; padding: 12px 16px; color: #fff; font-size: 0.95rem; outline: none; &:focus { border-color: #8a8d93; } &::placeholder { color: #5f6267; } `;
const SubmitBtn = styled.button` background: #8996a6; color: #fff; border: none; border-radius: 6px; padding: 0 20px; font-size: 0.95rem; cursor: pointer; &:disabled { background: #3e4045; color: #5f6267; cursor: not-allowed; } `;
const CommentList = styled.div` display: flex; flex-direction: column; gap: 20px; `;
const CommentItem = styled.div` display: flex; align-items: flex-start; gap: 14px; position: relative; `;
const DefaultAvatar = styled.svg` width: 36px; height: 36px; background: #343a40; border-radius: 50%; padding: 4px; box-sizing: border-box; `;
const ContentBody = styled.div` flex: 1; display: flex; flex-direction: column; gap: 4px; `;
const AuthorName = styled.span` font-size: 0.9rem; font-weight: 500; `;
const CommentText = styled.p` font-size: 0.95rem; color: #e1e3e6; margin: 0; `;
const EmptyText = styled.div` text-align: center; color: #5f6267; padding: 20px; font-size: 0.9rem; `;
const MenuContainer = styled.div` position: relative; `;
const MoreIcon = styled.div` color: #8a8d93; cursor: pointer; font-size: 1.1rem; padding: 0 4px; `;
const DropdownMenu = styled.div` position: absolute; right: 0; top: 20px; background: #1c1d20; border: 1px solid #3e4045; border-radius: 6px; display: flex; flex-direction: column; z-index: 10; min-width: 70px; padding: 4px 0; `;
const MenuButton = styled.button<{ $isDelete?: boolean }>` background: none; border: none; color: ${({ $isDelete }) => $isDelete ? '#fa5252' : '#fff'}; padding: 8px 12px; font-size: 0.85rem; cursor: pointer; text-align: left; &:hover { background: #2c2d31; } `;
const EditInputWrapper = styled.div` display: flex; flex-direction: column; gap: 6px; width: 100%; margin-top: 4px; `;
const EditInput = styled.input` background: #1c1d20; border: 1px solid #3e4045; border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 0.9rem; outline: none; &:focus { border-color: #8a8d93; } `;
const EditActionRow = styled.div` display: flex; justify-content: flex-end; gap: 8px; `;
const CancelBtn = styled.button` background: #3e4045; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; font-size: 0.8rem; cursor: pointer; `;
const SaveBtn = styled.button` background: #8996a6; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; font-size: 0.8rem; cursor: pointer; `;