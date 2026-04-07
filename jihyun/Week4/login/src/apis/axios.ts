import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/localStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    let accessToken = token;

    try {
      accessToken = JSON.parse(token) as string;
    } catch {
      accessToken = token;
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;