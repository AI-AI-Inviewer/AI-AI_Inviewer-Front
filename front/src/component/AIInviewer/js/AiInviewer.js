import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/AiInviewer.scss";
import companies from "../../data/Companies.js";

// 카테고리 데이터
const categories = {
    "기획·전략": {
        "전략 컨설턴트": ["전체", "M&A", "디지털 전환", "PE 컨설팅", "금융 서비스"],
        "경영 컨설턴트": ["전체", "위험 관리", "SCM", "감사", "TAS"],
        "리서처": ["전체", "산업 분석", "경제 전망", "정책 분석"],
        "사업기획": ["전체", "신사업 개발", "BM 개발", "디지털 채널"],
        "서비스기획": ["전체", "BM 개발", "핀테크"],
        "상품기획": ["전체", "시장 조사", "경쟁사 분석"],
        "데이터분석가": ["전체", "고객 데이터"],
    },
    "법률·사무·총무": {
        "변호사": ["전체", "M&A 자문", "공정거래", "국제중재", "조세", "인사노무"],
        "사내 변호사": ["전체", "계약 검토", "컴플라이언스", "지식재산권", "환경규제"],
        "총무": ["전체", "자산관리", "사옥관리"],
        "사무환경": ["전체", "오피스 운영", "복지 기획"],
        "일반사무": ["전체", "해외영업", "무역사무", "수출입 관리", "운항관리"],
    },
    "인사·HR": {
        "헤드헌터": ["전체", "IT/Tech", "소비재", "임원급 채용", "외국계"],
        "HR컨설턴트": ["전체", "채용 대행", "아웃소싱", "보상/조직설계", "인사 제도"],
        "인사담당자": ["전체", "HRM/HRD", "조직문화", "글로벌HR", "노무관리", "평가/보상"],
        "채용담당자": ["전체", "Tech Recruiting", "경력직 채용", "대규모 채용", "TA"],
    },
    "마케팅·광고·MD": {
        "광고기획(AE)": ["전체", "ATL/BTL", "캠페인 기획", "브랜드 전략", "IMC"],
        "미디어플래너": ["전체", "매체 기획"],
        "퍼포먼스 마케터": ["전체", "디지털 광고", "데이터 분석", "D2C"],
        "브랜드 마케터": ["전체", "화장품", "FMCG", "식품", "신제품 런칭"],
        "스포츠 마케터": ["전체", "브랜드 캠페인", "이벤트 기획"],
        "콘텐츠 마케터": ["전체", "엔터테인먼트", "팬덤 마케팅"],
        "MD": ["전체", "패션/잡화", "명품/뷰티", "식품/리빙", "H&B", "편의점"],
    },
    "디자인": {
        "그래픽 디자이너": ["전체", "편집디자인", "타이포그래피", "브랜딩", "제품 디자인"],
        "BX 디자이너": ["전체", "브랜드 경험", "소셜 임팩트", "브랜딩"],
        "UX/UI 디자이너": ["전체", "UX 리서치", "UI 설계", "Product Design", "서비스 디자인"],
    },
    "AI·개발·데이터": {
        "백엔드개발자": ["전체", "서버관리", "HTTP", "SI개발", "클라이언트", "핀테크"],
        "프론트엔드개발자": ["전체", "React", "Vue", "Angular"],
        "웹개발자": ["전체", "풀스택", "퍼블리셔"],
        "시스템엔지니어": ["전체", "네트워크", "보안"],
        "네트워크엔지니어": ["전체", "Cisco", "Juniper"],
        "AI 엔지니어": ["전체", "머신러닝", "딥러닝", "NLP"],
    },
};

const AiInviewer = ({ bookmarks, setBookmarks }) => {
    const navigate = useNavigate();
    const [selectedL1, setSelectedL1] = useState("AI·개발·데이터");
    const [selectedL2, setSelectedL2] = useState("백엔드개발자");
    const [selectedL3, setSelectedL3] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(["백엔드개발자"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

    const categoryCounts = useMemo(() => {
        const counts = {};
        companies.forEach(company => {
            counts[company.field] = (counts[company.field] || 0) + 1;
        });
        return counts;
    }, []);

    const filteredCompanies = useMemo(() => {
        let results = companies.filter(company => {
            const categoryMatch = selectedFilters.length === 0 || selectedFilters.includes(company.field);
            const searchMatch = searchTerm === "" || company.name.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });

        if (showOnlyBookmarks) {
            results = results.filter(company => bookmarks.includes(company.name));
        }
        return results;
    }, [selectedFilters, searchTerm, showOnlyBookmarks, bookmarks]);

    const handleReset = () => {
        setSelectedL1(null);
        setSelectedL2(null);
        setSelectedL3(null);
        setSelectedFilters([]);
        setSearchTerm("");
    };

    const handleL1Select = (item) => {
        setSelectedL1(item);
        setSelectedL2(null);
        setSelectedL3(null);
        setSelectedFilters([]);
    };

    const handleL2Select = (item) => {
        setSelectedL2(item);
        setSelectedL3(null);
        setSelectedFilters([item]);
    };

    const handleL3Select = (item) => {
        setSelectedL3(item);
    };

    const toggleBookmark = (companyName) => {
        setBookmarks(prev => prev.includes(companyName) ? prev.filter(b => b !== companyName) : [...prev, companyName]);
    };

    const handleAiMove = (companyName) => {
        navigate("/interview", { state: { companyName } });
    };

    return (
        <div className="aiinviewer-container">
            <div className="search-reset-bar">
                <div className="search-box-wrapper">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A8 8 0 1 0 10 18zm0-14a6 6 0 1 1-6 6 6 6 0 0 1 6-6z"></path></svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="기업명을 검색해보세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={handleReset} className="reset-btn" aria-label="초기화">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"></path></svg>
                </button>
            </div>

            <div className="filter-container">
                <div className="category-column">
                    <ul>
                        {Object.keys(categories).map(item => (
                            <li key={item} className={selectedL1 === item ? "active" : ""} onClick={() => handleL1Select(item)}>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="category-column">
                    {selectedL1 && categories[selectedL1] && (
                        <ul>
                            {Object.keys(categories[selectedL1]).map(item => (
                                <li key={item} className={selectedL2 === item ? "active" : ""} onClick={() => handleL2Select(item)}>
                                    <span>{item}</span>
                                    <span className="count">{categoryCounts[item] || 0}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="category-column">
                    {selectedL2 && categories[selectedL1]?.[selectedL2] && (
                        <ul>
                            {categories[selectedL1][selectedL2].map(item => (
                                <li key={item} className={selectedL3 === item ? "active" : ""} onClick={() => handleL3Select(item)}>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="filter-controls">
                <div className="bookmark-toggle">
                    <span className="toggle-label">즐겨찾기만 보기</span>
                    <label className="switch-wrapper">
                        <input
                            type="checkbox"
                            checked={showOnlyBookmarks}
                            onChange={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
                        />
                        <div className="switch"></div>
                    </label>
                </div>
                <span className="result-count">
                    <strong>{filteredCompanies.length}</strong>개의 기업을 찾았어요.
                </span>
            </div>

            {selectedFilters.length > 0 && (
                <div className="selected-tags-container">
                    {selectedFilters.map(f => (
                        <span key={f} className="filter-tag">
                            {f} <button onClick={() => setSelectedFilters(prev => prev.filter(tag => tag !== f))}>×</button>
                        </span>
                    ))}
                </div>
            )}

            <div className="company-grid">
                {filteredCompanies.map(company => (
                    <div key={company.name} className="company-card">
                        <img src={company.logo} alt={company.name} onError={(e) => e.target.style.display = 'none'}/>
                        <div className="company-info">
                            <h4>{company.name}</h4>
                            <p>{company.field} · {company.stack}</p>
                        </div>
                        <div className="card-actions">
                            <button className={`fav-btn ${bookmarks.includes(company.name) ? "active" : ""}`} onClick={() => toggleBookmark(company.name)}>
                                {bookmarks.includes(company.name) ? "★" : "☆"}
                            </button>
                            <button className="ai-btn" onClick={() => handleAiMove(company.name)}>
                                AI 면접
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiInviewer;