// src/component/community/js/PostScript.js
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../scss/PostScript.scss';
import api from '../../../api/axiosInstance';

const PostScript = ({ isLoggedIn }) => {
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchKey, setSearchKey] = useState('');
    const [nowPage, setNowPage] = useState(1);
    const rowSize = 10;

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ prop이 없으면 localStorage 토큰으로 대체
    const authed = isLoggedIn ?? Boolean(localStorage.getItem('jwtToken'));

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const search = searchParams.get('searchKey') || '';
        setNowPage(page);
        setSearchKey(search);

        const fetchList = async () => {
            try {
                const apiPage = Math.max(0, page - 1);
                const url = search ? '/postscript/search' : '/postscript';
                const params = search
                    ? { keyword: search, page: apiPage, size: rowSize }
                    : { page: apiPage, size: rowSize };

                const { data } = await api.get(url, { params });

                if (data?.content) {
                    setItems(data.content);
                    setTotalCount(data.totalElements ?? 0);
                } else if (Array.isArray(data)) {
                    setItems(data);
                    setTotalCount(data.length);
                } else {
                    setItems([]);
                    setTotalCount(0);
                }
            } catch (e) {
                console.error('면접 후기 목록 불러오기 실패:', e);
                setItems([]);
                setTotalCount(0);
            }
        };

        fetchList();
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ page: 1, searchKey });
    };

    const getId = (it) =>
        it.postscriptNum ?? it.id ?? it.postscriptId ?? it.communityNum;

    const parseDate = (v) => {
        if (!v) return null;
        // Spring LocalDateTime 배열 대응: [y,M,d,h,m,s(,n)]
        if (Array.isArray(v)) {
            const [y, M, d, h = 0, m = 0, s = 0] = v;
            return new Date(y, (M ?? 1) - 1, d ?? 1, h, m, s);
        }
        return new Date(v);
    };

    const realEndPage = Math.ceil(totalCount / rowSize);
    const startPage = Math.floor((nowPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, realEndPage);

    return (
        <div className="postscript-container">
            <h2 className="board-title">면접 후기 게시판</h2>

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

            {/* 한 줄 리스트 */}
            <div className="postscript-list">
                {items.length > 0 ? (
                    items.map((ps) => {
                        const id = getId(ps);
                        const dt = parseDate(ps.createdAt);
                        const author = ps.userNickname || ps.userName || ps.userId || '알 수 없음';
                        const dateStr = dt ? dt.toLocaleDateString() : '-';
                        const views = ps.viewCount ?? 0;

                        return (
                            <Link
                                key={id}
                                to={`/postscript/${id}`}
                                state={ps}
                                className="postscript-row"
                            >
                                <div className="row-title">{ps.title}</div>
                                <div className="row-meta">
                                    <span className="author">{author}</span>
                                    <span className="date">{dateStr}</span>
                                    <span className="views">조회 {views}</span>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p className="no-posts">등록된 후기가 없습니다.</p>
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
            {authed && (
                <Link to="/postscript/write" className="write-btn" aria-label="글쓰기">
                    +
                </Link>
            )}
        </div>
    );
};

export default PostScript;
