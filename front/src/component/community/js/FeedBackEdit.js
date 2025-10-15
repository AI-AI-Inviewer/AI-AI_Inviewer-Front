import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import '../scss/FeedBackEdit.scss'; // ✨ 이 파일에 스타일 있음

// JWT에서 클레임 추출
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

const FeedBackEdit = ({ isLoggedIn, currentUser }) => {
    const { communityNum } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(location.state || null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [resume, setResume] = useState('');

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

    // 최초 로드: state 없으면 서버에서 다시 가져오기
    useEffect(() => {
        (async () => {
            try {
                if (!post) {
                    const { data } = await api.get(`/community/${communityNum}`); // 상세 GET (서버에서 조회수 +1)
                    setPost(data);
                    setTitle(data.title ?? '');
                    setContent(data.content ?? '');
                    setResume(data.resume ?? '');
                } else {
                    setTitle(post.title ?? '');
                    setContent(post.content ?? '');
                    setResume(post.resume ?? '');
                }
            } catch (err) {
                console.error('게시글 불러오기 실패:', err);
                alert('게시글 정보를 불러오지 못했습니다.');
                navigate(`/feedback/${communityNum}`, { replace: true });
                return;
            } finally {
                setLoading(false);
            }
        })();
    }, [communityNum, navigate, post]);

    // 작성자만 접근 허용 (프론트 UX 가드)
    useEffect(() => {
        if (!loading && (!isLoggedIn || !isPostAuthor)) {
            alert('작성자만 수정할 수 있습니다.');
            navigate(`/feedback/${communityNum}`, { replace: true });
        }
    }, [loading, isLoggedIn, isPostAuthor, navigate, communityNum]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해 주세요.');
            return;
        }
        try {
            await api.put(`/community/${communityNum}`, {
                title: title.trim(),
                content: content.trim(),
                resume: resume ?? '',
            });
            alert('수정되었습니다.');
            navigate(`/feedback/${communityNum}`, { replace: true });
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
                <p className="not-found-msg">게시글 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="feedback-detail-container">{/* ← 기존 클래스 유지 (SCSS에서 함께 처리) */}
            <h2 className="detail-title">게시글 수정</h2>

            <form onSubmit={handleSubmit} className="edit-form">{/* ← 기존 클래스 유지 */}
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
                        maxLength={1000}
                        required
                    />
                </label>


                <div className="detail-actions">
                    <button type="submit" className="btn" style={{ minWidth: 120, marginRight: 8 }}>
                        저장
                    </button>
                    <Link to={`/feedback/${communityNum}`} className="btn">
                        취소
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default FeedBackEdit;
