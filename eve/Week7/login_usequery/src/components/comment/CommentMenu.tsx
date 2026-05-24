import styled from 'styled-components';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

const CommentMenu = ({
  onEdit,
  onDelete,
}: Props) => {
  return (
    <MenuPopup>
      <MenuItemButton onClick={onEdit}>
        수정
      </MenuItemButton>

      <MenuItemButton onClick={onDelete}>
        삭제
      </MenuItemButton>
    </MenuPopup>
  );
};

export default CommentMenu;

const MenuPopup = styled.div`
  position: absolute;

  top: 30px;
  right: 0;

  background: #1a1b1e;

  border: 1px solid #333;

  border-radius: 10px;

  overflow: hidden;

  z-index: 100;
`;

const MenuItemButton = styled.button`
  width: 100%;

  background: none;

  border: none;

  color: white;

  padding: 12px 18px;

  cursor: pointer;

  &:hover {
    background: #333;
  }
`;
