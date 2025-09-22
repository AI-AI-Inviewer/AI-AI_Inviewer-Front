// src/component/cl/js/AiInviewer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/AiInviewer.scss';

const categories = ['전체', 'AI', 'Web', 'Platform', 'Portal', 'Finance'];

const companies = [
    {
        name: 'OpenAI',
        category: 'AI',
        description:
            '대규모 언어모델(LLM)과 멀티모달 AI를 선도하는 연구·제품화 기업. ChatGPT, API 등으로 개발 생태계를 확장 중.',
        code: '// OpenAI 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    },
    {
        name: 'Google',
        category: 'Web',
        description:
            '검색·광고·클라우드·Android를 아우르는 글로벌 빅테크. 검색 품질, 웹 플랫폼 표준, 브라우저(Chrome) 생태계 기여로 유명.',
        code: '// Google 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    },
    {
        name: 'Samsung',
        category: 'Platform',
        description:
            '반도체·모바일·가전을 아우르는 하드웨어 리더. One UI와 스마트싱스 등으로 디바이스 연동 경험을 확장.',
        code: '// Samsung 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    },
    {
        name: 'LG',
        category: 'Platform',
        description:
            '가전과 디스플레이 분야 글로벌 리더. webOS, ThinQ 등 자체 플랫폼을 통한 생태계 확장에 주력.',
        code: '// LG 예시 코드',
        logo: 'https://cdn.worldvectorlogo.com/logos/lg-electronics.svg',
    },
    {
        name: 'Naver',
        category: 'Portal',
        description:
            '검색·뉴스·쇼핑·웹툰 등 다양한 서비스를 제공하는 국내 대표 포털. 클라우드·AI·핀테크로도 확장 중.',
        code: '// Naver 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Naver_Logotype.svg',
    },
    {
        name: 'Kakao',
        category: 'Portal',
        description:
            '카카오톡 메신저를 기반으로 한 슈퍼앱 생태계. 금융·모빌리티·엔터테인먼트까지 확장 중.',
        code: '// Kakao 예시 코드',
        logo: 'https://cdn.worldvectorlogo.com/logos/kakao.svg',
    },
];


const AiInviewer = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchText, setSearchText] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [bookmarkActive, setBookmarkActive] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);

    // 필터링: 카테고리 + 검색 + 즐겨찾기
    const filteredCompanies = companies.filter((company) => {
        const categoryMatch = selectedCategory === '전체' || company.category === selectedCategory;
        const searchMatch = company.name.toLowerCase().includes(searchText.toLowerCase());
        const bookmarkMatch = !bookmarkActive || bookmarks.includes(company.name);
        return categoryMatch && searchMatch && bookmarkMatch;
    });

    const handleStartInterview = () => {
        if (selectedCompany) {
            navigate('/interview', {
                state: {
                    company: selectedCompany.name, // ✅ 회사명 전달 (Interview.js에서 회사별 프롬프트 구성)
                    initialCode: selectedCompany.code,
                    codeIndex: companies.indexOf(selectedCompany),
                    // resumeSummary는 필요 시 다른 페이지에서 함께 넘겨도 됩니다.
                },
            });
        }
    };

    const toggleBookmark = () => setBookmarkActive((v) => !v);

    const toggleCompanyBookmark = (companyName) => {
        setBookmarks((prev) =>
            prev.includes(companyName) ? prev.filter((n) => n !== companyName) : [...prev, companyName]
        );
    };

    return (
        <div className="aiinviewer-wrapper">
            <aside className="aiinviewer-sidebar">
                <input
                    type="text"
                    placeholder="회사 검색"
                    className="sidebar-search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="category-select">
                    <label htmlFor="category">카테고리</label>
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

            <main className="aiinviewer-main">
                <h2>AI 면접 기업 목록</h2>
                <div className="company-grid">
                    {filteredCompanies.map((company) => (
                        <div
                            key={company.name}
                            className="company-box"
                            onClick={() => setSelectedCompany(company)}
                        >
                            <img src={company.logo} alt={company.name} className="company-logo" />
                            <span>{company.name}</span>
                            <button
                                className={`bookmark-toggle ${bookmarks.includes(company.name) ? 'bookmarked' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCompanyBookmark(company.name);
                                }}
                            >
                                {bookmarks.includes(company.name) ? '★' : '☆'}
                            </button>
                        </div>
                    ))}
                </div>

                {selectedCompany && (
                    <div className="company-modal">
                        <div className="modal-content">
                            <img
                                src={selectedCompany.logo}
                                alt={selectedCompany.name}
                                className="modal-logo"
                            />
                            <h3>{selectedCompany.name}</h3>
                            <p>{selectedCompany.description}</p>
                            <button onClick={handleStartInterview} className="interview-btn">
                                AI 면접으로 이동
                            </button>
                            <button onClick={() => setSelectedCompany(null)} className="close-btn">
                                닫기
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AiInviewer;
