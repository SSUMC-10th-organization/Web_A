import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useThrottle from "../hooks/useThrottle";
import { PAGINATION_ORDER } from "../types/common";
import LpCard from "../components/LpCard";
import { LpListSkeleton } from "../components/LpCardSkeleton";

const HomePage = () => {
	const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

	const {
		data,
		isPending,
		isError,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetInfiniteLpList({ order });

	const [scrollTrigger, setScrollTrigger] = useState(0);
	const throttledTrigger = useThrottle(scrollTrigger, 3000);

	useEffect(() => {
		// isFetchingNextPage 체크를 여기서만 → Observer 가 fetch 상태에 따라
		// disconnect/reconnect 하지 않으므로 스로틀이 정상 동작
		if (throttledTrigger > 0 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [throttledTrigger, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const triggerRef = useIntersectionObserver<HTMLDivElement>({
		onIntersect: () => {
			setScrollTrigger((prev) => prev + 1);
		},
		// !isFetchingNextPage 를 enabled 에서 제거
		// 이전엔 fetch 완료마다 Observer 가 재구독되어 즉시 재발동했음
		// 이제 hasNextPage 가 없어질 때만 disconnect → 스로틀 정상 동작
		enabled: !!hasNextPage,
	});

	const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

	return (
		<div className="p-4">
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

			{isPending && !isError && <LpListSkeleton count={12} />}

			{!isPending && !isError && (
				<>
					<div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{lps.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
					</div>

					{isFetchingNextPage && (
						<div className="mt-1">
							<LpListSkeleton count={5} />
						</div>
					)}

					{hasNextPage && (
						<div ref={triggerRef} className="h-10 w-full" />
					)}
				</>
			)}
		</div>
	);
};

export default HomePage;
