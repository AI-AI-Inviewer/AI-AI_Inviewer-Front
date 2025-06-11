import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:10000',
    withCredentials: true
});

// JWT 자동으로 붙도록 인터셉터 설정
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
