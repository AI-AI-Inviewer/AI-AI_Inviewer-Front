// src/component/community/js/FeedBackDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import '../scss/FeedBackDetail.scss';

const parseDate = (v) => {
    if (!v) return null;
    if (Array.isArray(v)) {
        const [y, M, d, h = 0, m = 0, s = 0, ns = 0] = v;
        return new Date(y, M - 1, d, h, m, s, Math.floor(ns / 1e6));
    }
    return new Date(v);
};

const FeedBackDetail = ({ isLoggedIn, currentUser }) => {
    const { communityNum } = useParams(); // route: /feedback/:communityNum
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState(null);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 상세는 공개 엔드포인트(permitAll)
                const { data } = await api.get(`/community/${communityNum}`);
                setFeedback(data); // DTO: title, content, createdAt, userName/userNickname/userId 등

                // 댓글 목록(토큰 필요 없어도 조회 가능하도록 가정)
                const commentRes = await api.get(`/comments/${communityNum}`);
                setComments(commentRes.data);
            } catch (err) {
                console.error('게시글/댓글 불러오기 오류:', err);
                alert('게시글을 불러오는데 실패했습니다.');
                navigate('/feedback');
            }
        };
        fetchData();
    }, [communityNum, navigate]);

    const formatTime = (dateLike) => {
        const d = parseDate(dateLike);
        return d
            ? d.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            : '-';
    };

    const handleAddComment = async () => {
        if (!input.trim()) return;

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }

        try {
            await api.post('/comments', { communityNum, content: input });

            const commentRes = await api.get(`/comments/${communityNum}`);
            setComments(commentRes.data);
            setInput('');
        } catch (err) {
            console.error('댓글 등록 실패 (전체 에러 구조):', err);
            if (err.response) {
                alert(`댓글 등록 실패: ${err.response.data?.message || '서버 오류'}`);
            } else if (err.request) {
                alert('서버로부터 응답이 없습니다.');
            } else {
                alert(`요청 실패: ${err.message}`);
            }
        }
    };

    const handleDelete = async (commentNum) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/comments/${commentNum}`);
                setComments((prev) => prev.filter((c) => c.commentNum !== commentNum));
            } catch (err) {
                console.error('댓글 삭제 실패:', err);
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    if (!feedback) {
        return (
            <div className="feedback-detail-container">
                <p className="not-found-msg">게시글을 불러오는 중입니다...</p>
                <div className="btn-wrapper">
                    <Link to="/feedback" className="btn back-btn">
                        ← 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ DTO 필드 사용
    const author = feedback.userNickname || feedback.userName || feedback.userId || '알 수 없음';

    return (
        <div className="feedback-detail-container">
            <h2 className="detail-title">{feedback.title}</h2>
            <p className="detail-writer">작성자: {author}</p>
            <p className="detail-date">{formatTime(feedback.createdAt)}</p>
            <hr />
            <p className="detail-content">{feedback.content}</p>

            <div className="comment-section">
                <h3>댓글</h3>

                {isLoggedIn ? (
                    <div className="comment-input">
            <textarea
                placeholder="댓글을 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                    }
                }}
            />
                        <button onClick={handleAddComment}>등록</button>
                    </div>
                ) : (
                    <p className="login-alert">로그인 후 댓글을 작성할 수 있습니다.</p>
                )}

                <ul className="comment-list">
                    {comments.map((c) => (
                        <li key={c.commentNum} className="comment-item">
                            <div className="comment-meta">
                                <strong>{c.userNickname || c.userName || c.userId || '익명'}</strong>
                                <span className="comment-time">{formatTime(c.commentDate)}</span>
                            </div>
                            <p>{c.content}</p>
                            {isLoggedIn && currentUser?.userId === c.user?.userId && (
                                <div className="comment-buttons">
                                    <button onClick={() => handleDelete(c.commentNum)}>삭제</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="btn-wrapper">
                <Link to="/feedback" className="btn back-btn">
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
};

export default FeedBackDetail;

