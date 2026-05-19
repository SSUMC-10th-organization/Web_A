import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestSigninDto, UserInfo } from "../../types/auth";

export const useLogin = () => {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (data: RequestSigninDto) => postSignin(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken, id, name } = res.data;
      const user: UserInfo = { id, name, avatar: null };
      setAuthState(accessToken, refreshToken, user);
      alert("로그인에 성공했습니다!");
      const from = (location.state as { from?: string })?.from ?? "/";
      navigate(from, { replace: true });
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });
};
