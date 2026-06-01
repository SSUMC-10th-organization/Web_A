import { useAppDispatch } from '../hooks/useCustomRedux';
import { increase, decrease } from '../features/cart/cartSlice';
import type { CartItemType } from '../types/cart';

export default function CartItem({ id, title, singer, price, img, amount }: CartItemType) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center px-8 py-5 border-b border-gray-200">
      <img
        src={img}
        alt={title}
        className="w-[76px] h-[76px] object-cover rounded mr-6 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-base">{title}</h3>
        <p className="text-gray-500 text-sm mt-0.5">{singer}</p>
        <p className="font-semibold text-gray-900 mt-1">${price}</p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <button
          onClick={() => dispatch(decrease(id))}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 font-medium transition-colors cursor-pointer"
        >
          −
        </button>
        <span className="w-4 text-center font-medium text-gray-900">
          {amount}
        </span>
        <button
          onClick={() => dispatch(increase(id))}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-600 font-medium transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
