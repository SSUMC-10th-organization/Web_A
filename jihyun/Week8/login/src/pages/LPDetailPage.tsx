import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGetLPDetail } from '../hooks/queries/useGetLPDetail';
import { useGetComments } from '../hooks/queries/useGetComments';
import { useCreateComment } from '../hooks/mutations/useCreateComment';
import { useUpdateComment } from '../hooks/mutations/useUpdateComment';
import { useDeleteComment } from '../hooks/mutations/useDeleteComment';
import { useToggleLike } from '../hooks/mutations/useToggleLike';
import { getMyInfo } from '../apis/auth';
import { useAuth } from '../hooks/useAuth';

const LPDetailPage = () => {
  const { lpId } = useParams();
  const id = Number(lpId);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [commentInput, setCommentInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data, isPending, isError, error } = useGetLPDetail(id);

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(id, order);

  const { mutate: createComment, isPending: isCreating } = useCreateComment(id);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(id);
  const { mutate: deleteComment } = useDeleteComment(id);
  const { mutate: toggleLike } = useToggleLike(id);
  const { accessToken } = useAuth();

  const { data: myInfoData } = useQuery({
    queryKey: ['me'],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });
  const myId = myInfoData?.data?.id ?? null;

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

  const handleCommentSubmit = () => {
    if (!commentInput.trim() || isCreating) return;
    createComment(commentInput, {
      onSuccess: () => setCommentInput(''),
    });
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editingContent.trim() || isUpdating) return;
    updateComment(
      { commentId, content: editingContent },
      { onSuccess: () => { setEditingId(null); setEditingContent(''); } }
    );
  };

  if (isPending) return <div className="p-6 text-center text-white">LP 상세 정보를 불러오는 중...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">에러 발생: {error.message}</div>;

  const lp = data.data;
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];
  const isLiked = lp.likes.some((like) => like.userId === myId);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <img src={lp.thumbnail} alt={lp.title} className="mb-6 h-96 w-full rounded-lg object-cover" />
      <h1 className="text-3xl font-bold text-white">{lp.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-gray-300">{lp.content}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {lp.tags.map((tag) => (
          <span key={tag.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
            #{tag.name}
          </span>
        ))}
      </div>

      {/* 좋아요 버튼 */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => toggleLike(isLiked)}
          className={`flex items-center gap-1 rounded-full px-4 py-1 text-sm font-semibold transition ${
            isLiked
              ? 'bg-pink-500 text-white'
              : 'border border-gray-600 text-gray-400 hover:border-pink-500 hover:text-pink-500'
          }`}
        >
          {isLiked ? '❤️' : '🤍'} {lp.likes.length}
        </button>
      </div>

      {/* 댓글 영역 */}
      <div className="mt-10 border-t border-gray-700 pt-6">
        <h2 className="mb-4 text-xl font-bold text-white">댓글</h2>

        {/* 댓글 작성 */}
        <div className="mb-6 flex gap-2">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
            placeholder="댓글을 입력하세요"
            className="w-full rounded-md border border-gray-700 bg-black px-4 py-2 text-white placeholder-gray-400 outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim() || isCreating}
            className="rounded-md bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600 disabled:bg-gray-600"
          >
            {isCreating ? '등록 중...' : '등록'}
          </button>
        </div>

        {/* 정렬 */}
        <div className="mb-4 flex justify-end">
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="rounded-md border border-gray-700 bg-black px-3 py-1 text-sm text-white outline-none"
          >
            <option value="asc">오래된순</option>
            <option value="desc">최신순</option>
          </select>
        </div>

        {/* 초기 로딩 스켈레톤 */}
        {isCommentPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4">
                <div className="mb-2 h-3 w-1/4 rounded bg-gray-700" />
                <div className="h-3 w-3/4 rounded bg-gray-700" />
              </div>
            ))}
          </div>
        )}

        {/* 댓글 목록 */}
        {!isCommentPending && (
          <>
            {comments.length === 0 ? (
              <p className="text-center text-gray-500">댓글이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map((comment) => {
                  const isMine = comment.authorId === myId;
                  const isEditing = editingId === comment.id;

                  return (
                    <div key={comment.id} className="relative rounded-lg bg-gray-800 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-semibold text-pink-400">
                          {comment.author.name}
                        </p>

                        {isMine && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(openMenuId === comment.id ? null : comment.id)
                              }
                              className="px-2 text-gray-400 hover:text-white"
                            >
                              ···
                            </button>
                            {openMenuId === comment.id && (
                              <div className="absolute right-0 top-6 z-10 rounded-md border border-gray-700 bg-gray-900 shadow-lg">
                                <button
                                  onClick={() => {
                                    setEditingId(comment.id);
                                    setEditingContent(comment.content);
                                    setOpenMenuId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => {
                                    deleteComment(comment.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-2 flex gap-2">
                          <input
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full rounded-md border border-gray-700 bg-black px-3 py-1 text-white outline-none"
                          />
                          <button
                            onClick={() => handleEditSubmit(comment.id)}
                            disabled={isUpdating}
                            className="rounded-md bg-pink-500 px-3 py-1 text-sm text-white hover:bg-pink-600 disabled:bg-gray-600"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-300">{comment.content}</p>
                      )}

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {isFetchingNextPage && (
              <div className="mt-3 flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4">
                    <div className="mb-2 h-3 w-1/4 rounded bg-gray-700" />
                    <div className="h-3 w-3/4 rounded bg-gray-700" />
                  </div>
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-1" />

            {!hasNextPage && comments.length > 0 && (
              <p className="mt-4 text-center text-sm text-gray-500">모든 댓글을 불러왔습니다.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default LPDetailPage;