import { useCartActions } from "../hooks/useStore";
import type { LPType } from "../types/cart";

interface CartItemProps {
  lp: LPType;
}

export default function CartItem({ lp }: CartItemProps) {
  const { increase, decrease, removeItem } = useCartActions();

  const handleDecrease = () => {
    if (lp.amount === 1) {
      removeItem(lp.id);
      return;
    }
    decrease(lp.id);
  };

  return (
    <li className="flex items-center gap-4 py-4 border-b border-gray-200 w-full">
      <img
        src={lp.img}
        alt={`${lp.title} 이미지`}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://placehold.co/80x80?text=LP";
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {lp.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{lp.singer}</p>
        <p className="text-sm font-medium text-pink-600 mt-1">
          ₩{lp.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => increase(lp.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 font-bold text-lg transition-colors"
        >
          +
        </button>
        <span className="w-6 text-center font-semibold text-gray-800">
          {lp.amount}
        </span>
        <button
          type="button"
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-lg transition-colors"
        >
          -
        </button>
      </div>
    </li>
  );
}
