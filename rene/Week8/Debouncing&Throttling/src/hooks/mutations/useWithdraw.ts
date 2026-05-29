import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteMyAccount } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

// 회원 탈퇴 훅
export const useWithdraw = (onSuccess?: () => void) => {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteMyAccount(),
    onSuccess: () => {
      onSuccess?.();
      setAuthState(null, null, null);
      navigate("/login");
    },
    onError: (error) => {
      console.error("Withdraw failed:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });
};
