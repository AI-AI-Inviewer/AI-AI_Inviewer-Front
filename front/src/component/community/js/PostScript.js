// src/component/community/js/PostScript.js
import React, { useEffect, useState } from 'react';
import '../scss/PostScript.scss';
import { Link } from 'react-router-dom';
import api from '../../../api/axiosInstance';

const PostScript = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 서버에서 후기 목록 조회
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 백엔드 엔드포인트 예: GET /api/postscript
                const { data } = await api.get('/postscript');
                // 배열/페이지네이션 모두 대응
                const list = Array.isArray(data) ? data : data?.content ?? [];
                setItems(list);
            } catch (e) {
                console.error('면접 후기 목록 불러오기 실패:', e);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const getId = (it) => it.id ?? it.postscriptId ?? it.communityNum;
    const getDate = (it) => it.date ?? it.createdAt ?? '-';

    if (loading) {
        return (
            <div className="postscript-container">
                <h2>면접 후기 게시판</h2>
                <p>불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="postscript-container">
            <h2>면접 후기 게시판</h2>
            {items.length === 0 ? (
                <p>등록된 후기가 없습니다.</p>
            ) : (
                <ul className="postscript-list">
                    {items.map((ps) => (
                        <li key={getId(ps)} className="postscript-item">
                            <Link
                                to={`/postscript/${getId(ps)}`}
                                state={ps}
                                className="postscript-title-link"
                            >
                                <div className="postscript-title">{ps.title}</div>
                                <div className="postscript-date">{getDate(ps)}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <div className="postscript-btn-wrapper bottom">
                <Link
                    to="/postscript/write"
                    className="btn amado-btn"
                    style={{ marginBottom: '1rem', display: 'inline-block' }}
                >
                    글쓰기
                </Link>
            </div>
        </div>
    );
};

export default PostScript;

