import { useCartInfo, useModalActions } from "../hooks/useStore";
import type { LPType } from "../types/cart";
import CartItem from "./CartItem";

export default function CartList() {
  const { cartItems, total } = useCartInfo();
  const { openModal } = useModalActions();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🎵</p>
        <p className="text-lg font-medium">장바구니가 비어있어요</p>
        <p className="text-sm mt-1">음반을 추가해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-6">
      <ul className="w-full">
        {cartItems.map((item: LPType) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
      <div className="w-full mt-6 flex items-center justify-between">
        <p className="text-lg font-bold text-gray-800">
          총 금액:{" "}
          <span className="text-pink-600">₩{total.toLocaleString()}</span>
        </p>
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors text-sm font-medium"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}
