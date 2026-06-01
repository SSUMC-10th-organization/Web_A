interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl px-12 py-8 shadow-xl flex flex-col items-center gap-6">
        <p className="text-lg font-semibold text-gray-900">정말 삭제하시겠습니까?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}
