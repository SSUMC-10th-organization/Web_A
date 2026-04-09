import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_SERVER_API_URL,
	//headers: {
	//        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
	//    }
});

axiosInstance.interceptors.request.use((config) => {
	const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
	const token = raw ? JSON.parse(raw) : null;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});
