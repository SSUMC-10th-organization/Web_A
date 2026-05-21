import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLPs } from '../api/lp';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const { ref, inView } = useInView({ threshold: 0.1 }); 

  const isThrottled = useRef(false);
  const triggerThrottleLog = () => {
    if (!isThrottled.current) {
      console.warn("⏳ [Throttle 통과] 스크롤 이벤트 발생! 1초 간격으로 연산을 제어합니다.");
      isThrottled.current = true;
      setTimeout(() => {
        isThrottled.current = false;
      }, 1000); 
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading, 
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) => fetchLPs({ pageParam, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => {
      const items = Array.isArray(lastPage) ? lastPage : (lastPage?.data || lastPage?.result || []);
      if (items.length === 0 || items.length < 10) return undefined;
      return items[items.length - 1].id; 
    },
  });

  useEffect(() => {
    if (inView) {
      triggerThrottleLog(); 
      
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allLps = data?.pages.flatMap((page: any) => {
    if (Array.isArray(page)) return page;
    if (Array.isArray(page?.data)) return page.data;
    if (Array.isArray(page?.result)) return page.result;
    return [];
  }) || [];

  if (isError) return <Status>❌ 데이터를 불러올 수 없습니다.</Status>;

  const showInitialSkeleton = isLoading && allLps.length === 0;

  return (
    <Container>
      <SortArea>
        <SortBtn $active={sort === 'oldest'} onClick={() => setSort('oldest')}>오래된순</SortBtn>
        <SortBtn $active={sort === 'latest'} onClick={() => setSort('latest')}>최신순</SortBtn>
      </SortArea>

      <Grid>
        {showInitialSkeleton ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={`init-skel-${i}`} />)
        ) : (
          <>
            {allLps.map((lp: any) => {
              const displayTitle = lp.title || lp.titleName || lp.name || '제목 없음';
              const realImage = lp.thumbnail || lp.imageUrl || lp.image_url || lp.coverImage || lp.cover_image;
              const isBrokenDummy = realImage && (realImage.includes('loremflickr.com') || realImage.includes('placeimg.com'));
              
              const correctedSrc = isBrokenDummy || !realImage
                ? `https://picsum.photos/seed/${lp.id || 'default'}/400/400` 
                : realImage;

              return (
                <Card key={lp.id} onClick={() => navigate(`/lp/${lp.id}`)}>
                  <LPImage 
                    src={correctedSrc} 
                    alt={displayTitle} 
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/default_lp.png";
                    }}
                  />
                  <Overlay className="overlay">
                    <MetaInfo className="meta-info">
                      <Title>{displayTitle}</Title>
                      <BottomRow>
                        <Time>{lp.createdAt ? "방금 전" : "17 mins ago"}</Time>
                        <Likes>❤️ {lp.likes || lp.likesCount || 0}</Likes>
                      </BottomRow>
                    </MetaInfo>
                  </Overlay>
                </Card>
              );
            })}
            {isFetchingNextPage && 
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`next-skel-${i}`} />)
            }
          </>
        )}
      </Grid>

      {!isLoading && hasNextPage && (
        <div ref={ref} style={{ height: '100px', background: 'transparent' }} />
      )}
      
      {!hasNextPage && allLps.length > 0 && (
        <Status>모든 LP를 불러왔습니다. 💿</Status>
      )}
    </Container>
  );
};

export default Home;

const shimmer = keyframes` 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } `;
const SkeletonCard = styled.div`
  width: 100%; aspect-ratio: 1; background: #25262b;
  background-image: linear-gradient(to right, #25262b 0%, #38393e 20%, #25262b 40%, #25262b 100%);
  background-repeat: no-repeat; background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;
const Container = styled.div` width: 100%; `;
const SortArea = styled.div` display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 20px; `;
const SortBtn = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? '#fff' : 'none')};
  color: ${({ $active }) => ($active ? '#000' : '#fff')};
  border: 1px solid #fff; border-radius: 4px; padding: 6px 14px; cursor: pointer;
`;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2px; background-color: #000; `;
const Card = styled.div` position: relative; cursor: pointer; overflow: hidden; aspect-ratio: 1; background-color: #1a1a1a; &:hover { img { transform: scale(1.1); } .overlay { opacity: 1; } .meta-info { transform: translateY(0); } } `;
const LPImage = styled.img` width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; `;
const Overlay = styled.div` position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; `;
const MetaInfo = styled.div` transform: translateY(10px); transition: transform 0.3s ease; `;
const Title = styled.h3` color: #fff; font-size: 1rem; margin: 0 0 5px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
const BottomRow = styled.div` display: flex; justify-content: space-between; color: #ccc; font-size: 0.8rem; `;
const Time = styled.span``;
const Likes = styled.span``;
const Status = styled.div` text-align: center; padding: 50px; color: #888; font-size: 0.9rem; `;