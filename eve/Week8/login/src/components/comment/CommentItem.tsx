import { useState } from 'react';
import styled from 'styled-components';
import CommentMenu from './CommentMenu';

interface Props {
  comment: any;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

const CommentItem = ({ comment, onUpdate, onDelete }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const nickname = 
    comment.user_nickname || 
    comment.nickname || 
    comment.userName || 
    comment.user?.name || 
    comment.author?.nickname || 
    '익명';

  const profile = comment.user_profile || comment.profileImage || comment.author?.profileImage;
  const content = comment.content || comment.text;

  const [editContent, setEditContent] = useState(content);
  const isMine = comment.isMyComment === true;

  return (
    <Item>
      <Avatar
        src={
          profile ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`
        }
      />

      <Body>
        <TopRow>
          <strong style={{ color: isMine ? '#ff007f' : 'white' }}>{nickname}</strong>

          {isMine && (
            <MenuWrapper>
              <MenuButton onClick={() => setOpenMenu(!openMenu)}>
                ⋮
              </MenuButton>

              {openMenu && (
                <CommentMenu
                  onEdit={() => {
                    setIsEditing(true);
                    setOpenMenu(false);
                  }}
                  onDelete={() => onDelete(comment.id)}
                />
              )}
            </MenuWrapper>
          )}
        </TopRow>

        {isEditing ? (
          <EditRow>
            <EditInput
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <SaveButton
              onClick={() => {
                onUpdate(comment.id, editContent);
                setIsEditing(false);
              }}
            >
              저장
            </SaveButton>
          </EditRow>
        ) : (
          <p>{content}</p>
        )}
      </Body>
    </Item>
  );
};

export default CommentItem;

const Item = styled.div`
  display: flex;
  gap: 15px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Body = styled.div`
  flex: 1;
  p {
    color: #ccc;
    margin-top: 8px;
    font-size: 1rem;
  }
  strong {
    font-size: 1.2rem;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.4rem;
`;

const EditRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const EditInput = styled.input`
  flex: 1;
  background: #1a1b1e;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  padding: 12px;
`;

const SaveButton = styled.button`
  background: #ff007f;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0 18px;
  cursor: pointer;
`;