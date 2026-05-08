import { useState, useEffect, useRef } from "react";
import defaultProfile from "../assets/default_profile.svg";
import { useInfiniteComments } from "../hooks/queries/useInfiniteComments";
import type { OrderType } from "../apis/lp";
import { getTimeAgo } from "../utils/date";

const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
      <div className="h-2.5 bg-zinc-800 rounded w-20" />
      <div className="h-2.5 bg-zinc-800 rounded w-full" />
      <div className="h-2.5 bg-zinc-800 rounded w-2/3" />
    </div>
  </div>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lpId: number;
};

const CommentSheet = ({ isOpen, onClose, lpId }: Props) => {
  const [commentOrder, setCommentOrder] = useState<OrderType>("asc");
  const [newComment, setNewComment] = useState("");

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteComments(lpId, commentOrder, true);

  const sheetScrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = sheetScrollRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && isOpen) {
          fetchNextPage();
        }
      },
      { root, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isOpen]);

  const comments = commentData?.pages.flatMap((p) => p.data) ?? [];

  return (
    <>
      {/* 백드롭 */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 바텀 시트 */}
      <div
        className={`fixed bottom-0 left-1/6 right-1/6 z-50 bg-zinc-900 rounded-t-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-3 flex-shrink-0">
          <p className="text-white text-sm font-semibold">
            댓글{comments.length > 0 ? ` ${comments.length}개` : ""}
          </p>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 댓글 입력 */}
        <div className="flex items-center gap-3 px-6 py-5 flex-shrink-0">
          <img src={defaultProfile} alt="me" className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded-full px-4">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
            />
            <button
              className={`text-xs font-medium transition-colors flex-shrink-0 py-2.5 ${
                newComment.trim() ? "text-pink-400 hover:text-pink-300" : "text-zinc-600"
              }`}
              disabled={!newComment.trim()}
            >
              작성
            </button>
          </div>
        </div>

        {/* 정렬 버튼 */}
        <div className="flex items-center justify-end px-6 pb-3 flex-shrink-0">
          <div className="flex rounded border border-zinc-700 overflow-hidden">
            <button
              onClick={() => setCommentOrder("asc")}
              className={`px-3 py-1 text-xs transition-colors ${
                commentOrder === "asc" ? "bg-white text-black" : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder("desc")}
              className={`px-3 py-1 text-xs transition-colors ${
                commentOrder === "desc" ? "bg-white text-black" : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div
          ref={sheetScrollRef}
          className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4"
        >
          {isCommentPending &&
            Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.author.avatar ?? defaultProfile}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white text-xs font-medium">{comment.author.name}</span>
                  <span className="text-zinc-600 text-xs">{getTimeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-zinc-400 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`np-${i}`} />)}

          <div ref={sentinelRef} className="h-2" />

          {!isCommentPending && !hasNextPage && comments.length > 0 && (
            <p className="text-center text-zinc-600 text-xs">모든 댓글을 불러왔습니다.</p>
          )}
          {!isCommentPending && comments.length === 0 && (
            <p className="text-center text-zinc-600 text-xs py-8">첫 댓글을 남겨보세요.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentSheet;
