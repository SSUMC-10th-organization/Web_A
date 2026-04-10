import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  min-height: 80vh; background-color: #000; color: #fff; text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 3rem; margin-bottom: 20px;
  span { color: #FF007F; }
`;

const StartButton = styled.button`
  background-color: #FF007F; color: #fff; border: none; padding: 15px 40px;
  border-radius: 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer;
`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <HomeContainer>
      <MainTitle>돌려돌려 <span>LP판</span></MainTitle>
      <p style={{color: '#888', marginBottom: '30px'}}>당신만의 음악 세계를 공유하세요.</p>
      <StartButton onClick={() => navigate('/login')}>시작하기</StartButton>
    </HomeContainer>
  );
};

export default Home;