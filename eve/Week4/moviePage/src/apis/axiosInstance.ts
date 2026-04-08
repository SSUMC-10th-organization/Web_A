import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: import.meta.env.VITE_TMDB_TOKEN,
        language: 'ko-KR',
    },
});