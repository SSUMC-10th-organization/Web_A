import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useForm from '../hooks/useForm';
import { validateLogin } from '../utils/validate';
import GoogleLogo from '../assets/GoogleLogo';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const { values, errors, touched, handleChange, handleBlur, isValid } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log('로그인 데이터 전송:', values);
      alert('로그인 성공! (콘솔 확인)');
    }
  };

  return (
    <MainSection>
      <LoginContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
          <Title>로그인</Title>
        </Header>

        <SocialButton type="button">
          <GoogleLogo />
          구글 로그인
        </SocialButton>

        <Divider>
          <hr /> <span>OR</span> <hr />
        </Divider>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder="이메일을 입력해주세요!"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              $hasError={touched.email && !!errors.email}
            />
            {touched.email && errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              $hasError={touched.password && !!errors.password}
            />
            {touched.password && errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputGroup>

          <LoginButton type="submit" disabled={!isValid}>
            로그인
          </LoginButton>
        </Form>
      </LoginContainer>
    </MainSection>
  );
};

export default LoginPage;


const MainSection = styled.main`
  display: flex; justify-content: center; align-items: center; flex: 1; padding: 20px;
  background-color: #000; min-height: calc(100vh - 64px); /* Navbar 높이만큼 제외 */
`;

const LoginContainer = styled.div`
  width: 100%; max-width: 380px; padding: 20px; color: #fff;
`;

const Header = styled.div`
  display: flex; align-items: center; position: relative; margin-bottom: 40px;
`;

const BackButton = styled.button`
  background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;
  position: absolute; left: 0; padding: 0;
`;

const Title = styled.h2`
  flex: 1; font-size: 1.1rem; margin: 0; font-weight: 600; text-align: center;
`;

const SocialButton = styled.button`
  width: 100%; padding: 14px; background: none; border: 1px solid #444;
  border-radius: 8px; color: #fff; cursor: pointer; margin-bottom: 25px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  font-weight: 600; font-size: 14px; transition: background 0.2s;
  &:hover { background-color: #111; }
`;

const Divider = styled.div`
  display: flex; align-items: center; margin-bottom: 25px; color: #666; font-size: 12px;
  hr { flex: 1; border: none; border-top: 1px solid #333; }
  span { margin: 0 15px; font-weight: 500; }
`;

const Form = styled.form` display: flex; flex-direction: column; gap: 8px; `;

const InputGroup = styled.div` display: flex; flex-direction: column; min-height: 85px; `;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%; padding: 16px; border-radius: 8px; border: 1px solid ${props => props.$hasError ? '#ff4d4f' : '#222'};
  background-color: #1a1a1a; color: #fff; font-size: 14px; box-sizing: border-box; outline: none;
  &:focus { border-color: ${props => props.$hasError ? '#ff4d4f' : '#ff2f6e'}; }
  &::placeholder { color: #555; }
`;

const ErrorText = styled.p` color: #ff4d4f; font-size: 12px; margin: 5px 0 0 4px; `;

const LoginButton = styled.button`
  width: 100%; padding: 16px; border-radius: 8px; border: none;
  background-color: ${props => props.disabled ? '#333' : '#ff2f6e'};
  color: ${props => props.disabled ? '#777' : '#fff'};
  font-weight: bold; font-size: 15px; cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 10px; transition: all 0.3s;
`;