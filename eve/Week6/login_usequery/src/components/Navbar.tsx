import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BurgerIcon from '../assets/BurgerIcon';

interface NavbarProps { onMenuClick: () => void; }

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const isLogin = localStorage.getItem('isLoggedIn') === 'true';
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    alert("로그아웃 되었습니다.");
    navigate('/');
  };

  return (
    <NavContainer>
      <LogoGroup>
        <IconButton onClick={onMenuClick}><BurgerIcon /></IconButton>
        <LogoText onClick={() => navigate('/')}>돌려돌려LP판</LogoText>
      </LogoGroup>
      
      <ButtonGroup>
        <SearchIcon>🔍</SearchIcon>
        {isLogin ? (
          <>
            <WelcomeText>{userInfo.nickname || '사용자'}님 반갑습니다.</WelcomeText>
            <NavText onClick={handleLogout}>로그아웃</NavText>
          </>
        ) : (
          <>
            <NavText onClick={() => navigate('/login')}>로그인</NavText>
            <SignupButton onClick={() => navigate('/signup')}>회원가입</SignupButton>
          </>
        )}
      </ButtonGroup>
    </NavContainer>
  );
};

export default Navbar;

const NavContainer = styled.nav`
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 20px; height: 70px; background-color: #000; border-bottom: 1px solid #222;
`;
const LogoGroup = styled.div`display: flex; align-items: center; gap: 10px;`;
const IconButton = styled.button`background: none; border: none; color: #fff; cursor: pointer;`;
const LogoText = styled.h1`color: #FF007F; font-size: 1.6rem; font-weight: bold; cursor: pointer;`;
const ButtonGroup = styled.div`display: flex; align-items: center; gap: 15px;`;
const WelcomeText = styled.span`color: #fff; font-size: 0.95rem;`;
const NavText = styled.span`color: #fff; cursor: pointer; font-size: 0.95rem;`;
const SearchIcon = styled.span`color: #fff; font-size: 1.2rem; cursor: pointer;`;
const SignupButton = styled.button`
  background-color: #FF007F; color: #fff; border: none; padding: 10px 20px;
  border-radius: 8px; font-weight: bold; cursor: pointer;
`;