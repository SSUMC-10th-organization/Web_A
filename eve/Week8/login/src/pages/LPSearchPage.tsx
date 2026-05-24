import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import api from '../api/axios';

const fetchSearchLps = async ({ pageParam, keyword }: { pageParam: any; keyword: string }) => {
  if (!keyword.trim()) return { data: { data: [], nextCursor: null, hasNext: false } };

  const res = await api.get(`/v1/lps`, {
    params: {
      search: keyword,
      cursor: pageParam === null || pageParam === undefined ? undefined : pageParam, 
      limit: 10,
      order: 'desc', 
    },
  });

  return res.data;
};

const LPSearchPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(searchInput, 300);

  const throttledInView = useThrottle(inView, 1000);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ pageParam }) => fetchSearchLps({ pageParam, keyword: debouncedQuery }),
    initialPageParam: null, 
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined;
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (throttledInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [throttledInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const rawLps = data?.pages.flatMap((page: any) => {
    if (page?.data && Array.isArray(page.data.data)) {
      return page.data.data;
    }
    return [];
  }) || [];

  const lps = rawLps.filter((lp: any) => {
    if (!debouncedQuery.trim()) return false;

    const title = (lp.title || '').trim();
    const content = (lp.content || '').trim();
    const query = debouncedQuery.toLowerCase();

    if (title.length <= 2 || content.length <= 2) return false;

    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(title) || /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(content);
    if (!hasKorean) {
      if (title.length <= 4 || content.length <= 4) return false;
      const commonLatin = /quia|voluptas|dolor|sit|amet|consectetur|lorem|ipsum|absens|solutio|ocer|delinquo|magni|cum/i;
      if (commonLatin.test(title) || commonLatin.test(content)) return false;
    }

    return title.toLowerCase().includes(query) || content.toLowerCase().includes(query);
  });

  return (
    <Container>
      <Title>LP판 검색</Title>
      
      <SearchWrapper>
        <SearchInput
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="검색어를 입력하세요..."
        />
      </SearchWrapper>

      {isLoading && <Message>💿 검색 중입니다...</Message>}
      {isError && <Message style={{ color: '#ff4d4d' }}>⚠️ 검색 중 에러가 발생했습니다.</Message>}
      
      {!isLoading && !isError && lps.length === 0 && debouncedQuery && (
        <Message>검색 결과가 없습니다.</Message>
      )}

      <LPGrid>
        {lps.map((lp: any) => {
          const keyId = lp.id;
          const displayTitle = lp.title || "제목 없음";
          const displayContent = lp.content || "설명 없음";
          const displayImage = lp.thumbnail || lp.imageUrl || lp.image_url || "/default_lp.png";

          return (
            <LPCard key={keyId} onClick={() => navigate(`/lp/${keyId}`)}>
              <LPImage 
                src={displayImage} 
                alt={displayTitle} 
                onError={(e: any) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = "/default_lp.png";
                }}
              />
              <LPInfo>
                <h3>{displayTitle}</h3>
                <p>{displayContent}</p>
              </LPInfo>
            </LPCard>
          );
        })}
      </LPGrid>

      <div ref={ref} style={{ height: '50px', margin: '20px 0' }} />
    </Container>
  );
};

export default LPSearchPage;

const Container = styled.div` max-width: 800px; margin: 0 auto; padding: 20px; color: #fff; `;
const Title = styled.h1` text-align: center; margin-bottom: 30px; font-size: 1.8rem; `;
const SearchWrapper = styled.div` margin-bottom: 30px; `;
const SearchInput = styled.input`
  width: 100%; padding: 15px 20px; border-radius: 12px; border: 1px solid #333;
  background: #1a1b1e; color: #fff; font-size: 1rem; outline: none; box-sizing: border-box;
  &:focus { border-color: #FF007F; }
`;
const Message = styled.div` text-align: center; color: #888; margin: 20px 0; `;
const LPGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; `;
const LPCard = styled.div` background: #1c1d21; border-radius: 15px; overflow: hidden; border: 1px solid #2a2b30; cursor: pointer; transition: transform 0.2s ease; &:hover { transform: translateY(-5px); } `;
const LPImage = styled.img` width: 100%; height: 180px; object-fit: cover; `;
const LPInfo = styled.div` padding: 12px; h3 { margin: 0; font-size: 0.95rem; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } p { margin: 5px 0 0; font-size: 0.85rem; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } `;