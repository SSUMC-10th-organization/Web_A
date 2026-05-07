import type { LP } from "../types/lp";

const getTimeAgo = (dateStr: string): string => {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "1 days ago";
  return `${diffDays} days ago`;
};

interface LPCardProps {
  lp: LP;
}

const LPCard = ({ lp }: LPCardProps) => {
  const { title, thumbnail, createdAt, likes } = lp;

  return (
    <div
      className="relative group aspect-square cursor-pointer transition-transform duration-200 hover:scale-115 hover:z-10"
      onClick={() => alert(`"${title}" 앨범이 클릭되었습니다!`)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <p className="text-white font-semibold text-sm truncate">{title}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-300 text-xs">{getTimeAgo(createdAt)}</span>
            <span className="text-gray-300 text-xs">♥ {likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPCard;
