// src/api/user.js
import api from './axiosInstance';

const USER_BASE = '/user';

// --- helpers ---
const normEmail = (e) => (e ?? '').trim().toLowerCase();
const normCode  = (c) => (c ?? '').toString().replace(/\s+/g, '').trim();

// ✅ 회원가입 (JSON)
export const registerUser = async (form) => {
    const payload = {
        userId: form.userId ?? '',
        userPassword: form.password ?? '',
        userEmail: normEmail(form.email),
        userName: form.name ?? '',
        userNickname: form.nickname ?? '',
    };
    const { data } = await api.post(`${USER_BASE}/register`, payload);
    return data;
};

// ✅ 로그인
export const loginUser = async (credentials) => {
    const body = {
        userId: credentials.userId ?? '',
        password: credentials.password ?? credentials.userPassword ?? '',
    };
    const { data } = await api.post(`${USER_BASE}/login`, body, { withCredentials: true });
    if (data?.token) localStorage.setItem('jwtToken', data.token);
    return data;
};

// ✅ 로그아웃
export const logoutUser = async () => {
    try {
        await api.post(`${USER_BASE}/logout`, {}, { withCredentials: true });
    } finally {
        localStorage.removeItem('jwtToken');
    }
};

// ✅ 아이디/닉네임 중복 검사
export const checkUserId = async (userId) => {
    const { data } = await api.get(`${USER_BASE}/check-id`, { params: { userId } });
    return data; // { available: true/false, ... }
};

export const checkNickname = async (nickname) => {
    const { data } = await api.get(`${USER_BASE}/check-nickname`, { params: { nickname } });
    return data; // { available: true/false, ... }
};

// ✅ 내 정보/수정
export const getMyInfo = async () => {
    const { data } = await api.get(`${USER_BASE}/me`, { withCredentials: true });
    return data;
};

export const updateUser = async (userData) => {
    const { data } = await api.put(`${USER_BASE}/update`, userData, { withCredentials: true });
    return data;
};

// ✅ 이메일 코드 전송/검증 (JSON)
export const sendEmailCode = async (email) => {
    const { data } = await api.post(`${USER_BASE}/email-code/send`, { email: normEmail(email) });
    return data; // { ok:true/false, message?:string, ... }
};

export const verifyEmailCode = async (email, code) => {
    const { data } = await api.post(`${USER_BASE}/email-code/verify`, {
        email: normEmail(email),
        code: normCode(code),
    });
    return data; // { ok:true/false, message?:string } 또는 true/false
};

// ✅ 비밀번호 변경
export const changePassword = async ({ currentPassword, newPassword }) => {
    const payload = { currentPassword, newPassword };
    const { data } = await api.put(`${USER_BASE}/password`, payload, { withCredentials: true });
    return data;
};
