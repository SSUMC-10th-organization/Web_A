import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    alert("로그인이 필요한 페이지입니다. 🔒");
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;