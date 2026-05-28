import { useNavigate } from "react-router-dom";
import type { Lp } from "../types/lp";

interface LpCardProps {
	lp: Lp;
}

const formatRelative = (date: Date | string) => {
	const d = new Date(date);
	const diffMs = Date.now() - d.getTime();
	const min = Math.floor(diffMs / 60000);
	if (min < 1) return "방금 전";
	if (min < 60) return `${min} mins ago`;
	const hours = Math.floor(min / 60);
	if (hours < 24) return `${hours} hours ago`;
	const days = Math.floor(hours / 24);
	return `${days} days ago`;
};

const LpCard = ({ lp }: LpCardProps) => {
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onClick={() => navigate(`/lp/${lp.id}`)}
			className="group relative aspect-square w-full overflow-hidden bg-gray-900 cursor-pointer"
		>
			<img
				src={lp.thumbnail}
				alt={lp.title}
				className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
			/>
			{/* Hover 시 어두운 오버레이 + 메타 정보 */}
			<div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<h3 className="line-clamp-2 text-sm font-bold text-white">
					{lp.title}
				</h3>
				<div className="mt-1 flex items-center justify-between text-xs text-gray-300">
					<span>{formatRelative(lp.createdAt)}</span>
					<span>♥ {lp.likes.length}</span>
				</div>
			</div>
		</button>
	);
};

export default LpCard;
