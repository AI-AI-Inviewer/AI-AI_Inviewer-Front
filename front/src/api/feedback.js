import axios from 'axios';

// Spring Boot API 엔드포인트
const API_BASE_URL = 'http://localhost:10000/api/community';

// 🔹 피드백 리스트 조회
export const getFeedbackList = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('[피드백 목록 조회] 오류:', error);
        throw error;
    }
};

// 🔹 피드백 상세 조회
export const getFeedbackById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`[피드백 상세 조회] id: ${id} 오류:`, error);
        throw error;
    }
};

// 🔹 피드백 작성 (등록)
export const createFeedback = async (data) => {
    try {
        const response = await axios.post(API_BASE_URL, data);
        return response.data;
    } catch (error) {
        console.error('[피드백 작성] 오류:', error);
        throw error;
    }
};
