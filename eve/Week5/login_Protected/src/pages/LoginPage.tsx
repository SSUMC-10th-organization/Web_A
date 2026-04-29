import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
  const savedUser = localStorage.getItem('user_info');
  
  if (savedUser) {
    localStorage.setItem('isLoggedIn', 'true');
    alert("로그인에 성공하였습니다!");
    navigate('/home');
  } else {
    alert("가입된 정보가 없습니다.");
    navigate('/signup');
  }
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
        <p style={{marginTop: '20px', color: '#888', cursor: 'pointer'}} onClick={() => navigate('/signup')}>
          아직 회원이 아니신가요? <span style={{color: '#FF007F'}}>회원가입</span>
        </p>
      </LoginForm>
    </PageContainer>
  );
};

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

  .back-btn {
    cursor: pointer;
    font-size: 1.5rem;
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }
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

  &:focus {
    outline: none;
    border-color: #FF007F;
  }
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

export default LoginPage;