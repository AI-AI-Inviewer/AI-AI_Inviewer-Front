// src/api/comment.js
import api from './axiosInstance';

const COMMENT_BASE = '/comments';

// 댓글 작성
export const createComment = (communityNum, content) => {
    return api.post(COMMENT_BASE, null, {
        params: { communityNum, content },
    });
};

// 댓글 삭제
export const deleteComment = (commentNum) => {
    return api.delete(`${COMMENT_BASE}/${commentNum}`);
};

// 댓글 목록 조회
export const getCommentsByCommunity = (communityNum) => {
    return api.get(`${COMMENT_BASE}/${communityNum}`);
};

