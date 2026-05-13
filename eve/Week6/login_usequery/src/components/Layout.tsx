import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './navbar';

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <LayoutWrapper>
      <Navbar onMenuClick={toggleSidebar} /> 
      <Body>
        {isSidebarOpen && <Overlay onClick={toggleSidebar} />}
        <Sidebar $isOpen={isSidebarOpen}>
          <MenuSection>
            <MenuItem onClick={() => { navigate('/'); setIsSidebarOpen(false); }}>🔍 찾기</MenuItem>
            <MenuItem onClick={() => { navigate('/mypage'); setIsSidebarOpen(false); }}>👤 마이페이지</MenuItem>
          </MenuSection>
          <BottomSection>
            <MenuItem onClick={() => alert("탈퇴하시겠습니까?")}>탈퇴하기</MenuItem>
          </BottomSection>
        </Sidebar>
        <MainContent>
          <Outlet />
        </MainContent>
      </Body>
      <FloatingButton onClick={() => navigate('/add')}>+</FloatingButton>
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`display: flex; flex-direction: column; height: 100vh; background-color: #000; color: #fff;`;
const Body = styled.div`display: flex; flex: 1; position: relative; overflow: hidden;`;
const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 200px; background-color: #000; border-right: 1px solid #222;
  display: flex; flex-direction: column; justify-content: space-between; padding: 25px;
  transition: transform 0.3s ease; z-index: 1000;
  @media (max-width: 768px) {
    position: absolute; height: 100%; transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;
const Overlay = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7); z-index: 999;
`;
const MainContent = styled.main`flex: 1; overflow-y: auto; padding: 20px;`;
const MenuSection = styled.div`display: flex; flex-direction: column; gap: 20px;`;
const BottomSection = styled.div`margin-top: auto;`;
const MenuItem = styled.div`color: #fff; cursor: pointer; &:hover { color: #FF007F; }`;
const FloatingButton = styled.button`
  position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
  border-radius: 50%; background-color: #FF007F; color: #fff; border: none;
  font-size: 30px; cursor: pointer; z-index: 1001;
`;