// src/pages/home.tsx
import styled from "styled-components";

export default function HomePage() {
    return (
        <HomeWrapper>
            <h1>🎬 Welcome to YONG MOVIE</h1>
            <p>다양한 영화 정보를 카테고리별로 확인해보세요!</p>
        </HomeWrapper>
    );
}

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
    color: white;
    text-align: center;

    h1 { font-size: 3rem; margin-bottom: 20px; color: #ff4757; }
    p { font-size: 1.2rem; color: #ccc; }
`;