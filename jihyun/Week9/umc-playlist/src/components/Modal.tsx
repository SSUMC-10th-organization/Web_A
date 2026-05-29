import {
  useCartActions,
  useModalActions,
  useModalInfo,
} from "../hooks/useStore";

export default function Modal() {
  const { isOpen } = useModalInfo();
  const { closeModal } = useModalActions();
  const { clearCart } = useCartActions();

  if (!isOpen) return null;

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center gap-6">
        <p className="text-lg font-semibold text-gray-800 text-center">
          정말 삭제하시겠습니까?
        </p>
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 font-medium transition-colors"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
