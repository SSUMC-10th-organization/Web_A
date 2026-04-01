import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import styled from "styled-components";

const RootLayout = () => {
    return (
        <Wrapper>
            <Navbar />
            <MainContent>
                <Outlet />
            </MainContent>
        </Wrapper>
    );
};

export default RootLayout;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #000; 
`;

const MainContent = styled.main`
    flex: 1;
    padding: 20px;
`;