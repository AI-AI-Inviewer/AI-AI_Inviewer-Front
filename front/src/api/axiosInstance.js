// src/api/axiosInstance.js
import axios from 'axios';

// Vite: import.meta.env.VITE_API_BASE
// CRA:  process.env.REACT_APP_API_BASE
const ENV_BASE =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
    process.env.REACT_APP_API_BASE;

// 배포(Nginx 프록시) 기본값은 '/api'
const API_BASE = ENV_BASE || '/api';

const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default instance;
