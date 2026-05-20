import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
	const { setItem: setAccessToken } = useLocalStorage(
		LOCAL_STORAGE_KEY.accessToken,
	);

	const { setItem: setRefreshToken } = useLocalStorage(
		LOCAL_STORAGE_KEY.refreshToken,
	);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
		const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

		// 두 토큰이 모두 있을 때만 저장 (깨진 값 저장 방지)
		if (accessToken && refreshToken) {
			setAccessToken(accessToken);
			setRefreshToken(refreshToken);
			window.location.href = "/my";
		}
	}, [setAccessToken, setRefreshToken]);

	return (
		<div className="flex items-center justify-center py-20 text-gray-300">
			구글 로그인 처리 중...
		</div>
	);
};

export default GoogleLoginRedirectPage;
