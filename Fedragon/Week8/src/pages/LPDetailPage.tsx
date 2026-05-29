import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetLPDetail } from '../hooks/querie/useGetLPDetail';
import { useGetComments } from '../hooks/querie/useGetComments';
import { createComment, updateComment, deleteComment } from '../apis/lp';
import type { LP, Comment } from '../types/lp'; 
import { useAuth } from '../hooks/useAuth';

const LPDetailPage = () => {
  const { lpId } = useParams();
  const id = Number(lpId);
  const auth = useAuth();
  const queryClient = useQueryClient();

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [commentInput, setCommentInput] = useState('');
  
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data, isPending, isError, error } = useGetLPDetail(id);

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(id, order);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const createMutation = useMutation({
    mutationFn: (content: string) => createComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentInput('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) => 
      updateComment(id, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setEditingCommentId(null);
      setOpenMenuId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setOpenMenuId(null);
    },
  });

  const handleCommentSubmit = () => {
    if (!commentInput.trim() || createMutation.isPending) return;
    createMutation.mutate(commentInput);
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editInput.trim() || updateMutation.isPending) return;
    updateMutation.mutate({ commentId, content: editInput });
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditInput(comment.content);
    setOpenMenuId(null);
  };

  if (isPending) return <div className="p-6 text-center text-white">LP 상세 정보를 불러오는 중...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">에러 발생: {error?.message}</div>;

  const lp = data.data as LP; 
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <img src={lp.thumbnail} alt={lp.title} className="mb-6 h-96 w-full rounded-lg object-cover" />
      <h1 className="text-3xl font-bold text-white">{lp.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-gray-300">{lp.content}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {lp.tags?.map((tag) => (
          <span key={tag.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
            #{tag.name}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-400">좋아요 {lp.likes?.length || 0}개</p>
 
      <div className="mt-10 rounded-2xl bg-[#2A2B36] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">댓글</h2>
          <div className="flex overflow-hidden rounded-md border border-gray-600 bg-transparent text-sm text-gray-300">
            <button 
              className={`px-3 py-1 ${order === 'asc' ? 'bg-gray-700 text-white' : ''}`}
              onClick={() => setOrder('asc')}
            >
              오래된순
            </button>
            <button 
              className={`px-3 py-1 ${order === 'desc' ? 'bg-white text-black font-semibold' : ''}`}
              onClick={() => setOrder('desc')}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
            placeholder="댓글을 입력해주세요"
            className="flex-1 rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-white"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim() || createMutation.isPending}
            className="rounded-md bg-[#A0A0AB] px-5 py-2 text-sm font-semibold text-white hover:bg-gray-500 disabled:bg-gray-700"
          >
            {createMutation.isPending ? '...' : '작성'}
          </button>
        </div>

        {isCommentPending && (
           <div className="flex flex-col gap-4">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4 h-16" />
             ))}
           </div>
        )}

        {!isCommentPending && (
          <div className="flex flex-col gap-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-semibold text-gray-200">
                      {comment.author.name}
                    </p>

                    {editingCommentId === comment.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleEditSubmit(comment.id); }}
                          className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-1 text-sm text-white outline-none focus:border-white"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleEditSubmit(comment.id)}
                          className="text-white hover:text-pink-400"
                        >
                          ✔
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    )}
                  </div>

                  {auth.user?.id === comment.author.id && editingCommentId !== comment.id && (
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        ⋮
                      </button>
                      
                      {openMenuId === comment.id && (
                        <div className="absolute right-0 top-6 z-10 flex gap-2 rounded-md bg-black px-3 py-2 shadow-lg">
                          <button onClick={() => startEditing(comment)} className="text-gray-300 hover:text-white">✏️</button>
                          <button onClick={() => deleteMutation.mutate(comment.id)} className="text-gray-300 hover:text-red-500">🗑️</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            <div ref={sentinelRef} className="h-1" />
          </div>
        )}
      </div>
    </main>
  );
};

export default LPDetailPage;