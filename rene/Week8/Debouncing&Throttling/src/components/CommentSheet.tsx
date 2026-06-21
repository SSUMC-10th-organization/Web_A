import { useState, useRef, memo } from "react";
import { useIntersectionObserver } from "../hooks/utils/useIntersectionObserver";
import SortButtonGroup from "./common/SortButtonGroup";
import { defaultProfile } from "../assets";
import { useInfiniteComments } from "../hooks/queries/useInfiniteComments";
import { useCreateComment, useUpdateComment, useDeleteComment } from "../hooks/mutations/useCommentMutations";
import { useAuth } from "../context/AuthContext";
import type { OrderType } from "../apis/comment";
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
  onClose: (isOpen: boolean) => void;
  lpId: number;
}

const CommentSheet = memo(({ isOpen, onClose, lpId }: Props) => {
  const { user } = useAuth();
  const [commentOrder, setCommentOrder] = useState<OrderType>("asc");
  const [newComment, setNewComment] = useState("");
  
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null); // 본인 댓글의 ••• 메뉴
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const {
    data: commentData,
    isPending: isCommentPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteComments(lpId, commentOrder, true);

  const { mutate: createComment, isPending: isCreating } = useCreateComment(lpId, () =>
    setNewComment("")
  );
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(lpId);
  const { mutate: deleteComment } = useDeleteComment(lpId);

  const sheetScrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(
    sentinelRef,
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && isOpen,
    { rootRef: sheetScrollRef }
  );

  const comments = commentData?.pages.flatMap((p) => p.data) ?? [];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createComment(newComment.trim());
  };

  const handleStartEdit = (commentId: number, content: string) => {
    setEditingId(commentId);
    setEditingContent(content);
    setMenuOpenId(null);
  };

  const handleConfirmEdit = (commentId: number) => {
    if (!editingContent.trim()) return;
    updateComment(
      { commentId, content: editingContent.trim() },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const handleDelete = (commentId: number) => {
    deleteComment(commentId);
    setMenuOpenId(null);
  };

  return (
    <>
      {/* 백드롭 */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose(false)}
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
            onClick={() => onClose(false)}
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
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isCreating}
              className={`text-xs font-medium transition-colors flex-shrink-0 py-2.5 ${
                newComment.trim() && !isCreating
                  ? "text-pink-400 hover:text-pink-300"
                  : "text-zinc-600"
              }`}
            >
              {isCreating ? "작성 중..." : "작성"}
            </button>
          </div>
        </div>

        {/* 정렬 버튼 */}
        <div className="flex items-center justify-end px-6 pb-3 flex-shrink-0">
          <SortButtonGroup
            options={[
              { value: "asc", label: "오래된순" },
              { value: "desc", label: "최신순" },
            ]}
            value={commentOrder}
            onChange={setCommentOrder}
            size="small"
          />
        </div>

        {/* 댓글 목록 */}
        <div
          ref={sheetScrollRef}
          className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4"
          onClick={() => setMenuOpenId(null)}
        >
          {isCommentPending &&
            Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

          {comments.map((comment) => {
            const isOwn = comment.authorId === user?.id;
            const isEditing = editingId === comment.id;

            return (
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

                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConfirmEdit(comment.id)}
                        className="flex-1 bg-zinc-800 text-white text-sm px-3 py-1.5 rounded-lg outline-none border border-zinc-600 focus:border-pink-400"
                        autoFocus
                      />
                      <button
                        onClick={() => handleConfirmEdit(comment.id)}
                        disabled={!editingContent.trim() || isUpdating}
                        className="text-xs text-pink-400 hover:text-pink-300 disabled:text-zinc-600"
                      >
                        완료
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <p className="text-zinc-400 text-sm">{comment.content}</p>
                  )}
                </div>

                {/* 본인 댓글 ... 메뉴 */}
                {isOwn && !isEditing && (
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === comment.id ? null : comment.id);
                      }}
                      className="text-zinc-500 hover:text-zinc-300 px-1"
                    >
                      •••
                    </button>
                    {menuOpenId === comment.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-6 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 overflow-hidden"
                      >
                        <button
                          onClick={() => handleStartEdit(comment.id, comment.content)}
                          className="block w-full text-left px-4 py-2 text-xs text-white hover:bg-zinc-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

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
});

export default CommentSheet;
