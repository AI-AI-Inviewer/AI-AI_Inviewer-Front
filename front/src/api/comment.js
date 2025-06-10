import axios from './axiosInstance';

// 댓글 작성
export const createComment = async (communityNum, content) => {
    return axios.post('/api/comments', null, {
        params: { communityNum, content }
    });
};

// 댓글 삭제
export const deleteComment = async (commentNum) => {
    return axios.delete(`/api/comments/${commentNum}`);
};

// 댓글 목록 조회
export const getCommentsByCommunity = async (communityNum) => {
    return axios.get(`/api/comments/${communityNum}`);
};
