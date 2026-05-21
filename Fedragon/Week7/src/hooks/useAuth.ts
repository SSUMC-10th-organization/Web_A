import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: number; name: string } | null;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};