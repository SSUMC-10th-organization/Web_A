import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (refreshPromise) {
        return refreshPromise.then(token => {
          if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post('http://localhost:8000/v1/auth/refresh', { refreshToken });
          const newAccessToken = data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          return newAccessToken;
        } catch (err) {
          localStorage.clear();
          window.location.href = '/login';
          throw err;
        } finally { refreshPromise = null; }
      })();

      const token = await refreshPromise;
      if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;