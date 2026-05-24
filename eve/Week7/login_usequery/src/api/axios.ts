import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    if (requestUrl.includes('withdraw') || requestUrl.includes('logout')) {
      console.warn('탈퇴/로그아웃 요청은 인증 에러를 무시하고 클라이언트를 안전하게 이탈시킵니다.');
      return Promise.resolve({ data: { success: true } });
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const { data } = await axios.post('http://localhost:8000/v1/auth/token', {
          refreshToken,
        });
        
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;