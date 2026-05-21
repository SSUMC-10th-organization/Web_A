import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
  color: #fff;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 200px;
  background-color: #000;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 95px 25px 25px 25px; 
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  box-sizing: border-box;
  z-index: 999; 
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 998; 
  background-color: rgba(0, 0, 0, 0.7);
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  margin-left: 0;
  @media (min-width: 769px) {
    margin-left: 200px;
  }
`;

export const MenuSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BottomSection = styled.div`
  margin-top: auto;
`;

export const MenuItem = styled.div`
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #ff007f;
  }
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ff007f;
  color: #fff;
  border: none;
  font-size: 30px;
  cursor: pointer;
  z-index: 1001;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  width: 420px;
  background: #25262b;
  border-radius: 24px;
  padding: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
`;

export const LPImageWrapper = styled.div`
  width: 220px;
  height: 220px;
  margin: 0 auto;
  background: #111;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const LPImage = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #333;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const Input = styled.input`
  height: 50px;
  border-radius: 10px;
  border: 1px solid #444;
  background: #1a1b1e;
  color: #fff;
  padding: 0 15px;
  outline: none;
  font-size: 1rem;
`;

export const TagRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const TagInput = styled(Input)`
  flex: 1;
`;

export const AddTagButton = styled.button`
  width: 80px;
  border: none;
  border-radius: 10px;
  background: #5a5d66;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #6e727d;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 35px;
`;

export const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ff007f;
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const DeleteTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

export const SubmitButton = styled.button`
  height: 55px;
  border: none;
  border-radius: 12px;
  background: #ff007f;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;

  &:hover {
    background: #e60072;
  }

  &:disabled {
    background: #5a5d66;
    color: #aaa;
    cursor: not-allowed;
  }
`;

export const ModalBtnGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

export const ModalConfirmButton = styled(SubmitButton)`
  flex: 1;
  height: 48px;
  background: #5a5d66;
  font-size: 1rem;

  &:hover {
    background: #6e727d;
  }
`;

export const ModalCancelButton = styled(SubmitButton)`
  flex: 1;
  height: 48px;
  font-size: 1rem;
`;