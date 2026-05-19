import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { UserInfo } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  setAuthState: (at: string | null, rt: string | null, user: UserInfo | null) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null,
  setAuthState: () => {},
  updateUserInfo: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const accessTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const refreshTokenStorage = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  const userStorage = useLocalStorage(LOCAL_STORAGE_KEY.user);

  const [accessToken, setAccessToken] = useState<string | null>(
    () => accessTokenStorage.getItem()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => refreshTokenStorage.getItem()
  );
  const [user, setUser] = useState<UserInfo | null>(() => {
    const raw = userStorage.getItem();
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  });

  // 로그인/로그아웃 시 토큰과 사용자 정보를 저장소와 상태에 동시에 업데이트하는 함수
  const setAuthState = (at: string | null, rt: string | null, newUser: UserInfo | null) => {
    if (at) accessTokenStorage.setItem(at); else accessTokenStorage.removeItem();
    if (rt) refreshTokenStorage.setItem(rt); else refreshTokenStorage.removeItem();
    if (newUser) userStorage.setItem(JSON.stringify(newUser)); else userStorage.removeItem();
    setAccessToken(at);
    setRefreshToken(rt);
    setUser(newUser);
  };

  // 사용자 정보 업데이트 함수 (마이페이지에서 정보 수정 시 사용)
  const updateUserInfo = (updates: Partial<UserInfo>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      userStorage.setItem(JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, setAuthState, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
