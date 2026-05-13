import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LPDetailPage from './pages/LPDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

// ⭐ 구글 로그인 완료 후 처리를 담당하는 핸들러
const GoogleAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const nickname = params.get('name');

    if (accessToken && refreshToken) {
      // 1. 유저 정보 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user_info', JSON.stringify({ nickname }));

      alert(`${nickname || '사용자'}님, 환영합니다!`);

      // 2. [핵심] ProtectedRoute에서 저장해둔 복귀 주소가 있는지 확인
      const destination = localStorage.getItem('redirectAfterLogin') || '/home';
      
      // 3. 목적지로 이동 후 저장된 임시 주소는 삭제 (청소)
      localStorage.removeItem('redirectAfterLogin');
      
      navigate(destination, { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
      로그인 처리 중입니다...
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 구글 로그인 콜백 경로 */}
        <Route path="/v1/auth/google/callback" element={<GoogleAuthHandler />} />

        {/* 메인 레이아웃 적용 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          
          {/* 로그인 보호가 필요한 경로들 */}
          <Route path="/lp/:id" element={
            <ProtectedRoute>
              <LPDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/mypage" element={
            <ProtectedRoute>
              <div style={{color: 'white'}}>마이페이지 준비 중</div>
            </ProtectedRoute>
          } />
        </Route>

        {/* 독립 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;