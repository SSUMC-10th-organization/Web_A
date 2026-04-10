import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <LogoGroup onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <NavText Logo>Hoon Login Page</NavText>
      </LogoGroup>
      <ButtonGroup>
        <NavButton onClick={() => navigate('/login')}>로그인</NavButton>
        <NavButton Signup onClick={() => navigate('/signup')}>회원가입</NavButton>
      </ButtonGroup>
    </NavContainer>
  );
};

export default Navbar;

const NavContainer = styled.nav`
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 40px; background-color: #000; border-bottom: 1px solid #222;
  position: sticky; top: 0; z-index: 100;
`;

const LogoGroup = styled.div` display: flex; align-items: center; gap: 10px; `;

const ButtonGroup = styled.div` display: flex; align-items: center; gap: 15px; `;

const NavText = styled.span<{ Logo?: boolean }>`
  color: ${props => props.Logo ? '#ff2f6e' : '#fff'}; 
  font-size: ${props => props.Logo ? '1.2rem' : '14px'};
  font-weight: ${props => props.Logo ? '700' : '400'}; cursor: default;
`;

const NavButton = styled.button<{ Signup?: boolean }>`
  padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;
  background-color: ${props => props.Signup ? '#ff2f6e' : '#111'};
  color: #fff; border: ${props => props.Signup ? 'none' : '1px solid #333'};
  transition: all 0.2s;
  &:hover { background-color: ${props => props.Signup ? '#e0285d' : '#222'}; }
`;