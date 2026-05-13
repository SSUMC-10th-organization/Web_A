import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // [핵심] 로그인 성공 후 돌아올 주소를 로컬스토리지에 저장
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;