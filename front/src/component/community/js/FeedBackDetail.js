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
                const res = await axios.get(`http://localhost:10000/api/community/${communityNum}`);
                setFeedback(res.data);

                const commentRes = await axios.get(`http://localhost:10000/api/comments/${communityNum}`);
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
                null,  // Request Body가 아니라 Query Params 사용 중
                {
                    params: {
                        userId: currentUser.userId,
                        communityNum: communityNum,
                        content: input
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const res = await axios.get(`http://localhost:10000/api/comments/${communityNum}`);
            setComments(res.data);
            setInput('');
        } catch (err) {
            console.error('댓글 등록 실패:', err);
            if (err.response && err.response.status === 403) {
                alert('권한이 없습니다. 로그인 후 다시 시도해 주세요.');
                navigate('/signin');
            } else {
                alert('댓글 등록에 실패했습니다.');
            }
        }
    };


    const handleDelete = async (commentNum) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:10000/api/comments/${commentNum}`);
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
                <Link to="/feedback" className="btn back-btn">← 목록으로</Link>
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

                {/* 댓글 작성 폼 */}
                {isLoggedIn ? (
                    <div className="comment-input">
                        <textarea
                            placeholder="댓글을 입력하세요"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={handleAddComment}>등록</button>
                    </div>
                ) : (
                    <p className="login-alert">로그인 후 댓글을 작성할 수 있습니다.</p>
                )}

                {/* 댓글 리스트 */}
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
