import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const alerted = useRef(false);

    useEffect(() => {
        if (!accessToken && !alerted.current) {
            alerted.current = true;
            alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
            navigate("/login", { replace: true, state: { from: location } });
        }
    }, [accessToken, navigate, location]);

    if (!accessToken) return null;

    return <Outlet />;
};

export default ProtectedLayout;