const LpCardSkeleton = () => {
	return (
		<div className="aspect-square w-full animate-pulse bg-gray-800" />
	);
};

export const LpListSkeleton = ({ count = 20 }: { count?: number }) => {
	return (
		<div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{Array.from({ length: count }).map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
				<LpCardSkeleton key={i} />
			))}
		</div>
	);
};

export default LpCardSkeleton;
