const SkeletonCard = () => {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-gray-800">
      {/* 썸네일 영역 */}
      <div className="w-full aspect-square bg-gray-700" />
      {/* 텍스트 영역 */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-2/3" />
        <div className="h-3 bg-gray-600 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
};

export default SkeletonCard;