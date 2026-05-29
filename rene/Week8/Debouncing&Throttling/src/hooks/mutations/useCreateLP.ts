import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLP } from "../../apis/lp";
import { type CreateLPRequest } from "../../types/lp";

export const useCreateLP = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    // API 요청을 보내는 함수
    mutationFn: (body: CreateLPRequest) => createLP(body),
    // 성공적으로 LP가 생성된 후 실행되는 콜백 함수
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] }); // 자동 refetch됨.
      onSuccess?.(); // 모달 닫기 콜백 실행 (선택적)
    },
  });
};
