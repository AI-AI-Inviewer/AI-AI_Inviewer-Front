// src/component/community/js/FeedBack.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../../api/axiosInstance'; // ← 공통 axios 인스턴스
import '../scss/FeedBack.scss';

const FeedBack = ({ isLoggedIn }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [nowPage, setNowPage] = useState(1);
    const rowSize = 10;

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const search = searchParams.get('searchKey') || '';
        setNowPage(page);
        setSearchKey(search);

        const fetchFeedbacks = async () => {
            try {
                const apiPage = Math.max(0, page - 1);
                const { data } = await api.get('/community', {
                    params: { page: apiPage, size: rowSize, searchKey: search },
                });

                if (data?.content) {
                    setFeedbacks(data.content);
                    setTotalCount(data.totalElements ?? 0);
                } else if (Array.isArray(data)) {
                    setFeedbacks(data);
                    setTotalCount(data.length);
                } else {
                    setFeedbacks([]);
                    setTotalCount(0);
                }
            } catch (err) {
                console.error('게시글 불러오기 오류:', err);
                alert('게시글 목록을 불러오는데 실패했습니다.');
            }
        };

        fetchFeedbacks();
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ page: 1, searchKey });
    };

    const parseDate = (v) => {
        if (!v) return null;
        if (Array.isArray(v)) {
            const [y, M, d, h = 0, m = 0] = v;
            return new Date(y, M - 1, d, h, m);
        }
        return new Date(v);
    };

    const realEndPage = Math.ceil(totalCount / rowSize);
    const startPage = Math.floor((nowPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, realEndPage);

    return (
        <div className="feedback-container">
            <h2 className="board-title">자유 게시판</h2>

            {/* 검색 */}
            <form onSubmit={handleSearchSubmit} className="search-container">
                <input
                    type="search"
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <button type="submit" className="search-btn">검색</button>
            </form>

            {/* 게시글 카드 리스트 */}
            <div className="feedback-list">
                {feedbacks.length > 0 ? (
                    feedbacks.map((fb) => {
                        const dt = parseDate(fb.createdAt);
                        return (
                            <Link
                                key={fb.communityNum}
                                to={`/feedback/${fb.communityNum}`}
                                state={fb}
                                className="feedback-card"
                            >
                                <div className="card-title">{fb.title}</div>
                                <div className="card-meta">
                                    <span className="author">{fb.userNickname || fb.userName || fb.userId || '알 수 없음'}</span>
                                    <span className="date">{dt ? dt.toLocaleDateString() : '-'}</span>
                                    <span className="views">조회 {fb.viewCount}</span>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p className="no-posts">게시글이 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination">
                {startPage > 1 && (
                    <Link to={`?page=${startPage - 1}&searchKey=${searchKey}`} className="page-btn">이전</Link>
                )}
                {[...Array(endPage - startPage + 1)].map((_, i) => {
                    const pageNum = startPage + i;
                    return (
                        <Link
                            key={pageNum}
                            to={`?page=${pageNum}&searchKey=${searchKey}`}
                            className={`page-btn ${pageNum === nowPage ? 'active' : ''}`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
                {endPage < realEndPage && (
                    <Link to={`?page=${endPage + 1}&searchKey=${searchKey}`} className="page-btn">다음</Link>
                )}
            </div>

            {/* 글쓰기 버튼 */}
            {isLoggedIn && <Link to="/feedback/write" className="write-btn">+</Link>}
        </div>
    );
};

export default FeedBack;

