import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LPDetailPage from './pages/LPDetailPage';
import LPSearchPage from './pages/LPSearchPage'; // 🚨 [추가] 검색 페이지 임포트
import ProtectedRoute from './components/ProtectedRoute';

const GoogleAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const nickname = params.get('name');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user_info', JSON.stringify({ nickname }));

      alert(`${nickname || '사용자'}님, 환영합니다!`);

      const destination = localStorage.getItem('redirectAfterLogin') || '/home';

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
        <Route path="/v1/auth/google/callback" element={<GoogleAuthHandler />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* 🚨 [추가] 검색 페이지 라우트 등록 */}
          <Route path="/search" element={
            <ProtectedRoute>
              <LPSearchPage />
            </ProtectedRoute>
          } />

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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;