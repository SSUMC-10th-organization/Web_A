import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const GoogleCallbackPage = () => {
  const { googleLoginWithTokens } = useAuth();

  useEffect(() => {
    // URL(쿼리 파라미터)
    const urlParams = new URLSearchParams(window.location.search);
    // params에서 원하는 토큰 값 가져오기
    // console.log(window.location.search, urlParams); // 디버깅용: 실제 URL 쿼리 확인
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken && refreshToken) {
      googleLoginWithTokens(accessToken, refreshToken);
      // 로그인 성공 후 마이페이지로 이동 (페이지 새로고침)
      window.location.href = "/mypage";
    } else {
      // 토큰이 없으면 로그인 페이지로 이동
      window.location.href = "/login";
      //navigate("/login", { replace: true });
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      구글 로그인 처리 중입니다...
    </main>
  );
};

export default GoogleCallbackPage;
