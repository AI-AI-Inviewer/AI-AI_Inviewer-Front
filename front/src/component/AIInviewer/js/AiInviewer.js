import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/AiInviewer.scss";
import companies, { regions } from "../data/Companies.js";

// 면접 방식 선택 모달 (닫기 버튼 제거, ESC/배경 클릭으로만 종료)
const ModeSelectModal = ({ open, company, onClose, onSelect }) => {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="mode-modal-backdrop" onClick={onClose}>
            <div
                className="mode-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mode-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="mode-modal-title">면접 방식 선택</h3>
                <p>
                    <strong>{company?.name}</strong> 면접을 어떤 방식으로 진행할까요?
                </p>
                <div className="mode-actions">
                    <button onClick={() => onSelect('chat')}>💬 채팅 면접</button>
                    <button onClick={() => onSelect('voice')}>🎙️ 음성 아바타 면접</button>
                </div>
            </div>
        </div>
    );
};

// 상세 직무 필터용 카테고리 데이터
const jobCategories = {
    "기획·전략": { "전략 컨설턴트": ["전체", "M&A"], "사업기획": ["전체", "신사업 개발"], "데이터분석가": ["전체", "고객 데이터"] },
    "법률·사무·총무": { "변호사": ["전체", "M&A 자문"], "사내 변호사": ["전체", "컴플라이언스"], "총무": ["전체", "자산관리"] },
    "인사·HR": { "인사담당자": ["전체", "HRM/HRD"], "채용담당자": ["전체", "Tech Recruiting"] },
    "마케팅·광고·MD": { "브랜드 마케터": ["전체", "FMCG"], "퍼포먼스 마케터": ["전체", "데이터 분석"], "MD": ["전체", "패션/잡화"] },
    "디자인": { "UX/UI 디자이너": ["전체", "UX 리서치"], "BX 디자이너": ["전체", "브랜딩"], "그래픽 디자이너": ["전체", "편집디자인"] },
    "AI·개발·데이터": { "백엔드개발자": ["전체", "Java"], "프론트엔드개발자": ["전체", "React"], "웹개발자": ["전체", "Node.js"], "AI 엔지니어": ["전체", "머신러닝"] },
};

const AiInviewer = ({ bookmarks, setBookmarks }) => {
    const navigate = useNavigate();

    // --- 상태 관리 ---
    const [tab, setTab] = useState('직무');
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

    // 지역 필터 상태
    const [selectedRegion, setSelectedRegion] = useState('');

    // 상세 직무 필터 상태
    const [selectedL1, setSelectedL1] = useState("AI·개발·데이터");
    const [selectedL2, setSelectedL2] = useState(null);
    const [selectedL3, setSelectedL3] = useState(null);
    const [selectedJobFilters, setSelectedJobFilters] = useState([]);

    // 모달 상태
    const [modeOpen, setModeOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    // --- 데이터 계산 및 필터링 ---
    const categoryCounts = useMemo(() => {
        const counts = {};
        companies.forEach(company => {
            counts[company.field] = (counts[company.field] || 0) + 1;
        });
        return counts;
    }, []);

    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            const searchMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
            const bookmarkMatch = !showOnlyBookmarks || bookmarks.includes(company.name);
            const regionMatch = selectedRegion === '' || company.region === selectedRegion;
            const jobMatch = selectedJobFilters.length === 0 || selectedJobFilters.includes(company.field);
            return searchMatch && bookmarkMatch && regionMatch && jobMatch;
        });
    }, [searchTerm, showOnlyBookmarks, bookmarks, selectedRegion, selectedJobFilters]);

    // --- 핸들러 함수 ---
    const handleTabSelect = (selectedTab) => {
        setTab(selectedTab);
        setSelectedRegion('');
        setSelectedL1(null);
        setSelectedL2(null);
        setSelectedL3(null);
        setSelectedJobFilters([]);
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(prev => prev === region ? '' : region);
    };

    const handleL1Select = (item) => {
        setSelectedL1(item);
        setSelectedL2(null);
        setSelectedL3(null);
        setSelectedJobFilters([]);
    };

    const handleL2Select = (item) => {
        setSelectedL2(item);
        setSelectedL3(null);
        setSelectedJobFilters([item]);
    };

    const handleL3Select = (item) => {
        setSelectedL3(item);
    };

    const toggleBookmark = (name) => {
        setBookmarks((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
    };

    const openModeModal = (company) => {
        setSelectedCompany(company);
        setModeOpen(true);
    };

    const handleSelectMode = (mode) => {
        setModeOpen(false);
        if (!selectedCompany) return;
        const route = mode === 'chat' ? '/Interview' : '/VoiceInterview';
        navigate(route, { state: { company: selectedCompany.name } });
    };

    return (
        <div className="aiinviewer-container">
            <ModeSelectModal
                open={modeOpen}
                company={selectedCompany}
                onClose={() => setModeOpen(false)}
                onSelect={handleSelectMode}
            />

            <div className="search-reset-bar">
                <div className="search-box-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24">
                        <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A8 8 0 1 0 10 18zm0-14a6 6 0 1 1-6 6 6 6 0 0 1 6-6z"></path>
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="기업명을 검색하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className={`bookmark-btn ${showOnlyBookmarks ? 'active' : ''}`}
                    onClick={() => setShowOnlyBookmarks(v => !v)}
                >
                    {showOnlyBookmarks ? '★ 즐겨찾기만' : '⭐ 전체 보기'}
                </button>
            </div>

            <div className="filter-tabs">
                <button className={tab === '직무' ? 'active' : ''} onClick={() => handleTabSelect('직무')}>직무</button>
                <button className={tab === '지역' ? 'active' : ''} onClick={() => handleTabSelect('지역')}>지역</button>
            </div>

            {tab === '직무' && (
                <div className="filter-container">
                    <div className="category-column">
                        <ul>
                            {Object.keys(jobCategories).map(item => (
                                <li
                                    key={item}
                                    className={selectedL1 === item ? "active" : ""}
                                    onClick={() => handleL1Select(item)}
                                >
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="category-column">
                        {selectedL1 && jobCategories[selectedL1] && (
                            <ul>
                                {Object.keys(jobCategories[selectedL1]).map(item => (
                                    <li
                                        key={item}
                                        className={selectedL2 === item ? "active" : ""}
                                        onClick={() => handleL2Select(item)}
                                    >
                                        <span>{item}</span>
                                        <span className="count">{categoryCounts[item] || 0}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="category-column">
                        {selectedL2 && jobCategories[selectedL1]?.[selectedL2] && (
                            <ul>
                                {jobCategories[selectedL1][selectedL2].map(item => (
                                    <li
                                        key={item}
                                        className={selectedL3 === item ? "active" : ""}
                                        onClick={() => handleL3Select(item)}
                                    >
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {tab === '지역' && (
                <div className="job-category-box">
                    {regions.map((r) => (
                        <button
                            key={r}
                            className={`job-btn ${selectedRegion === r ? 'active' : ''}`}
                            onClick={() => handleRegionSelect(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            )}

            <div className="filter-controls">
                <span className="result-count">
                    <strong>{filteredCompanies.length}</strong>개의 기업을 찾았어요.
                </span>
            </div>

            <div className="company-grid">
                {filteredCompanies.length > 0 ? filteredCompanies.map(company => (
                    <div key={company.name} className="company-card">
                        <div className="company-top">
                            <img
                                src={company.logo}
                                alt={company.name}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="info">
                                <h3>{company.name}</h3>
                                <p>{company.description}</p>
                            </div>
                        </div>
                        <div className="company-bottom">
                            <span className="badge">{company.region} · {company.field}</span>
                            <div className="actions">
                                <button className="interview-btn" onClick={() => openModeModal(company)}>AI 면접 시작</button>
                                <button
                                    className="bookmark-toggle"
                                    onClick={() => toggleBookmark(company.name)}
                                >
                                    {bookmarks.includes(company.name) ? '★' : '☆'}
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="no-result">조건에 맞는 회사가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default AiInviewer;
