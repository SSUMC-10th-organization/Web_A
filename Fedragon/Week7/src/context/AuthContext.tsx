import { createContext, useState, type PropsWithChildren } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';
import { postSignIn } from '../apis/auth';
import type { RequestSignInDto } from '../types/auth';

export interface AuthUser {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  profileImage?: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: RequestSignInDto) => Promise<void>;
  logout: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  user: null
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { getItem: getAccessToken, setItem: setAccessTokenStorage, removeItem: removeAccessToken } =
    useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { getItem: getRefreshToken, setItem: setRefreshTokenStorage, removeItem: removeRefreshToken } =
    useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    () => getAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => getRefreshToken()
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (data: RequestSignInDto) => {
    const response = await postSignIn(data);
    const { id, name, accessToken, refreshToken, ...rest } = response.data as any;

    setUser({ id, name, ...rest });
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAccessTokenStorage(accessToken);
    setRefreshTokenStorage(refreshToken);
  };

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    removeAccessToken();
    removeRefreshToken();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;