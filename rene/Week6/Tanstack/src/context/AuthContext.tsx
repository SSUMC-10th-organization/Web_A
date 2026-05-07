import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSigninDto } from "../types/auth";
import { postSignin, postSignout } from "../apis/auth";

// Context 타입 정의
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
}); // 초기화

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const refreshTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  
  // localStorage를 읽는 작업은 초기 상태 설정 시에만 수행하도록 useState 지연 초기화 사용
  const [accessToken, setAccessToken] = useState<string | null>(
    () => accessTokenStorage.getItem()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => refreshTokenStorage.getItem()
  );

  // 로그인 함수: API 호출 후 토큰 저장 및 상태 업데이트
  const login = async (signInData: RequestSigninDto) => {
    try {
      // 비동기이니 try-catch로 에러 핸들링
      const {data} = await postSignin(signInData);
        
      if (data){
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        accessTokenStorage.setItem(newAccessToken);
        refreshTokenStorage.setItem(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        alert("로그인에 성공했습니다!");
        window.location.href = "/mypage"; // 로그인 성공 후 마이페이지로 이동 (페이지 새로고침)
      }
    } catch (error) {
      // 나중에 toast 알림을 줘도 됨.
      console.error("Login failed:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로그아웃 함수: 토큰 제거 및 상태 초기화
  const logout = async () => {
    try {
      await postSignout();
      accessTokenStorage.removeItem();
      refreshTokenStorage.removeItem();
      setAccessToken(null);
      setRefreshToken(null);
      alert("로그아웃에 성공했습니다!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // Context Provider로 자식 컴포넌트 감싸기
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);