import { useMutation } from "@tanstack/react-query";
import {
	deleteLike,
	deleteLp,
	patchLp,
	postLike,
	postLp,
} from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../lib/queryClient";
import type { RequestCreateLpDto, RequestUpdateLpDto } from "../../types/lp";
import type { ResponseLpDetailDto } from "../../types/lp";

// LP 생성
export function useCreateLp() {
	return useMutation({
		mutationFn: (body: RequestCreateLpDto) => postLp(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
		},
	});
}

// LP 수정
export function useUpdateLp(lpId: number) {
	return useMutation({
		mutationFn: (body: RequestUpdateLpDto) => patchLp(lpId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
		},
	});
}

// LP 삭제
export function useDeleteLp() {
	return useMutation({
		mutationFn: (lpId: number) => deleteLp(lpId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
		},
	});
}

// 좋아요 토글 - Optimistic Update 적용
export function useLikeLp(lpId: number, myUserId?: number) {
	// 현재 캐시에서 likes 배열을 낙관적으로 수정
	const optimisticUpdate = (isAdding: boolean) => async () => {
		await queryClient.cancelQueries({
			queryKey: [QUERY_KEY.lp, lpId],
		});

		const previous = queryClient.getQueryData<ResponseLpDetailDto>([
			QUERY_KEY.lp,
			lpId,
		]);

		queryClient.setQueryData<ResponseLpDetailDto>(
			[QUERY_KEY.lp, lpId],
			(old) => {
				if (!old) return old;
				const likes = isAdding
					? [
							...old.data.likes,
							{ id: -1, userId: myUserId ?? -1, lpId },
						]
					: old.data.likes.filter((l) => l.userId !== myUserId);

				return { ...old, data: { ...old.data, likes } };
			},
		);

		return { previous };
	};

	const rollback = (
		context: { previous: ResponseLpDetailDto | undefined } | undefined,
	) => {
		if (context?.previous) {
			queryClient.setQueryData([QUERY_KEY.lp, lpId], context.previous);
		}
	};

	const settle = () => {
		queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
	};

	return {
		like: useMutation({
			mutationFn: () => postLike(lpId),
			onMutate: optimisticUpdate(true),
			onError: (_err, _v, context) => rollback(context),
			onSettled: settle,
		}),
		unlike: useMutation({
			mutationFn: () => deleteLike(lpId),
			onMutate: optimisticUpdate(false),
			onError: (_err, _v, context) => rollback(context),
			onSettled: settle,
		}),
	};
}
