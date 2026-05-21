import { useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';

export default function GoogleLoginRedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);

      window.location.replace('/my');
      return;
    }

    window.location.replace('/login');
  }, []);

  return <div>구글 로그인 처리 중...</div>;
}