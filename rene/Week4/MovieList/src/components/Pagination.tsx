interface Props {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
	// 현재 페이지 기준 앞뒤 2페이지씩 표시
	const delta = 2;
	const start = Math.max(1, page - delta);
	const end = Math.min(totalPages, page + delta);
	const pageNumbers = Array.from(
		{ length: end - start + 1 },
		(_, i) => start + i,
	);

	return (
		<div className="flex items-center justify-center gap-1 py-8">
			{/* 이전 버튼 */}
			<button
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
				className="px-3 py-2 rounded-md text-sm font-medium text-white disabled:opacity-30 
        cursor-pointer disabled:cursor-not-allowed hover:bg-white/15 transition-colors"
			>
				‹ 이전
			</button>

			{/* 1 페이지 */}
			{start > 1 && (
				<>
					<button
						onClick={() => onPageChange(1)}
						className="px-3 py-2 rounded-md text-sm text-white hover:bg-white/15 transition-colors cursor-pointer"
					>
						1
					</button>
					{start > 2 && <span className="px-2 text-gray-500">…</span>}
				</>
			)}

			{/* 페이지 번호 */}
			{pageNumbers.map((num) => (
				<button
					key={num}
					onClick={() => onPageChange(num)}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
						num === page
							? "bg-white text-black"
							: "text-white hover:bg-white/15"
					}`}
				>
					{num}
				</button>
			))}

			{/* 마지막 페이지 */}
			{end < totalPages && (
				<>
					{end < totalPages - 1 && (
						<span className="px-2 text-gray-500">…</span>
					)}
					<button
						onClick={() => onPageChange(totalPages)}
						className="px-3 py-2 rounded-md text-sm text-white hover:bg-white/15 cursor-pointer transition-colors"
					>
						{totalPages}
					</button>
				</>
			)}

			{/* 다음 버튼 */}
			<button
				onClick={() => onPageChange(page + 1)}
				disabled={page === totalPages}
				className="px-3 py-2 rounded-md text-sm font-medium text-white disabled:opacity-30 
        cursor-pointer disabled:cursor-not-allowed hover:bg-white/15 transition-colors"
			>
				다음 ›
			</button>
		</div>
	);
};

export default Pagination;
