import { Link } from 'react-router-dom';
import type { LP } from '../types/lp';

type LPCardProps = {
  lp: LP;
};

const LPCard = ({ lp }: LPCardProps) => {
  return (
    <Link
      to={`/lps/${lp.id}`}
      className="block overflow-hidden rounded-lg bg-white shadow-md transition hover:scale-105 dark:bg-gray-800"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
          {lp.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {lp.content}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          좋아요 {lp.likes.length}개
        </p>
      </div>
    </Link>
  );
};

export default LPCard;