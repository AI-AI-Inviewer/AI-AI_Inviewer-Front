// src/api/feedback.js
import api from './axiosInstance';

const FEEDBACK_BASE = '/community';

// 🔹 피드백 리스트 조회
export const getFeedbackList = async () => {
    const { data } = await api.get(FEEDBACK_BASE);
    return data;
};

// 🔹 피드백 상세 조회
export const getFeedbackById = async (id) => {
    const { data } = await api.get(`${FEEDBACK_BASE}/${id}`);
    return data;
};

// 🔹 피드백 작성 (등록)
export const createFeedback = async (payload) => {
    const { data } = await api.post(FEEDBACK_BASE, payload);
    return data;
};

