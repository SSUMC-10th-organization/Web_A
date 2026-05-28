import { useMutation } from "@tanstack/react-query";
import {
	deleteUser,
	patchUser,
	type RequestUpdateUserDto,
} from "../../apis/user";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../lib/queryClient";
import type { ResponseMyInfoDto } from "../../types/auth";

// 내 정보 수정 - onMutate 로 닉네임을 즉시 반영
export function useUpdateUser() {
	return useMutation({
		mutationFn: (body: RequestUpdateUserDto) => patchUser(body),

		// 서버 응답 전에 캐시를 먼저 업데이트
		onMutate: async (newData) => {
			// 진행 중인 refetch 취소
			await queryClient.cancelQueries({
				queryKey: [QUERY_KEY.myInfo],
			});

			// 현재 캐시 값 스냅샷 (롤백용)
			const previousMyInfo =
				queryClient.getQueryData<ResponseMyInfoDto>([
					QUERY_KEY.myInfo,
				]);

			// 캐시를 낙관적으로 즉시 갱신
			queryClient.setQueryData<ResponseMyInfoDto>(
				[QUERY_KEY.myInfo],
				(old) => {
					if (!old) return old;
					return {
						...old,
						data: {
							...old.data,
							...(newData.name !== undefined && {
								name: newData.name,
							}),
							...(newData.bio !== undefined && { bio: newData.bio }),
							...(newData.avatar !== undefined && {
								avatar: newData.avatar,
							}),
						},
					};
				},
			);

			// context 에 스냅샷 저장 → onError 에서 롤백
			return { previousMyInfo };
		},

		// 서버 에러 시 이전 스냅샷 상태로 복원
		onError: (_err, _newData, context) => {
			if (context?.previousMyInfo) {
				queryClient.setQueryData(
					[QUERY_KEY.myInfo],
					context.previousMyInfo,
				);
			}
		},

		// 성공/실패 모두 서버 데이터로 최종 동기화
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
		},
	});
}

// 회원 탈퇴
export function useDeleteUser() {
	return useMutation({
		mutationFn: deleteUser,
	});
}
