export default function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-[#BEDAB1] border-t-transparent"
        role="status"
      >
        <span className="sr-only">로딩중</span>
      </div>
    </div>
  );
}