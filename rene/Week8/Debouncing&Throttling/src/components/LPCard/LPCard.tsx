import { useNavigate } from "react-router-dom";
import type { LP } from "../../types/lp";
import { getTimeAgo } from "../../utils/date";
import { lpRecord as defaultThumbnail } from "../../assets";

interface LPCardProps {
  lp: LP;
}

const LPCard = ({ lp }: LPCardProps) => {
  const { title, thumbnail, createdAt, likes } = lp;
  const navigate = useNavigate();

  return (
    <div
      className="relative group aspect-square cursor-pointer transition-transform duration-200 hover:scale-115 hover:z-10"
      onClick={() => navigate(`/lps/${lp.id}`)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img src={thumbnail || defaultThumbnail} alt={title || "thumbnail image"} className="w-full h-full object-cover" />
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
