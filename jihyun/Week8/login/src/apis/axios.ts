import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/localStorage";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401) {
      if (originalRequest.url?.includes("/v1/auth/refresh")) {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (refreshPromise) {
        return refreshPromise;
      }

      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refreshToken,
          });

          localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, data.data.accessToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, data.data.refreshToken);

          return data.data.accessToken;
        } catch (refreshError) {
          localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
          localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
          window.location.href = "/login";
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;