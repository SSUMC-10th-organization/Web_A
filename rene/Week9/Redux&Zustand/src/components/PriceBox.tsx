import useCartStore from '../zustand/useCartStore';
import useModalStore from '../zustand/useModalStore';

export default function PriceBox() {
  const { total } = useCartStore();
  const { openModal } = useModalStore();

  return (
    <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-between">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        전체 삭제
      </button>
      <div className="text-right">
        <p className="text-sm text-gray-500">총 금액</p>
        <p className="text-xl font-bold text-gray-900">
          ₩{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
