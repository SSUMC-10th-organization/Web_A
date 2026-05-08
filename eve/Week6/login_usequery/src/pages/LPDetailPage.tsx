import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { getLpDetail } from '../api/lp';

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid, 
    retry: 1,
  });

  const lp = data?.result || data;

  if (isLoading) return <Center>로딩 중...</Center>;
  if (isError || !lp) return <Center>데이터를 찾을 수 없습니다. (404)</Center>;

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate(-1)}>&lt; 뒤로가기</BackButton>
      <ContentCard>
        <ImageWrapper>
          <img src={lp.image_url || 'https://via.placeholder.com/600'} alt={lp.title} />
        </ImageWrapper>
        <InfoSection>
          <Title>{lp.title}</Title>
          <Meta>{lp.user_nickname} · {new Date(lp.created_at).toLocaleDateString()}</Meta>
          <Description>{lp.content || "등록된 내용이 없습니다."}</Description>
          <Actions>
            <LikeBtn>❤️ {lp.likes || 0}</LikeBtn>
            <SecondaryBtn>수정</SecondaryBtn>
            <SecondaryBtn>삭제</SecondaryBtn>
          </Actions>
        </InfoSection>
      </ContentCard>
    </DetailContainer>
  );
};

export default LpDetailPage;

const DetailContainer = styled.div` max-width: 800px; margin: 0 auto; padding: 20px; `;
const BackButton = styled.button` background: none; border: none; color: #FF007F; cursor: pointer; margin-bottom: 20px; font-size: 16px; `;
const ContentCard = styled.div` background: #111; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #222; `;
const ImageWrapper = styled.div` width: 100%; aspect-ratio: 1; img { width: 100%; height: 100%; object-fit: cover; } `;
const InfoSection = styled.div` padding: 30px; `;
const Title = styled.h2` font-size: 2rem; margin-bottom: 10px; color: #fff; `;
const Meta = styled.div` color: #888; margin-bottom: 20px; font-size: 14px; `;
const Description = styled.p` line-height: 1.6; color: #ccc; margin-bottom: 30px; white-space: pre-wrap; `;
const Actions = styled.div` display: flex; gap: 10px; `;
const LikeBtn = styled.button` background: #333; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; &:hover { background: #444; } `;
const SecondaryBtn = styled.button` background: none; color: #666; border: 1px solid #333; padding: 10px 20px; border-radius: 8px; cursor: pointer; &:hover { border-color: #FF007F; color: #FF007F; } `;
const Center = styled.div` text-align: center; margin-top: 100px; color: #888; `;