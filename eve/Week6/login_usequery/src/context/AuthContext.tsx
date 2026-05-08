import { createContext, useState, useContext, PropsWithChildren } from 'react';
import api from '../api/axios';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [nickname, setNickname] = useState(localStorage.getItem('nickname'));

  const login = async (values: any) => {
    const { data } = await api.post('/v1/auth/signin', values);
    const { accessToken: token, refreshToken, user } = data.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('nickname', user.name);

    setAccessToken(token);
    setNickname(user.name);
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setNickname(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ accessToken, nickname, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);