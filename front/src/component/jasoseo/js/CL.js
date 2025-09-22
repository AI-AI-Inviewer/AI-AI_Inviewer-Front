import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../scss/CL.scss';

// 카테고리 목록 (데이터에 맞춰 추가)
const categories = ['전체', '개발', '기획', '마케팅', '디자인', '영업', '데이터'];

// 데이터 샘플 확장 및 'category' 필드 추가
const coverLetters = [
    {id: 1, title: "[개발] 백엔드 신입 개발자 자소서", content: "마이크로서비스 아키텍처 경험을 강조한 백엔드 개발자 자소서 샘플입니다.", date: "2025-06-15", writer: "dev_master", category: "개발", file: "#"},
    {id: 2, title: "[기획] 신사업 기획자 자소서", content: "시장 분석과 데이터 기반 의사결정 능력을 어필한 기획 직무 자소서 샘플입니다.", date: "2025-06-01", writer: "planner_lee", category: "기획", file: "#"},
    {id: 3, title: "[마케팅] 퍼포먼스 마케터 자소서", content: "ROAS 300% 달성 경험을 중심으로 작성된 마케팅 직무 자소서 샘플입니다.", date: "2025-05-28", writer: "market_king", category: "마케팅", file: "#"},
    {id: 4, title: "[디자인] UX/UI 디자이너 자소서", content: "사용자 중심 디자인 프로세스 개선 경험을 담은 디자인 직무 자소서 샘플입니다.", date: "2025-06-10", writer: "design_park", category: "디자인", file: "#"},
    {id: 5, title: "[영업] B2B 솔루션 영업 자소서", content: "주요 고객사 수주 성공 사례를 중심으로 작성된 영업 직무 자소서 샘플입니다.", date: "2025-06-05", writer: "sales_kim", category: "영업", file: "#"},
    {id: 6, title: "[데이터] 데이터 분석가 자소서", content: "Python과 SQL을 활용한 고객 이탈 예측 모델 개발 경험을 서술했습니다.", date: "2025-06-20", writer: "data_analyst", category: "데이터", file: "#"},
    {id: 7, title: "[개발] 프론트엔드 신입 자소서 (React)", content: "React 기반의 인터랙티브 웹 개발 프로젝트 경험을 강조한 자소서입니다.", date: "2025-06-18", writer: "react_love", category: "개발", file: "#"},
    {id: 8, title: "[기획] 서비스 기획 인턴 자소서", content: "사용자 인터뷰와 경쟁사 분석을 통해 신규 기능을 제안한 경험을 담았습니다.", date: "2025-06-22", writer: "intern_kim", category: "기획", file: "#"},
    {id: 9, title: "[마케팅] 콘텐츠 마케터 인턴 자소서", content: "SNS 채널 성장 및 콘텐츠 제작 경험을 중심으로 작성되었습니다.", date: "2025-06-25", writer: "contents_joy", category: "마케팅", file: "#"},
    {id: 10, title: "[개발] 안드로이드 개발자 경력 자소서", content: "Kotlin 기반 앱 성능 최적화 및 신규 기능 개발 리딩 경험을 어필했습니다.", date: "2025-07-01", writer: "android_pro", category: "개발", file: "#"},
];


const CL = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchText, setSearchText] = useState('');
    const [bookmarkActive, setBookmarkActive] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);

    // 필터링 로직: 카테고리 + 검색어 + 즐겨찾기
    const filteredCl = coverLetters.filter((cl) => {
        const categoryMatch = selectedCategory === '전체' || cl.category === selectedCategory;
        const searchMatch = cl.title.toLowerCase().includes(searchText.toLowerCase());
        const bookmarkMatch = !bookmarkActive || bookmarks.includes(cl.id);
        return categoryMatch && searchMatch && bookmarkMatch;
    });

    const toggleBookmark = () => setBookmarkActive(!bookmarkActive);

    const toggleItemBookmark = (clId) => {
        if (bookmarks.includes(clId)) {
            setBookmarks(bookmarks.filter((id) => id !== clId));
        } else {
            setBookmarks([...bookmarks, clId]);
        }
    };

    return (
        <div className="cl-wrapper">
            <aside className="cl-sidebar">
                <input
                    type="text"
                    placeholder="자소서 제목 검색"
                    className="sidebar-search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="category-select">
                    <label htmlFor="category">직무 카테고리</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className={`bookmark-btn ${bookmarkActive ? 'active' : ''}`}
                    onClick={toggleBookmark}
                >
                    {bookmarkActive ? '★ 즐겨찾기만 보기' : '⭐ 즐겨찾기'}
                </button>
            </aside>

            <main className="cl-main">
                <h2>자소서 샘플 목록</h2>
                <div className="cl-grid">
                    {filteredCl.map((item) => (
                        <div key={item.id} className="cl-card-wrapper">
                            <Link to={`/cl/${item.id}`} state={item} className="cl-card">
                                <div className="cl-card-title">{item.title}</div>
                                <div className="cl-card-info">
                                    <span>{item.category}</span>
                                    <span>{item.date}</span>
                                </div>
                            </Link>
                            <button
                                className={`bookmark-toggle ${
                                    bookmarks.includes(item.id) ? 'bookmarked' : ''
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Link 이동 방지
                                    toggleItemBookmark(item.id);
                                }}
                            >
                                {bookmarks.includes(item.id) ? '★' : '☆'}
                            </button>
                        </div>
                    ))}
                </div>
                {filteredCl.length === 0 && (
                    <div className="no-results">
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CL;