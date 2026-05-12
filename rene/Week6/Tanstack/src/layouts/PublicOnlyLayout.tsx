import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 로그인하지 않은 사용자만 접근 가능한 레이아웃
const PublicOnlyLayout = () => {
  const { accessToken } = useAuth();

  if (accessToken) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicOnlyLayout;