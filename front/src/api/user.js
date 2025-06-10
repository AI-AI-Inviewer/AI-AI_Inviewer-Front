import axios from 'axios';

const API_BASE_URL = 'http://localhost:10000/api/user';

// ✅ 회원가입
export const registerUser = async (form) => {
    const formData = new FormData();
    formData.append('userId', form.userId);
    formData.append('password', form.password);
    formData.append('email', form.email);
    formData.append('name', form.name);
    formData.append('nickname', form.nickname);
    if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
    }

    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};

// ✅ 아이디 중복 검사
export const checkUserId = async (userId) => {
    return await axios.get(`${API_BASE_URL}/check-id?userId=${userId}`);
};

// ✅ 닉네임 중복 검사
export const checkNickname = async (nickname) => {
    return await axios.get(`${API_BASE_URL}/check-nickname?nickname=${nickname}`);
};

// ✅ 사용자 정보 조회
export const getMyInfo = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }

    const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ✅ 사용자 정보 수정
export const updateUser = async (userData) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }

    const response = await axios.put(`${API_BASE_URL}/update`, userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
