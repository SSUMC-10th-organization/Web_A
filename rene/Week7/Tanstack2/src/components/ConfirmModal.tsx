type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
};

import { createPortal } from "react-dom";

const ConfirmModal = ({ message, onConfirm, onCancel, isPending }: ConfirmModalProps) => {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm mx-4 bg-zinc-900 rounded-2xl p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          disabled={isPending}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="모달 닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <p className="text-white text-sm text-center leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            아니오
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "처리 중..." : "예"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
