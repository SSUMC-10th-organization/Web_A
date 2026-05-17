import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../api/auth';
import BurgerIcon from '../assets/BurgerIcon';

interface NavbarProps { 
  onMenuClick: () => void; 
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isLogin = localStorage.getItem('isLoggedIn') === 'true';
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');

  /* ==================================================================== */
  /* [명세 반영] 로그아웃 useMutation 구현 및 캐시 폭파 후 홈(/) 이동 처리 */
  /* ==================================================================== */
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // TanStack Query 저장소 인메모리 캐시 전체 삭제
      queryClient.clear();

      // 헤더 상태 변경 전파 트리거 발송
      window.dispatchEvent(new Event('storage'));

      alert("로그아웃 되었습니다.");
      navigate('/'); // 기존 명세 리다이렉션 경로 유지
    },
    onError: (error) => {
      console.error('로그아웃 에러:', error);
      // 서버 에러가 나더라도 클라이언트 세션은 강제 파괴하여 방어벽 구축
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_info');
      
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  });

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
            {/* 사진 명세 스펙 일치화: nickname이 없으면 name을 대체로 매핑 */}
            <WelcomeText>{userInfo.nickname || userInfo.name || '사용자'}님 반갑습니다.</WelcomeText>
            
            {/* mutationPending 상태일 때 중복 클릭 차단 제어 추가 */}
            <NavText onClick={() => !logoutMutation.isPending && logoutMutation.mutate()}>
              {logoutMutation.isPending ? '처리중' : '로그아웃'}
            </NavText>
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

// --- 기존 커스텀 스타일 컴포넌트 구조 변형 없이 100% 동일 보존 ---

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