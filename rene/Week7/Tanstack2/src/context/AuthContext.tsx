import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSigninDto } from "../types/auth";
import { postSignin, postSignout } from "../apis/auth";

// Context 타입 정의
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  login: async () => {},
  logout: async () => {},
}); // 초기화

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const refreshTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  const userNameStorage = useLocalStorage(LOCAL_STORAGE_KEY.userName);

  // localStorage를 읽는 작업은 초기 상태 설정 시에만 수행하도록 useState 지연 초기화 사용
  const [accessToken, setAccessToken] = useState<string | null>(
    () => accessTokenStorage.getItem()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => refreshTokenStorage.getItem()
  );
  const [userName, setUserName] = useState<string | null>(
    () => userNameStorage.getItem()
  );

  // 로그인 함수: API 호출 후 토큰 저장 및 상태 업데이트
  const login = async (signInData: RequestSigninDto) => {
    const { data } = await postSignin(signInData);
    if (!data) throw new Error("로그인에 실패했습니다.");

    accessTokenStorage.setItem(data.accessToken);
    refreshTokenStorage.setItem(data.refreshToken);
    userNameStorage.setItem(data.name);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUserName(data.name);
  };

  // 로그아웃 함수: 토큰 제거 및 상태 초기화
  const logout = async () => {
    try {
      await postSignout();
      accessTokenStorage.removeItem();
      refreshTokenStorage.removeItem();
      userNameStorage.removeItem();
      setAccessToken(null);
      setRefreshToken(null);
      setUserName(null);
      alert("로그아웃에 성공했습니다!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // Context Provider로 자식 컴포넌트 감싸기
  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);