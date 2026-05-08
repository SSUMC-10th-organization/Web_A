import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const nickname = params.get('nickname');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (nickname) localStorage.setItem('nickname', decodeURIComponent(nickname));
      
      window.location.replace('/home'); 
    } else {
      alert("로그인 처리에 실패했습니다.");
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-xl font-bold">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}