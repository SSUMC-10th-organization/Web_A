import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestUpdateProfileDto, ResponseMyInfoDto, UserInfo } from "../../types/auth";

interface UseUpdateProfileOptions {
  onSuccess?: (data: ResponseMyInfoDto["data"]) => void;
  onOptimistic?: (body: RequestUpdateProfileDto) => void;
  onRollback?: () => void;
};

export const useUpdateProfile = ({
  onSuccess,
  onOptimistic,
  onRollback,
}: UseUpdateProfileOptions = {}) => {
  const { updateUserInfo, user } = useAuth();

  return useMutation<
    ResponseMyInfoDto,
    Error,
    RequestUpdateProfileDto,
    { previousUser: UserInfo | null }
  >({
    mutationFn: (body) => patchMyInfo(body),
    onMutate: async (body) => {
      // 1. cancelQueries 없음
      // AuthContext의 updateUserInfo — 일반 React useState를 업데이트하는 것
      // TanStack Query 캐시와 무관

      // 2. 롤백용 스냅샷 저장
      const previousUser = user ? { ...user } : null;

      // 3. NavBar 즉시 업데이트
      const partialUpdate: Partial<UserInfo> = {};
      if (body.name !== undefined) partialUpdate.name = body.name;
      if (body.avatar !== undefined) partialUpdate.avatar = body.avatar;
      if (Object.keys(partialUpdate).length > 0) updateUserInfo(partialUpdate);

      // 3. MyPage 로컬 상태 즉시 업데이트
      onOptimistic?.(body);

      // 4. 롤백 컨텍스트 반환
      return { previousUser };
    },
    onError: (_err, _body, context) => {
      // 서버 오류 시 NavBar 롤백
      if (context?.previousUser) updateUserInfo(context.previousUser);
      // MyPage 로컬 상태 롤백
      onRollback?.();
    },
    onSuccess: (res) => {
      // 서버 응답으로 최종 확정
      updateUserInfo({ name: res.data.name, avatar: res.data.avatar });
      onSuccess?.(res.data);
    },
  });
};
