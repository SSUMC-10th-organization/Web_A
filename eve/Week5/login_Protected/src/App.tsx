import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

const PremiumPage = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '80vh', 
    backgroundColor: '#000', 
    color: '#fff',         
    textAlign: 'center' 
  }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
      <span style={{ color: '#FF007F' }}>💎 프리미엄 결제 유저 전용</span>
    </h1>
    <p style={{ color: '#888', fontSize: '1.2rem' }}>
      당신만을 위한 특별한 웹툰 콘텐츠를 감상하세요.
    </p>
  </div>
);

// ⭐ 1. 이 컴포넌트를 App 함수 바깥에 추가해!
const GoogleAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 주소창(URL)에서 토큰이 있는지 확인하는 로직
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      // 토큰 발견하면 로컬스토리지에 저장!
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('isLoggedIn', 'true');

      // 주소창 깨끗하게 치우고 홈으로 이동
      window.history.replaceState({}, document.title, "/");
      alert("구글 소셜 로그인 성공!");
      navigate('/home');
    }
  }, [navigate]);

  return null; // 화면에 아무것도 안 그림
};

function App() {
  return (
    <Router>
      {/* ⭐ 2. Router 안에 이 핸들러를 넣어줘야 작동함 */}
      <GoogleAuthHandler />
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Home />} />

        {/* ⭐ 3. 서버가 보내주는 리다이렉트 주소와 라우터를 맞춰줌 */}
        <Route path="/v1/auth/google/callback" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/premium/webtoon/1" element={<PremiumPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;