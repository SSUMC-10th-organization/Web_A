import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GoogleLoginRedirectPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      setTimeout(() => {
        navigate('/my', { replace: true });
      }, 100);
      return;
    }

    navigate('/login', { replace: true });
  }, [navigate, setTokens]);

  return <div>구글 로그인 처리 중...</div>;
}