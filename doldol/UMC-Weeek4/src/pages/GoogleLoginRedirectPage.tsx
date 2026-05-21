import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
	const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
	const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
		const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

		if (accessToken && refreshToken) {
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);
			window.location.href = "/"; // 홈으로 이동
		}
	}, [setAccessToken, setRefreshToken]);

	return (
		<div className="flex items-center justify-center py-20 text-gray-300">
			구글 로그인 처리 중...
		</div>
	);
};

export default GoogleLoginRedirectPage;
