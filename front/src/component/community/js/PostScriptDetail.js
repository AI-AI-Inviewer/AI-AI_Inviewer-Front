// src/component/community/js/PostScriptDetail.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import '../scss/PostScriptDetail.scss';
import api from '../../../api/axiosInstance';
import { getMyInfo } from '../../../api/user';

const parseDate = (v) => {
    if (!v) return null;
    if (Array.isArray(v)) {
        const [y, M, d, h = 0, m = 0, s = 0, ns = 0] = v;
        return new Date(y, M - 1, d, h, m, s, Math.floor(ns / 1e6));
    }
    return new Date(v);
};

const fmt = (date) =>
    date
        ? date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';

const PostScriptDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // route: /postscript/:id

    // 목록 화면에서 넘어온 state(없을 수도 있음)
    const statePost = location.state;

    const [post, setPost] = useState(statePost || null);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // 로그인 사용자 정보 로드(토큰 있으면)
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;
        (async () => {
            try {
                const me = await getMyInfo();
                setCurrentUser(me);
            } catch {
                // ignore
            }
        })();
    }, []);

    // 게시글 + 댓글 조회
    useEffect(() => {
        const load = async () => {
            try {
                // 상세 데이터 (state 없거나 새로고침 대비)
                if (!statePost) {
                    const { data } = await api.get(`/postscript/${id}`);
                    setPost(data);
                }

                // 댓글 목록
                const { data: cmt } = await api.get(`/postscript/${id}/comments`);
                setComments(Array.isArray(cmt) ? cmt : cmt?.content ?? []);
            } catch (e) {
                console.error('후기/댓글 조회 실패:', e);
                alert('게시글을 불러오지 못했습니다.');
                navigate('/postscript');
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddComment = async () => {
        if (!input.trim()) return;

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }

        try {
            await api.post(`/postscript/${id}/comments`, { content: input });
            const { data } = await api.get(`/postscript/${id}/comments`);
            setComments(Array.isArray(data) ? data : data?.content ?? []);
            setInput('');
        } catch (e) {
            console.error('댓글 등록 실패:', e);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    const handleDelete = async (commentId) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/postscript/${id}/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => (c.id ?? c.commentId) !== commentId));
        } catch (e) {
            console.error('댓글 삭제 실패:', e);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleEdit = (commentId, text) => {
        setEditingId(commentId);
        setEditingText(text);
    };

    const handleEditSubmit = async () => {
        if (!editingText.trim()) return;

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/signin');
            return;
        }

        try {
            await api.put(`/postscript/${id}/comments/${editingId}`, { content: editingText });
            setComments((prev) =>
                prev.map((c) =>
                    (c.id ?? c.commentId) === editingId ? { ...c, text: editingText, content: editingText } : c
                )
            );
            setEditingId(null);
            setEditingText('');
        } catch (e) {
            console.error('댓글 수정 실패:', e);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    if (!post) {
        return (
            <div className="postscript-detail-container">
                <p className="not-found-msg">게시글을 불러오는 중입니다...</p>
                <div className="btn-wrapper">
                    <Link to="/postscript" className="btn back-btn">
                        ← 목록으로
                    </Link>
                </div>
            </div>
        );
    }

    const postId = post.id ?? post.postscriptId ?? post.communityNum ?? id;
    const author = post.userNickname || post.writer || post.userName || post.userId || '알 수 없음';
    const created = fmt(parseDate(post.date ?? post.createdAt));

    // 댓글 필드 가변 대응
    const getCmtId = (c) => c.id ?? c.commentId ?? c.commentNum;
    const getCmtAuthor = (c) => c.userNickname || c.userName || c.userId || c.writer || '익명';
    const getCmtText = (c) => c.text ?? c.content ?? '';
    const getCmtTime = (c) => fmt(parseDate(c.time ?? c.commentDate ?? c.createdAt));

    const isMyComment = (c) => {
        if (!currentUser) return false;
        // 백엔드 응답에 따라 userId/username 둘 다 대비
        return (
            currentUser.userId === c.user?.userId ||
            currentUser.userId === c.userId ||
            currentUser.username === c.username ||
            currentUser.userNickname === c.userNickname
        );
    };

    const canEditPost =
        currentUser &&
        (currentUser.userId === post.userId ||
            currentUser.userNickname === post.userNickname ||
            currentUser.username === post.writer);

    return (
        <div className="postscript-detail-container">
            <h2 className="detail-title">{post.title}</h2>
            <p className="detail-writer">작성자: {author}</p>
            <p className="detail-date">{created}</p>
            <hr />
            <p className="detail-content">{post.content}</p>

            {canEditPost && (
                <div className="post-buttons">
                    <button
                        className="btn edit-btn"
                        onClick={() => navigate(`/postscript/${postId}/edit`, { state: post })}
                    >
                        게시글 수정
                    </button>
                    <button
                        className="btn delete-btn"
                        onClick={async () => {
                            if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
                            try {
                                await api.delete(`/postscript/${postId}`);
                                alert('삭제되었습니다.');
                                navigate('/postscript');
                            } catch (e) {
                                console.error('게시글 삭제 실패:', e);
                                alert('게시글 삭제에 실패했습니다.');
                            }
                        }}
                    >
                        게시글 삭제
                    </button>
                </div>
            )}

            <div className="comment-section">
                <h3>댓글</h3>
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
                    <button onClick={handleAddComment}>등록</button>
                </div>

                <ul className="comment-list">
                    {comments.map((c) => {
                        const cid = getCmtId(c);
                        const mine = isMyComment(c);
                        return (
                            <li key={cid} className="comment-item">
                                <div className="comment-meta">
                                    <strong>{getCmtAuthor(c)}</strong>
                                    <span className="comment-time">{getCmtTime(c)}</span>
                                </div>

                                {editingId === cid ? (
                                    <>
                    <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                    />
                                        <button onClick={handleEditSubmit}>저장</button>
                                        <button onClick={() => setEditingId(null)}>취소</button>
                                    </>
                                ) : (
                                    <>
                                        <p>{getCmtText(c)}</p>
                                        {mine && (
                                            <div className="comment-buttons">
                                                <button onClick={() => handleEdit(cid, getCmtText(c))}>수정</button>
                                                <button onClick={() => handleDelete(cid)}>삭제</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="btn-wrapper">
                <Link to="/postscript" className="btn back-btn">
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
};

export default PostScriptDetail;

