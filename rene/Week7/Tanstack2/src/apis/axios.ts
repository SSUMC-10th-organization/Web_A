import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { ResponseRefreshDto } from "../types/auth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// refresh 전용 인스턴스 - 응답 인터셉터 없음 (무한 루프 방지)
const refreshAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// 요청마다 localStorage에서 accessToken을 읽어 헤더에 주입
axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const token = raw ? JSON.parse(raw) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// race condition 방지 플래그
let isRefreshing = false; 
// 동시에 여러 요청이 401로 실패했을 때 대기 큐
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401이 아니거나 이미 재시도한 요청이면 그냥 reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // refresh 진행 중이면 큐에 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
    const refreshToken = raw ? JSON.parse(raw) : null;

    // refresh token이 없으면 바로 실패 처리
    if (!refreshToken) {
      processQueue(new Error("No refresh token"), null);
      isRefreshing = false;
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // refresh token으로 새로운 access token 발급 시도
    try {
      const { data } = await refreshAxios.post<ResponseRefreshDto>(
        "/v1/auth/refresh",
        { refresh: refreshToken }
      );

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem(
        LOCAL_STORAGE_KEY.accessToken,
        JSON.stringify(newAccessToken)
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY.refreshToken,
        JSON.stringify(newRefreshToken)
      );

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      // 대기 중인 요청들 처리 (새 토큰으로 교체)
      processQueue(null, newAccessToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // refresh 실패 시 대기 중인 요청들 모두 실패 처리
      processQueue(refreshError, null);
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);