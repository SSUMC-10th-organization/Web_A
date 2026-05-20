import { useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { PAGINATION_ORDER } from "../types/common";
import LpCard from "../components/LpCard";
import { LpListSkeleton } from "../components/LpCardSkeleton";

const HomePage = () => {
	const [order, setOrder] = useState<PAGINATION_ORDER>(
		PAGINATION_ORDER.desc,
	);

	const {
		data,
		isPending,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetInfiniteLpList({ order });

	// 트리거가 보일 때 다음 페이지 로드
	const triggerRef = useIntersectionObserver<HTMLDivElement>({
		onIntersect: () => {
			if (hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		enabled: hasNextPage && !isFetchingNextPage,
	});

	// 모든 페이지의 LP 들을 하나의 배열로 펼침
	const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

	return (
		<div className="p-4">
			{/* 정렬 토글 */}
			<div className="mb-4 flex justify-end gap-2">
				<button
					type="button"
					onClick={() => setOrder(PAGINATION_ORDER.asc)}
					className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
						order === PAGINATION_ORDER.asc
							? "bg-pink-500 text-white"
							: "bg-gray-800 text-gray-300 hover:bg-gray-700"
					}`}
				>
					오래된순
				</button>
				<button
					type="button"
					onClick={() => setOrder(PAGINATION_ORDER.desc)}
					className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
						order === PAGINATION_ORDER.desc
							? "bg-pink-500 text-white"
							: "bg-gray-800 text-gray-300 hover:bg-gray-700"
					}`}
				>
					최신순
				</button>
			</div>

			{/* 에러 상태 */}
			{isError && (
				<div className="flex flex-col items-center justify-center gap-4 py-20">
					<p className="text-gray-400">목록을 불러오지 못했습니다.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition-colors"
					>
						다시 시도
					</button>
				</div>
			)}

			{/* 초기 로딩: 상단에 스켈레톤 */}
			{isPending && !isError && <LpListSkeleton count={12} />}

			{/* 데이터 그리드 */}
			{!isPending && !isError && (
				<>
					<div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{lps.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
					</div>

					{/* 추가 로딩: 하단에 스켈레톤 */}
					{isFetchingNextPage && (
						<div className="mt-1">
							<LpListSkeleton count={5} />
						</div>
					)}

					{/* 무한스크롤 트리거 (마지막 행 아래) */}
					{hasNextPage && (
						<div ref={triggerRef} className="h-10 w-full" />
					)}
				</>
			)}
		</div>
	);
};

export default HomePage;
