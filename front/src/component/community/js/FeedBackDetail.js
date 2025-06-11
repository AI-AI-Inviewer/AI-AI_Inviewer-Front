import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../scss/FeedBackDetail.scss';

const FeedBackDetail = ({ isLoggedIn, currentUser }) => {
    const { communityNum } = useParams();
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState(null);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await axios.get(`http://localhost:10000/api/community/${communityNum}`, { headers });
                setFeedback(res.data);

                const commentRes = await axios.get(`http://localhost:10000/api/comments/${communityNum}`, { headers });
                setComments(commentRes.data);
            } catch (err) {
                console.error('게시글/댓글 불러오기 오류:', err);
                alert('게시글을 불러오는데 실패했습니다.');
                navigate('/feedback');
            }
        };
        fetchData();
    }, [communityNum, navigate]);

    const formatTime = (date) => {
        return new Date(date).toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
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
            await axios.post(
                'http://localhost:10000/api/comments',
                {
                    communityNum: communityNum,
                    content: input
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const res = await axios.get(
                `http://localhost:10000/api/comments/${communityNum}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setComments(res.data);
            setInput('');
        } catch (err) {
            // 전체 에러 로그 구조 확인
            console.error('댓글 등록 실패 (전체 에러 구조):', err);

            // axios의 response 안에 에러 메시지가 들어있으면 로그 출력
            if (err.response) {
                console.error('에러 response:', err.response);
                console.error('에러 status:', err.response.status);
                console.error('에러 data:', err.response.data);
                alert(`댓글 등록 실패: ${err.response.data?.message || '서버 오류'}`);
            } else if (err.request) {
                // 요청이 서버에 도달했으나 응답이 없을 때
                console.error('에러 request:', err.request);
                alert('서버로부터 응답이 없습니다.');
            } else {
                // 그 외 에러
                console.error('에러 message:', err.message);
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
                await axios.delete(
                    `http://localhost:10000/api/comments/${commentNum}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setComments(comments.filter(c => c.commentNum !== commentNum));
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
                    <Link to="/feedback" className="btn back-btn">← 목록으로</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-detail-container">
            <h2 className="detail-title">{feedback.communityTitle}</h2>
            <p className="detail-writer">작성자: {feedback.user?.userName || '알 수 없음'}</p>
            <p className="detail-date">{formatTime(feedback.communityDate)}</p>
            <hr />
            <p className="detail-content">{feedback.communityContent}</p>

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
                                <strong>{c.user?.userName || '익명'}</strong>
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
                <Link to="/feedback" className="btn back-btn">← 목록으로</Link>
            </div>
        </div>
    );
};

export default FeedBackDetail;
