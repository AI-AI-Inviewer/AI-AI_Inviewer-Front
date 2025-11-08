import React, { useState, useEffect, useMemo } from 'react';
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

const b64urlToJson = (b64) => {
    try {
        const pad = '='.repeat((4 - (b64.length % 4)) % 4);
        const base64 = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
        const str = atob(base64);
        return JSON.parse(
            decodeURIComponent(
                Array.prototype
                    .map.call(str, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(''),
            ),
        );
    } catch {
        return {};
    }
};

const getClaimsFromJwt = () => {
    const t = localStorage.getItem('jwtToken');
    if (!t || !t.includes('.')) return {};
    const [, payload] = t.split('.');
    return b64urlToJson(payload);
};

const norm  = (x) => (x ?? '').toString().trim();
const lower = (x) => norm(x).toLowerCase();
const pick  = (...vals) => vals.find((v) => v !== undefined && v !== null && norm(v) !== '');

const FeedBackDetail = ({ isLoggedIn, currentUser }) => {
    const { communityNum } = useParams(); // /feedback/:communityNum
    const navigate = useNavigate();

    const [feedback, setFeedback]   = useState(null);
    const [comments, setComments]   = useState([]);
    const [input, setInput]         = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/community/${communityNum}`);
                setFeedback(data);

                const res = await api.get(`/comments/${communityNum}`);
                setComments(res.data || []);
            } catch (err) {
                console.error('게시글/댓글 불러오기 오류:', err);
                alert('게시글을 불러오는데 실패했습니다.');
                navigate('/feedback');
            }
        })();
    }, [communityNum, navigate]);

    const formatTime = (dateLike) => {
        const d = parseDate(dateLike);
        return d
            ? d.toLocaleString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
            })
            : '-';
    };

    const loginOk = isLoggedIn || !!localStorage.getItem('jwtToken');

    const me = useMemo(() => {
        const claims = getClaimsFromJwt();
        const myId = pick(
            currentUser?.userId, currentUser?.id, currentUser?.userNum, currentUser?.username,
            claims.userId, claims.id, claims.userNum, claims.username, claims.sub, claims.email,
        );
        const myNick = pick(
            currentUser?.userNickname, currentUser?.nickname,
            claims.userNickname, claims.nickname, claims.name,
        );
        return { myId: lower(myId), myNick: lower(myNick) };
    }, [currentUser]);

    const isPostAuthor = useMemo(() => {
        if (!loginOk || !feedback) return false;

        const postId = pick(
            feedback.userId, feedback.authorId, feedback.writerId, feedback.userNum,
            feedback.user?.userId, feedback.user?.userNum,
        );
        const postNick = pick(
            feedback.userNickname, feedback.authorNickname, feedback.writerNickname, feedback.userName,
            feedback.user?.userNickname, feedback.user?.userName,
        );

        const idMatch   = me.myId && lower(postId)   && me.myId   === lower(postId);
        const nickMatch = me.myNick && lower(postNick) && me.myNick === lower(postNick);
        return idMatch || (!idMatch && nickMatch);
    }, [loginOk, feedback, me.myId, me.myNick]);

    const isCommentAuthor = (c) => {
        if (!loginOk || !c) return false;
        const cid  = pick(c.userId, c.authorId, c.writerId, c.userNum, c.user?.userId, c.user?.userNum);
        const cnick= pick(c.userNickname, c.authorNickname, c.writerNickname, c.userName, c.user?.userNickname, c.user?.userName);
        const idMatch   = me.myId && lower(cid)   && me.myId   === lower(cid);
        const nickMatch = me.myNick && lower(cnick) && me.myNick === lower(cnick);
        return idMatch || (!idMatch && nickMatch);
    };

    const handleAddComment = async () => {
        if (!input.trim()) return;
        if (!loginOk) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }
        try {
            await api.post('/comments', { communityNum, content: input.trim() });
            const res = await api.get(`/comments/${communityNum}`);
            setComments(res.data || []);
            setInput('');
        } catch (err) {
            console.error('댓글 등록 실패:', err);
            const msg = err.response?.data?.message
                ? `댓글 등록 실패: ${err.response.data.message}`
                : err.request ? '서버로부터 응답이 없습니다.' : `요청 실패: ${err.message}`;
            alert(msg);
        }
    };

    const handleDeleteComment = async (commentNum) => {
        if (!loginOk) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/comments/${commentNum}`);
            setComments((prev) => prev.filter((c) => c.commentNum !== commentNum));
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
            alert(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
        }
    };

    const handleDeletePost = async () => {
        if (!loginOk) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }
        if (!isPostAuthor) return;
        if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/community/${communityNum}`);
            alert('삭제되었습니다.');
            navigate('/feedback');
        } catch (err) {
            console.error('게시글 삭제 실패:', err);
            alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
        }
    };

    if (!feedback) {
        return (
            <div className="feedback-detail-container">
                <p className="not-found-msg">게시글을 불러오는 중입니다...</p>
                <div className="btn-wrapper">
                    <Link to="/feedback" className="btn back-btn btn-slim">← 목록으로</Link>
                </div>
            </div>
        );
    }

    const author = feedback.userNickname || feedback.userName || feedback.userId || '알 수 없음';

    return (
        <div className="feedback-detail-container">
            <h2 className="detail-title">{feedback.title}</h2>

            <div className="detail-meta">
                <span className="detail-writer">작성자: {author}</span>
                <span className="dot">•</span>
                <span className="detail-date">{formatTime(feedback.createdAt)}</span>
            </div>

            <div className="detail-content">{feedback.content}</div>

            {loginOk && isPostAuthor && (
                <div className="detail-actions bottom-actions">
                    <Link
                        to={`/feedback/${communityNum}/edit`}
                        state={feedback}
                        className="btn btn-primary btn-slim"
                        aria-label="게시글 수정"
                    >
                        <span className="btn-icon" aria-hidden>✏️</span>
                        수정
                    </Link>

                    <button
                        type="button"
                        className="btn btn-danger btn-slim"
                        onClick={handleDeletePost}
                        aria-label="게시글 삭제"
                    >
                        <span className="btn-icon" aria-hidden>🗑️</span>
                        삭제
                    </button>
                </div>
            )}

            <div className="comment-section">
                <h3>댓글</h3>

                {loginOk ? (
                    <div className="comment-input">
            <textarea
                placeholder="댓글을 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                    }
                }}
            />
                        <button className="btn btn-primary btn-slim" onClick={handleAddComment}>
                            <span className="btn-icon" aria-hidden>💬</span>
                            등록
                        </button>
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

                            {loginOk && isCommentAuthor(c) && (
                                <div className="comment-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-slim btn-soft"
                                        onClick={() => handleDeleteComment(c.commentNum)}
                                    >
                                        <span className="btn-icon" aria-hidden>🗑️</span>
                                        삭제
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="btn-wrapper">
                <Link to="/feedback" className="btn back-btn btn-slim">← 목록으로</Link>
            </div>
        </div>
    );
};

export default FeedBackDetail;
