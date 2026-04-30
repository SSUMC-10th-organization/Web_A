import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/premium/webtoon/1" element={<PremiumPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;