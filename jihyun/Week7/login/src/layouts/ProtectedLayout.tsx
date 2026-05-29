import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const savedAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (!accessToken && !savedAccessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;