import useCartStore from '../store/useCartStore';
import type { CartItemType } from '../constants/cartItems';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { id, title, singer, price, img, amount } = item;
  
  const { increase, decrease, removeItem } = useCartStore();

  return (
    <article className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
      <div className="flex items-center gap-4">
        <img 
          src={img} 
          alt={title} 
          style={{ width: '80px', height: '80px' }} 
          className="w-20 h-20 object-cover rounded-lg shadow-inner bg-gray-100 flex-shrink-0" 
        />
        <div>
          <h4 className="font-semibold text-gray-800 text-base line-clamp-1">{title}</h4>
          <p className="text-sm text-gray-500 mb-1">{singer}</p>
          <p className="text-sm font-medium text-indigo-600">{Number(price).toLocaleString()}원</p>
          <button 
            type="button"
            onClick={() => removeItem(id)}
            className="text-xs text-red-400 hover:text-red-600 mt-2 font-medium transition underline underline-offset-2"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 bg-gray-100 px-3 py-2 rounded-lg min-w-[45px]">
        <button 
          onClick={() => increase(id)} 
          className="text-gray-500 hover:text-indigo-600 font-bold text-xs p-1 transition"
        >
          ▲
        </button>
        
        <span className="font-bold text-gray-700 text-sm">{amount}</span>

        <button 
          onClick={() => decrease(id)} 
          className="text-gray-500 hover:text-indigo-600 font-bold text-xs p-1 transition"
        >
          ▼
        </button>
      </div>
    </article>
  );
}