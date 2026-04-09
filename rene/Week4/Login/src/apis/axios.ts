import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// 요청마다 localStorage에서 토큰을 읽어 헤더에 주입
axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = raw ? JSON.parse(raw) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});