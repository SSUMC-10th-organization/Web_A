import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 인증이 필요한 페이지(LPDetailPage)에서 사용되는 커스텀 훅
export const useRequireAuth = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      const proceed = window.confirm(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (proceed) {
        navigate("/login", { state: { from: location.pathname }, replace: true });
      } else {
        navigate(-1);
      }
    }
  }, []);

  return { isAuthenticated: !!accessToken };
};
