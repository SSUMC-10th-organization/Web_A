import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike, deleteLike } from "../../apis/like";
import { useAuth } from "../../context/AuthContext";
import type { ResponseLPDetailDto } from "../../types/lp";

interface ToggleLikeContext {
  previousData: ResponseLPDetailDto | undefined;
}

export const useToggleLike = (lpId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<void, Error, { isLiked: boolean }, ToggleLikeContext>({
    mutationFn: ({ isLiked }) => (isLiked ? deleteLike(lpId) : postLike(lpId)),
    onMutate: async ({ isLiked }) => {
      // 1. 진행 중인 refetch 취소 (레이스 컨디션 방지)
      await queryClient.cancelQueries({ queryKey: ["lp", lpId] });

      // 2. 롤백용 스냅샷 저장
      const previousData = queryClient.getQueryData<ResponseLPDetailDto>(
        ["lp", lpId]
      );

      // 3. 낙관적 업데이트 - 좋아요 토글
      queryClient.setQueryData<ResponseLPDetailDto>(["lp", lpId], (old) => {
        if (!old || !user) return old;
        const newLikes = isLiked
          ? old.data.likes.filter((l) => l.userId !== user.id)
          : [...old.data.likes, { id: Date.now(), userId: user.id, lpId }];
        return { ...old, data: { ...old.data, likes: newLikes } };
      });

      // 4. 롤백 컨텍스트 반환
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // 서버 오류 시 캐시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(["lp", lpId], context.previousData);
      }
    },
    onSettled: () => {
      // 성공/실패 무관하게 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });
};
