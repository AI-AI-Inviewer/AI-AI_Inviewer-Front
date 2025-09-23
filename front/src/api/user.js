// src/api/user.js
import axios from 'axios';

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? 'http://localhost:10002';
const USER_BASE = '/api/user';

// 공통 axios 인스턴스
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // 쿠키/JWT 쓰면 유지
});

// ✅ 회원가입
export const registerUser = async (form) => {
    const payload = {
        userId: form.userId ?? '',
        userPassword: form.password ?? '',
        userEmail: form.email ?? '',
        userName: form.name ?? '',
        userNickname: form.nickname ?? '',
    };
    const { data } = await api.post(`${USER_BASE}/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    return data; // { userNum: number }
};

// ✅ 로그인
export const loginUser = async (credentials) => {
    const { data } = await api.post(`${USER_BASE}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (data.token) localStorage.setItem('jwtToken', data.token); // JWT 저장
    return data;
};

// ✅ 로그아웃
export const logoutUser = () => {
    localStorage.removeItem('jwtToken'); // 토큰 제거
};

// ✅ 아이디 중복 검사
export const checkUserId = async (userId) => {
    const { data } = await api.get(`${USER_BASE}/check-id`, {
        params: { userId },
    });
    return data;
};

// ✅ 닉네임 중복 검사
export const checkNickname = async (nickname) => {
    const { data } = await api.get(`${USER_BASE}/check-nickname`, {
        params: { nickname },
    });
    return data;
};

// ✅ JWT 헤더
const getAuthHeader = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ 내 정보 가져오기
export const getMyInfo = async () => {
    const headers = getAuthHeader();
    if (!headers.Authorization) throw new Error('로그인이 필요합니다.');
    const { data } = await api.get(`${USER_BASE}/me`, { headers });
    return data;
};

// ✅ 사용자 정보 수정
export const updateUser = async (userData) => {
    const headers = getAuthHeader();
    if (!headers.Authorization) throw new Error('로그인이 필요합니다.');
    const { data } = await api.put(`${USER_BASE}/update`, userData, { headers });
    return data;
};
