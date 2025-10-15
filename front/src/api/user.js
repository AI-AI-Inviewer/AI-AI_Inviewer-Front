// src/api/user.js
import api from './axiosInstance';

const USER_BASE = '/user';

// 정규화 헬퍼
const normEmail = (e) => (e ?? '').trim().toLowerCase();
const normCode  = (c) => (c ?? '').toString().replace(/\s+/g, '').trim();

// ✅ 회원가입
export const registerUser = async (form) => {
    const payload = {
        userId: form.userId ?? '',
        userPassword: form.password ?? '',
        userEmail: normEmail(form.email),       // ← 정규화
        userName: form.name ?? '',
        userNickname: form.nickname ?? '',
    };
    const { data } = await api.post(`${USER_BASE}/register`, payload);
    return data;
};

// ✅ 로그인 (쿠키 기반이지만 토큰을 주면 로컬에도 저장)
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
    try { await api.post(`${USER_BASE}/logout`, {}, { withCredentials: true }); } catch {}
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

// ✅ 내 정보
export const getMyInfo = async () => {
    const { data } = await api.get(`${USER_BASE}/me`, { withCredentials: true });
    return data;
};

// ✅ 사용자 정보 수정
export const updateUser = async (userData) => {
    const { data } = await api.put(`${USER_BASE}/update`, userData, { withCredentials: true });
    return data;
};

// ✅ 이메일 코드 전송
export const sendEmailCode = async (email) => {
    const { data } = await api.post(`${USER_BASE}/email-code/send`, { email: (email ?? '').trim() });
    return data;
};

// ✅ 이메일 코드 검증
export const verifyEmailCode = async (email, code) => {
    const { data } = await api.post(`${USER_BASE}/email-code/verify`, {
        email: normEmail(email),
        code: normCode(code),                   // ← 공백/개행 제거 후 전송
    });
    return data; // { ok: true }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
    const payload = { currentPassword, newPassword };
    const { data } = await api.put(`${USER_BASE}/password`, payload, { withCredentials: true });
    return data;
};