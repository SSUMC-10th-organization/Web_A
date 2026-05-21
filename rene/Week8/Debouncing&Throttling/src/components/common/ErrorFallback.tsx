interface ErrorFallbackProps {
  message?: string;
  onRetry: () => void;
  onBack?: () => void;
}

const ErrorFallback = ({
  message = "데이터를 불러오지 못했습니다.",
  onRetry,
  onBack,
}: ErrorFallbackProps) => (
  <div className="flex flex-1 flex-col items-center justify-center min-h-[300px] gap-4">
    <p className="text-zinc-400 text-sm">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
    >
      다시 시도
    </button>
    {onBack && (
      <button
        onClick={onBack}
        className="text-zinc-500 text-sm hover:text-white transition-colors"
      >
        돌아가기
      </button>
    )}
  </div>
);

export default ErrorFallback;
