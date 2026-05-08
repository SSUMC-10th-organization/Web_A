import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { accessToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
    }
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}