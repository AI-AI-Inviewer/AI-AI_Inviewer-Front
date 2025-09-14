import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../scss/FeedBack.scss';

const FeedBack = ({ isLoggedIn }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [nowPage, setNowPage] = useState(1);
    const rowSize = 10;

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;     // 1-based in UI
        const search = searchParams.get('searchKey') || '';
        setNowPage(page);
        setSearchKey(search);

        const fetchFeedbacks = async () => {
            try {
                const apiPage = Math.max(0, page - 1);                // ✅ 0-based for backend
                const res = await axios.get('http://localhost:10000/api/community', {
                    params: {
                        page: apiPage,
                        size: rowSize,                                    // ✅ 페이지 크기 명시
                        searchKey: search                                 // ❗백엔드 파라미터명이 다르면 맞춰주세요 (e.g., keyword)
                    }
                });



                if (res.data?.content) {
                    setFeedbacks(res.data.content);
                    setTotalCount(res.data.totalElements ?? res.data.total_count ?? 0);
                } else if (Array.isArray(res.data?.list)) {           // 혹시 list/totalCount 형태면
                    setFeedbacks(res.data.list);
                    setTotalCount(res.data.totalCount ?? res.data.total_count ?? res.data.list.length);
                } else if (Array.isArray(res.data)) {
                    setFeedbacks(res.data);
                    setTotalCount(res.data.length);
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
            const [y, M, d, h = 0, m = 0, s = 0, ns = 0] = v;
            return new Date(y, M - 1, d, h, m, s, Math.floor(ns / 1e6));
        }
        return new Date(v);
    };

    const realEndPage = Math.ceil(totalCount / rowSize);
    const startPage = Math.floor((nowPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, realEndPage);

    return (
        <div className="feedback-container">
            <h2 className="board-title">자유 게시판</h2>
            <form onSubmit={handleSearchSubmit} className="search-container">
                <input
                    type="search"
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
                <button type="submit" className="btn search-btn">검색</button>
            </form>

            <table className="table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.length > 0 ? (
                    feedbacks.map((fb, index) => {
                        const dt = parseDate(fb.createdAt);  // createdAt 사용
                        return (
                            <tr key={fb.communityNum}>
                                <td>{(totalCount - ((nowPage - 1) * rowSize)) - index}</td>
                                <td>
                                    <Link to={`/feedback/${fb.communityNum}`} state={fb}>
                                        {fb.title}
                                    </Link>
                                </td>
                                <td>{fb.userNickname || fb.userName || fb.userId || '알 수 없음'}</td>
                                <td>{dt ? dt.toLocaleDateString() : '-'}</td>
                                <td>{fb.viewCount}</td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="5">게시글이 없습니다.</td>
                    </tr>
                )}
                </tbody>

            </table>

            <div className="pagination">
                {startPage > 1 && (
                    <Link to={`?page=${startPage - 1}&searchKey=${searchKey}`} className="btn page-btn">이전</Link>
                )}
                {[...Array(endPage - startPage + 1)].map((_, i) => {
                    const pageNum = startPage + i;
                    return (
                        <Link
                            key={pageNum}
                            to={`?page=${pageNum}&searchKey=${searchKey}`}
                            className={`btn page-btn ${pageNum === nowPage ? 'active' : ''}`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
                {endPage < realEndPage && (
                    <Link to={`?page=${endPage + 1}&searchKey=${searchKey}`} className="btn page-btn">다음</Link>
                )}
            </div>

            {isLoggedIn && (
                <div className="write-button-container">
                    <Link to="/feedback/write" className="btn write-btn">글쓰기</Link>
                </div>
            )}
        </div>
    );
};

export default FeedBack;
