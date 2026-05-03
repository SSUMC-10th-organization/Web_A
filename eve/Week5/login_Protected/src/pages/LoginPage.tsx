import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();

  // 일반 로그인 핸들러
  const handleLogin = async () => {
    try {
      const response = await api.post('/v1/auth/signin', {
        email: "입력받은이메일",
        password: "입력받은비번",
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('isLoggedIn', 'true');

      alert("로그인에 성공하였습니다!");
      navigate('/home');
    } catch (error) {
      alert("로그인 정보가 올바르지 않습니다.");
    }
  };

  // 구글 로그인 핸들러 (서버 엔드포인트 수정 완료)
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <PageContainer>
      <LoginForm>
        <Header>
          <span className="back-btn" onClick={() => navigate('/')}>&lt;</span>
          <span className="title">로그인</span>
          <span style={{ width: '20px' }}></span>
        </Header>
        
        <DarkInput placeholder="아이디를 입력해주세요" />
        <DarkInput type="password" placeholder="비밀번호를 입력해주세요" />
        
        <ActionButton onClick={handleLogin}>로그인</ActionButton>

        {/* 구글 로그인 버튼 (로고 포함) */}
        <GoogleButton onClick={handleGoogleLogin}>
          <img 
            src="https://developers.google.com/static/identity/images/g-logo.png" 
            alt="google" 
            style={{ width: '18px', height: '18px', marginRight: '10px' }} 
          />
          구글로 로그인하기
        </GoogleButton>

        <p style={{marginTop: '20px', color: '#888', cursor: 'pointer'}} onClick={() => navigate('/signup')}>
          아직 회원이 아니신가요? <span style={{color: '#FF007F'}}>회원가입</span>
        </p>
      </LoginForm>
    </PageContainer>
  );
};

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #000;
  color: #fff;
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  .back-btn { cursor: pointer; font-size: 1.5rem; }
  .title { font-size: 1.2rem; font-weight: bold; }
`;

const DarkInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 15px;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #FF007F; }
`;

const ActionButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 10px;
  background-color: #FF007F;
  color: #fff;
  cursor: pointer;
`;

// 구글 버튼 스타일 (배경 흰색, 텍스트 검정)
const GoogleButton = styled.button`
  width: 100%;
  height: 50px;
  border: 1px solid #333;
  border-radius: 8px;
  font-weight: bold;
  background-color: #fff;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export default LoginPage;