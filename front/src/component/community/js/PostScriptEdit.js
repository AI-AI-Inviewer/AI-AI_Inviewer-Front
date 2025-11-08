// src/component/community/js/PostScriptEdit.js
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import '../scss/FeedBackEdit.scss'; // 기존 상세/수정 스타일 재사용

/* ------------------------------ JWT Utilities ----------------------------- */
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
const norm = (x) => (x ?? '').toString().trim().toLowerCase();

/* ------------------------------- Edit Screen ------------------------------ */
const PostScriptEdit = ({ isLoggedIn, currentUser }) => {
    // 라우트: /postscript/:postscriptNum/edit
    const { postscriptNum, id } = useParams();
    const psId = postscriptNum ?? id;
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(location.state || null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 내 정보 (작성자 체크용)
    const me = useMemo(() => {
        const claims = getClaimsFromJwt();
        const myId =
            currentUser?.userId ??
            currentUser?.username ??
            claims.userId ??
            claims.username ??
            claims.sub ??
            claims.email ??
            null;
        const myNick = currentUser?.userNickname ?? claims.userNickname ?? claims.name ?? null;
        return { id: norm(myId), nick: norm(myNick) };
    }, [currentUser]);

    const isPostAuthor = useMemo(() => {
        if (!post) return false;
        const postId = norm(post.userId ?? post.user?.userId ?? '');
        const postNick = norm(
            post.userNickname ?? post.userName ?? post.user?.userNickname ?? post.user?.userName ?? '',
        );
        return (me.id && postId && me.id === postId) || (me.nick && postNick && me.nick === postNick);
    }, [post, me]);

    // 최초 로드: 상태 없으면 서버에서 상세 가져오기 (조회수 증가 없는 get() API가 있으면 그걸로 교체해도 OK)
    useEffect(() => {
        (async () => {
            try {
                if (!post) {
                    const { data } = await api.get(`/postscript/${psId}`);
                    setPost(data);
                    setTitle(data.title ?? '');
                    setContent(data.content ?? '');
                } else {
                    setTitle(post.title ?? '');
                    setContent(post.content ?? '');
                }
            } catch (err) {
                console.error('면접후기 불러오기 실패:', err);
                alert('면접후기 정보를 불러오지 못했습니다.');
                navigate(`/postscript/${psId}`, { replace: true });
                return;
            } finally {
                setLoading(false);
            }
        })();
    }, [psId, navigate, post]);

    // 작성자만 접근 허용 (프론트 UX 가드)
    useEffect(() => {
        const authed = isLoggedIn || !!localStorage.getItem('jwtToken');
        if (!loading && (!authed || !isPostAuthor)) {
            alert('작성자만 수정할 수 있습니다.');
            navigate(`/postscript/${psId}`, { replace: true });
        }
    }, [loading, isLoggedIn, isPostAuthor, navigate, psId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해 주세요.');
            return;
        }
        try {
            await api.put(`/postscript/${psId}`, {
                title: title.trim(),
                content: content.trim(),
            });
            alert('수정되었습니다.');
            navigate(`/postscript/${psId}`, { replace: true });
        } catch (err) {
            console.error('수정 실패:', err);
            const msg =
                err.response?.data?.message ??
                (err.request ? '서버 응답이 없습니다.' : `요청 실패: ${err.message}`);
            alert(msg);
        }
    };

    if (loading) {
        return (
            <div className="feedback-detail-container">
                <p className="not-found-msg">면접후기 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="feedback-detail-container">
            <h2 className="detail-title">면접후기 수정</h2>

            <form onSubmit={handleSubmit} className="edit-form">
                <label className="edit-label">
                    제목
                    <input
                        type="text"
                        className="edit-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                        required
                    />
                </label>

                <label className="edit-label">
                    내용
                    <textarea
                        className="edit-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        maxLength={2000}
                        required
                    />
                </label>

                <div className="detail-actions">
                    <button type="submit" className="btn" style={{ minWidth: 120, marginRight: 8 }}>
                        저장
                    </button>
                    <Link to={`/postscript/${psId}`} className="btn">
                        취소
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default PostScriptEdit;
