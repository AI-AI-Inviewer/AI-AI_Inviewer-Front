// src/api/user.js
import axios from 'axios';

// .env에 VITE_API_BASE_URL 있으면 그걸 우선 사용 (예: http://localhost:10000)
const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? 'http://localhost:10002';
const USER_BASE = '/api/user'; // 컨트롤러 @RequestMapping("/api/user")와 일치

// 공통 axios 인스턴스
const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // 쿠키/JWT 쓰면 유지 (불필요하면 false로 바꿔도 됨)
});

// ✅ 회원가입 (지금 백엔드는 JSON을 기대하므로 FormData가 아니라 JSON으로 보냄)
export const registerUser = async (form) => {
    // 백엔드가 @RequestBody User 를 받으므로, 필드명은 엔티티/DTO에 맞추기
    const payload = {
        userId: form.userId ?? '',
        userPassword: form.password ?? '', // 서비스 authenticate가 평문 비번 받음
        userEmail: form.email ?? '',
        userName: form.name ?? '',
        userNickname: form.nickname ?? '',
        // 프로필 이미지는 현재 컨트롤러에 수신 로직이 없음(추가해야 업로드 가능)
    };
    const { data } = await api.post(`${USER_BASE}/register`, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    return data; // { userNum: number }
};

// ✅ 아이디 중복 검사 (응답: { available: boolean })
export const checkUserId = async (userId) => {
    const { data } = await api.get(`${USER_BASE}/check-id`, {
        params: { userId }, // 자동 인코딩
    });
    return data; // { available: true/false }
};

// ✅ 닉네임 중복 검사 (응답: { available: boolean })
export const checkNickname = async (nickname) => {
    const { data } = await api.get(`${USER_BASE}/check-nickname`, {
        params: { nickname },
    });
    return data; // { available: true/false }
};

// ✅ 내 정보
const getAuthHeader = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

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
