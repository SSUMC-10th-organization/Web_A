import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/default_profile.svg";
import backIcon from "../assets/back-icon.svg";
import editIcon from "../assets/edit-icon.svg";
import trashIcon from "../assets/trash-icon.svg";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorFallback from "../components/ErrorFallback";
import CommentSheet from "../components/CommentSheet";
import { useGetLPDetail } from "../hooks/queries/useGetLPDetail";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useToggleLike } from "../hooks/mutations/useToggleLike";
import { useAuth } from "../context/AuthContext";
import { getTimeAgo } from "../utils/date";

const LPDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useRequireAuth();
  const lpId = Number(id);

  const { user } = useAuth();
  const { data: lp, isPending, isError, refetch } = useGetLPDetail(lpId, isAuthenticated);
  const { mutate: toggleLike } = useToggleLike(lpId); // 좋아요 토글 훅
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  if (!isAuthenticated) return null;
  if (isPending) return <LoadingSpinner />;
  if (isError || !lp) {
    return (
      <ErrorFallback
        message="LP 정보를 불러오지 못했습니다."
        onRetry={refetch}
        onBack={() => navigate(-1)}
      />
    );
  }

  const releasedDate = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="flex min-h-screen">

      {/* 좌측 패널 */}
      <div className="w-1/2 bg-zinc-950 flex flex-col px-10 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-600 hover:text-white text-sm transition-colors mb-8 w-fit"
        >
          <img src={backIcon} alt="back" className="w-4 h-4" />
          목록으로
        </button>

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={lp.author.avatar ?? defaultProfile}
              alt={lp.author.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{lp.author.name}</span>
              <span className="text-zinc-500 text-xs">{getTimeAgo(lp.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="opacity-50 hover:opacity-100 transition-opacity" title="수정">
              <img src={editIcon} alt="edit" className="w-5 h-5" />
            </button>
            <button className="opacity-50 hover:opacity-100 transition-opacity" title="삭제">
              <img src={trashIcon} alt="trash" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 바이닐 레코드 */}
        <div className="flex pt-30 justify-center flex-1 py-6">
          <div className="relative w-72 h-72">
            <div className="w-full h-full rounded-full overflow-hidden relative shadow-2xl animate-[spin_8s_linear_infinite]">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-zinc-900/90 border border-zinc-700 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
              </div>
            </div>
            <div
              className="absolute bg-zinc-400 rounded-full"
              style={{
                width: "3px",
                height: "140px",
                top: "-10px",
                right: "30px",
                transformOrigin: "top center",
                transform: "rotate(28deg)",
              }}
            />
            <div
              className="absolute w-4 h-4 rounded-full bg-zinc-500 border border-zinc-400"
              style={{ top: "-14px", right: "23px" }}
            />
          </div>
        </div>
      </div>

      {/* 우측 패널 */}
      <div className="w-1/2 bg-black overflow-y-auto px-10 py-8 flex flex-col gap-6">

        <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
          {lp.title}
        </h1>

        {/* 작가 이름 + 좋아요 */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-300 text-sm">{lp.author.name}</span>
          {(() => {
            const isLiked = lp.likes.some((l) => l.userId === user?.id);
            return (
              <button
                onClick={() => toggleLike({ isLiked })}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isLiked ? "text-pink-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="text-lg">{isLiked ? "♥" : "♡"}</span>
                <span>{lp.likes.length}</span>
              </button>
            );
          })()}
        </div>

        <hr className="border-zinc-800" />

        <div>
          <p className="text-zinc-500 text-xs mb-4">기본 정보</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-zinc-600 text-xs mb-1">아티스트</p>
              <p className="text-white text-sm font-medium">{lp.author.name}</p>
            </div>
            <div>
              <p className="text-zinc-600 text-xs mb-1">업로드일</p>
              <p className="text-white text-sm font-medium">{releasedDate}</p>
            </div>
          </div>
        </div>

        {lp.content && (
          <div>
            <p className="text-zinc-500 text-xs mb-2">본문</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{lp.content}</p>
          </div>
        )}

        <hr className="border-zinc-800" />

        {lp.tags?.length > 0 && (
          <div>
            <p className="text-zinc-500 text-xs mb-3">태그</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {lp.tags.map((tag) => (
                <span key={tag.id} className="text-zinc-500 text-sm">
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 트리거 */}
        <button
          onClick={() => setIsCommentOpen(true)}
          className="flex items-center justify-between w-full text-left group py-1"
        >
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-sm group-hover:text-zinc-100 transition-colors">댓글</span>
            <span className="text-zinc-600 text-xs group-hover:text-zinc-400 transition-colors">더보기</span>
            
          </div>
          <img
            src={backIcon}
            alt="댓글 더보기"
            className="w-4 h-4 rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </button>
      </div>

      {/* 댓글 Bottom Sheet */}
      <CommentSheet
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        lpId={lpId}
      />
    </div>
  );
};

export default LPDetailPage;
