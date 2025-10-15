import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/AiInviewer.scss';

const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충청', '전라', '경상', '제주'];

const categories = [
    '기획·전략',
    '마케팅·홍보·조사',
    '회계·세무·재무',
    '인사·노무·HRD',
    '총무·법무·사무',
    'IT개발·데이터',
    '디자인',
    '영업·판매·무역',
    '고객상담·TM',
    '구매·자재·물류',
    '상품기획·MD',
    '운전·운송·배송',
    '서비스',
    '생산',
    '건설·건축',
    '의료',
    '연구·R&D',
    '교육',
    '미디어·문화·스포츠',
    '금융·보험',
    '공공·복지',
];

const companies = [
    {
        name: 'OpenAI',
        category: 'IT개발·데이터',
        region: '서울',
        description: '대규모 언어모델(LLM)과 멀티모달 AI를 선도하는 글로벌 기업.',
        code: '// OpenAI 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    },
    {
        name: 'Samsung',
        category: '생산',
        region: '경기',
        description: '반도체, 모바일, 가전 등 다양한 디바이스 생태계를 구축한 글로벌 하드웨어 기업.',
        code: '// Samsung 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    },
    {
        name: 'Naver',
        category: '마케팅·홍보·조사',
        region: '경기',
        description: '검색, 뉴스, 쇼핑 등 다양한 서비스를 제공하는 국내 대표 포털 기업.',
        code: '// Naver 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Naver_Logotype.svg',
    },
    {
        name: 'Kakao',
        category: '마케팅·홍보·조사',
        region: '제주',
        description: '카카오톡 기반 슈퍼앱 생태계를 구축한 플랫폼 기업.',
        code: '// Kakao 예시 코드',
        logo: 'https://cdn.worldvectorlogo.com/logos/kakao.svg',
    },
];

const AiInviewer = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('직무');
    const [category, setCategory] = useState('');
    const [region, setRegion] = useState('');
    const [search, setSearch] = useState('');
    const [bookmarks, setBookmarks] = useState([]);
    const [showBookmarkOnly, setShowBookmarkOnly] = useState(false);

    const filtered = companies.filter((c) => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        const matchRegion = region === '' || c.region === region;
        const matchCategory = category === '' || c.category === category;
        const matchBookmark = !showBookmarkOnly || bookmarks.includes(c.name);
        return matchSearch && matchRegion && matchCategory && matchBookmark;
    });

    const handleInterview = (company) => {
        navigate('/interview', {
            state: { company: company.name, initialCode: company.code },
        });
    };

    const toggleBookmark = (name) => {
        setBookmarks((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    return (
        <div className="aiinviewer-wrapper">
            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="회사명을 검색하세요"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className={`bookmark-btn ${showBookmarkOnly ? 'active' : ''}`}
                    onClick={() => setShowBookmarkOnly((v) => !v)}
                >
                    {showBookmarkOnly ? '★ 즐겨찾기만 보기' : '⭐ 즐겨찾기'}
                </button>
            </div>

            {/* ====== 필터 탭 ====== */}
            <div className="filter-tabs">
                <button
                    className={tab === '지역' ? 'active' : ''}
                    onClick={() => setTab('지역')}
                >
                    지역 선택
                </button>
                <button
                    className={tab === '직무' ? 'active' : ''}
                    onClick={() => setTab('직무')}
                >
                    직무 선택
                </button>
            </div>

            {/* ====== 지역 / 직무 필터 박스 ====== */}
            {tab === '지역' ? (
                <div className="job-category-box">
                    {regions.map((r) => (
                        <button
                            key={r}
                            className={`job-btn ${region === r ? 'active' : ''}`}
                            onClick={() => setRegion(region === r ? '' : r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="job-category-box">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`job-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(category === cat ? '' : cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* ====== 회사 리스트 ====== */}
            <div className="company-grid">
                {filtered.length > 0 ? (
                    filtered.map((c) => (
                        <div key={c.name} className="company-card">
                            <div className="company-top">
                                <img src={c.logo} alt={c.name} />
                                <div className="info">
                                    <h3>{c.name}</h3>
                                    <p>{c.description}</p>
                                </div>
                            </div>
                            <div className="company-bottom">
                <span className="badge">
                  {c.region} · {c.category}
                </span>
                                <div className="actions">
                                    <button className="interview-btn" onClick={() => handleInterview(c)}>
                                        AI 면접 시작
                                    </button>
                                    <button
                                        className="bookmark-toggle"
                                        onClick={() => toggleBookmark(c.name)}
                                    >
                                        {bookmarks.includes(c.name) ? '★' : '☆'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-result">조건에 맞는 회사가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default AiInviewer;
