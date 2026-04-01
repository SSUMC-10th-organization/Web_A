// src/components/navbar.tsx
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export default function Navbar() {
    return (
        <Nav>
            <Logo to="/">YONG MOVIE</Logo>
            
            <Menu>
                <StyledNavLink to="/" end>홈</StyledNavLink>
                <StyledNavLink to="/movies/popular">인기</StyledNavLink>
                <StyledNavLink to="/movies/now-playing">현재 상영 중</StyledNavLink>
                <StyledNavLink to="/movies/top-rated">높은 평점</StyledNavLink>
                <StyledNavLink to="/movies/upcoming">개봉 예정</StyledNavLink>
            </Menu>
        </Nav>
    );
}

const Nav = styled.nav` 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    padding: 15px 5%; 
    background: #1a1a1a; 
    position: sticky; 
    top: 0;
    z-index: 100;
`;

const Logo = styled(NavLink)` 
    color: #ff4757; 
    font-size: 22px; 
    font-weight: bold; 
    text-decoration: none; 
`;

const Menu = styled.div` 
    display: flex; 
    gap: 20px; 
`;

const StyledNavLink = styled(NavLink)` 
    color: white; 
    text-decoration: none; 
    font-size: 15px; 
    transition: 0.2s;

    &:hover { color: #ff4757; }

    &.active { 
        color: #ff4757; 
        font-weight: bold; 
    }
`;