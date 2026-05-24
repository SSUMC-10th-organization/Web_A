import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: () => loginUser({ email: email.trim(), password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      window.dispatchEvent(new Event('storage'));
      
      alert("로그인에 성공하였습니다!");
      navigate('/home'); 
    },
    onError: () => {
      alert("로그인 정보가 올바르지 않습니다.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    loginMutation.mutate();
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <PageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Header>
          <span className="back-btn" onClick={() => navigate('/')}>&lt;</span>
          <span className="title">로그인</span>
          <span style={{ width: '20px' }}></span>
        </Header>
        
        <DarkInput 
          type="email"
          placeholder="아이디를 입력해주세요" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <DarkInput 
          type="password" 
          placeholder="비밀번호를 입력해주세요" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <ActionButton type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </ActionButton>

        <GoogleButton type="button" onClick={handleGoogleLogin}>
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


const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #000;
  color: #fff;
`;

const LoginForm = styled.form`
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
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

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