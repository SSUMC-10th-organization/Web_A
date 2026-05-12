import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLPDetail } from '../hooks/queries/useGetLPDetail';
import { useGetComments } from '../hooks/queries/useGetComments';
import { createComment } from '../apis/lp';

const LPDetailPage = () => {
  const { lpId } = useParams();
  const id = Number(lpId);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isPending, isError, error } = useGetLPDetail(id);

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchComments,
  } = useGetComments(id, order);

  // 센티널 ref
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

  const handleCommentSubmit = async () => {
    if (!commentInput.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await createComment(id, commentInput);
      setCommentInput('');
      refetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return <div className="p-6 text-center text-white">LP 상세 정보를 불러오는 중...</div>;
  }

  if (isError) {
    return <div className="p-6 text-center text-red-500">에러 발생: {error.message}</div>;
  }

  const lp = data.data;
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      {/* LP 정보 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="mb-6 h-96 w-full rounded-lg object-cover"
      />
      <h1 className="text-3xl font-bold text-white">{lp.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-gray-300">{lp.content}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {lp.tags.map((tag) => (
          <span key={tag.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
            #{tag.name}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-400">좋아요 {lp.likes.length}개</p>

      {/* 댓글 작성란 */}
      <div className="mt-10 border-t border-gray-700 pt-6">
        <h2 className="mb-4 text-xl font-bold text-white">댓글</h2>

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
            disabled={!commentInput.trim() || isSubmitting}
            className="rounded-md bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600 disabled:bg-gray-600"
          >
            {isSubmitting ? '등록 중...' : '등록'}
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
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-800 p-4">
                    <p className="mb-1 text-sm font-semibold text-pink-400">
                      {comment.author.name}
                    </p>
                    <p className="text-gray-300">{comment.content}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 추가 로딩 스켈레톤 */}
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

            {/* 센티널 */}
            <div ref={sentinelRef} className="h-1" />

            {!hasNextPage && comments.length > 0 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                모든 댓글을 불러왔습니다.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default LPDetailPage;