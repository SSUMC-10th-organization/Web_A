import { useMutation } from "@tanstack/react-query";
import { postSignout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

export const useLogout = () => {
  const { setAuthState } = useAuth();

  return useMutation({
    mutationFn: () => postSignout(),
    onSuccess: () => {
      setAuthState(null, null, null);
      alert("로그아웃에 성공했습니다!");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
