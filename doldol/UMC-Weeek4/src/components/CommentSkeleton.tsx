const CommentSkeleton = () => {
	return (
		<div className="flex animate-pulse items-start gap-3 py-3">
			<div className="h-8 w-8 rounded-full bg-gray-700" />
			<div className="flex-1 space-y-2">
				<div className="h-3 w-1/4 rounded bg-gray-700" />
				<div className="h-3 w-3/4 rounded bg-gray-700" />
			</div>
		</div>
	);
};

export const CommentListSkeleton = ({ count = 5 }: { count?: number }) => {
	return (
		<div>
			{Array.from({ length: count }).map((_, i) => (
				<CommentSkeleton key={i} />
			))}
		</div>
	);
};

export default CommentSkeleton;
