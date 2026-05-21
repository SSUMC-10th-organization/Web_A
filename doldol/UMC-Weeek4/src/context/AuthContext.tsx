import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
	accessToken: string | null;
	refreshToken: string | null;
	login: (signInData: RequestSigninDto) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
	accessToken: null,
	refreshToken: null,
	login: async () => {},
	logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const {
		getItem: getAccessTokenFromStorage,
		setItem: setAccessTokenInStorage,
		removeItem: removeAccessTokenFromStorage,
	} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

	const {
		getItem: getRefreshTokenFromStorage,
		setItem: setRefreshTokenInStorage,
		removeItem: removeRefreshTokenFromStorage,
	} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

	const [accessToken, setAccessToken] = useState<string | null>(
		getAccessTokenFromStorage(),
	);

	const [refreshToken, setRefreshToken] = useState<string | null>(
		getRefreshTokenFromStorage(),
	);

	// 에러를 throw → useMutation 의 onError 로 처리
	const login = async (signinData: RequestSigninDto): Promise<void> => {
		const { data } = await postSignin(signinData);
		const newAccessToken = data.accessToken;
		const newRefreshToken = data.refreshToken;
		setAccessTokenInStorage(newAccessToken);
		setRefreshTokenInStorage(newRefreshToken);
		setAccessToken(newAccessToken);
		setRefreshToken(newRefreshToken);
	};

	const logout = async (): Promise<void> => {
		try {
			await postLogout();
		} catch {
			// 서버 에러가 나도 로컬 상태 초기화
		} finally {
			removeAccessTokenFromStorage();
			removeRefreshTokenFromStorage();
			setAccessToken(null);
			setRefreshToken(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{ accessToken, refreshToken, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("AuthContext를 찾을 수 없습니다.");
	return context;
};
