import { createContext, useState, type PropsWithChildren } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';
import { postSignIn } from '../apis/auth';
import type { RequestSignInDto } from '../types/auth';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSignInDto) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  setTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken)
  );

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, access);
    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refresh);
  };

  const login = async (data: RequestSignInDto) => {
    const response = await postSignIn(data);
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
  };

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;