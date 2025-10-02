// src/api/user.js
import api from './axiosInstance';

const USER_BASE = '/user';

// ✅ 회원가입
export const registerUser = async (form) => {
    const payload = {
        userId: form.userId ?? '',
        userPassword: form.password ?? '',
        userEmail: form.email ?? '',
        userName: form.name ?? '',
        userNickname: form.nickname ?? '',
    };
    const { data } = await api.post(`${USER_BASE}/register`, payload);
    return data; // { userNum: number }
};

// ✅ 로그인
export const loginUser = async (credentials) => {
    const { data } = await api.post(`${USER_BASE}/login`, credentials);
    if (data?.token) localStorage.setItem('jwtToken', data.token); // JWT 저장
    return data;
};

// ✅ 로그아웃
export const logoutUser = () => {
    localStorage.removeItem('jwtToken');
};

// ✅ 아이디 중복 검사
export const checkUserId = async (userId) => {
    const { data } = await api.get(`${USER_BASE}/check-id`, { params: { userId } });
    return data;
};

// ✅ 닉네임 중복 검사
export const checkNickname = async (nickname) => {
    const { data } = await api.get(`${USER_BASE}/check-nickname`, { params: { nickname } });
    return data;
};

// ✅ 내 정보 가져오기
export const getMyInfo = async () => {
    const { data } = await api.get(`${USER_BASE}/me`);
    return data;
};

// ✅ 사용자 정보 수정
export const updateUser = async (userData) => {
    const { data } = await api.put(`${USER_BASE}/update`, userData);
    return data;
};

export const sendEmailCode = async (email) => {
    const { data } = await api.post('/user/email-code/send', { email });
    return data;
};

export const verifyEmailCode = async (email, code) => {
    const { data } = await api.post('/user/email-code/verify', { email, code });
    return data;
};