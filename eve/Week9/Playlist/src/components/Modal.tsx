import useCartStore from '../store/useCartStore';

export default function Modal() {
  const { confirmClearCart, closeModal } = useCartStore();

  return (
    <aside className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 transition-all">

      <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl text-center border border-white/40">
        <h4 className="text-lg font-bold text-gray-800 mb-2">장바구니를 비우시겠습니까?</h4>
        <p className="text-sm text-gray-500 mb-6">담겨있는 모든 음반 플레이리스트가 삭제됩니다.</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={confirmClearCart}
            className="w-24 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition active:scale-95 shadow-sm"
          >
            네
          </button>
          
          <button
            type="button"
            onClick={closeModal}
            className="w-24 py-2 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition active:scale-95 shadow-sm"
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
}