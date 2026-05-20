import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = raw ? JSON.parse(raw) : null;

    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {

            if (originalRequest.url === "/v1/auth/refresh") {

                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {

                    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = raw ? JSON.parse(raw) : null;

                    const { data } = await axiosInstance.post("/v1/auth/refresh", {
                        refresh: refreshToken,
                    });


                    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(data.data.accessToken));
                    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(data.data.refreshToken));

                    return data.data.accessToken;
                })().catch(() => {

                    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                }).finally(() => {
                    refreshPromise = null;
                });
            }

            return refreshPromise.then((newAccessToken) => {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }

        return Promise.reject(error);
    }
);