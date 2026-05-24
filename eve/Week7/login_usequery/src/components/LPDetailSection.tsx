import styled from 'styled-components';
import { useState } from 'react';

interface LPDetailSectionProps {
  lp: any;
  onOpenComments: (e: React.MouseEvent) => void;
}

const LPDetailSection = ({ lp, onOpenComments }: LPDetailSectionProps) => {
  const [likeCount, setLikeCount] = useState(lp?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const lpImage = lp?.image_url || lp?.coverImage || `https://picsum.photos/seed/${lp?.id}/400/400`;

  return (
    <ContentCard>
      <Header>
        <UserInfo>
          <DefaultAvatar viewBox="0 0 24 24">
            <path fill="#888" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </DefaultAvatar>
          <UserName>사석훈</UserName>
        </UserInfo>
        <DateText>방금 전</DateText>
      </Header>

      <TitleSection>
        <MainTitle>{lp?.title}</MainTitle>
        <IconGroup><span>✏️</span><span>🗑️</span></IconGroup>
      </TitleSection>

      <ImageArea>
        <OuterBox>
          <LPCircle 
            src={lpImage} 
            onError={(e: any) => { e.target.src = "https://via.placeholder.com/250?text=LP+Cover"; }}
          />
        </OuterBox>
      </ImageArea>

      <Description>{lp?.content}</Description>
      
      <TagGroup>
        <Tag># 사석훈</Tag>
        <Tag># LP판</Tag>
      </TagGroup>

      <FooterRow>
        <LikeBtn 
          type="button" 
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsLiked(!isLiked); 
            setLikeCount((p: number) => isLiked ? p - 1 : p + 1); 
          }}
        >
          {isLiked ? '❤️' : '🤍'} {likeCount}
        </LikeBtn>
  
        <OpenCommentBtn 
          type="button" 
          onClick={(e) => {
            e.stopPropagation(); 
            onOpenComments(e);
          }}
        >
          💬 댓글 보기
        </OpenCommentBtn>
      </FooterRow>
    </ContentCard>
  );
};

export default LPDetailSection;

const ContentCard = styled.div` background: #25262b; border-radius: 20px; padding: 30px; margin-bottom: 20px; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; `;
const UserInfo = styled.div` display: flex; align-items: center; gap: 10px; `;
const DefaultAvatar = styled.svg` width: 40px; height: 40px; background: #343a40; border-radius: 50%; padding: 4px; box-sizing: border-box; `;
const UserName = styled.span` color: #fff; font-weight: bold; `;
const DateText = styled.span` color: #888; font-size: 0.8rem; `;
const TitleSection = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; `;
const MainTitle = styled.h2` color: #fff; font-size: 1.5rem; margin: 0; `;
const IconGroup = styled.div` display: flex; gap: 15px; cursor: pointer; `;
const ImageArea = styled.div` display: flex; justify-content: center; padding: 20px 0; `;
const OuterBox = styled.div` width: 300px; height: 300px; background: #1a1b1e; border-radius: 24px; display: flex; justify-content: center; align-items: center; `;
const LPCircle = styled.img` width: 240px; height: 240px; border-radius: 50%; object-fit: cover; border: 4px solid #333; `;
const Description = styled.p` color: #ccc; text-align: center; line-height: 1.6; margin: 20px 0; `;
const TagGroup = styled.div` display: flex; justify-content: center; gap: 8px; margin-bottom: 20px; `;
const Tag = styled.span` background: #343a40; color: #fff; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem; `;
const FooterRow = styled.div` display: flex; justify-content: space-around; border-top: 1px solid #333; padding-top: 20px; `;
const LikeBtn = styled.button` background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; `;
const OpenCommentBtn = styled.button` background: #3b3d44; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; &:hover { background: #4a4d55; } `;