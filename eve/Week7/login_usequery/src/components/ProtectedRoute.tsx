import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!isAuthenticated || !token) {

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      localStorage.setItem('redirectAfterLogin', location.pathname);
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, token, navigate, location.pathname]);

  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;