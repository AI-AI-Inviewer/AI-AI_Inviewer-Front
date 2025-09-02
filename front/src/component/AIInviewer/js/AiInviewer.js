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
        name: 'Microsoft',
        category: 'AI',
        description:
            '클라우드 Azure와 오피스 제품군, GitHub·VS Code 등 개발자 친화적 생태계 보유. Copilot으로 생산성 AI를 확장.',
        code: '// Microsoft 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
    {
        name: 'Naver',
        category: 'Portal',
        description:
            '국내 대표 포털·검색·콘텐츠 플랫폼. 지도·페이·웹툰·클라우드 등 다양한 서비스를 유기적으로 연동.',
        code: '// Naver 예시 코드',
        logo: 'https://ssl.pstatic.net/static/nid/join/m_logo_naver.png',
    },
    {
        name: 'Kakao',
        category: 'Platform',
        description:
            '카카오톡을 중심으로 커머스·모빌리티·엔터·핀테크까지 확장한 생활형 플랫폼. 다양한 파트너 생태계를 구축.',
        code: '// Kakao 예시 코드',
        logo: 'https://static.cdnlogo.com/logos/k/39/kakao.svg',
    },
    {
        name: 'Meta',
        category: 'AI',
        description:
            '소셜 네트워크 기반의 글로벌 기업. 오픈소스 Llama 시리즈와 AR/VR(메타버스) 투자로 AI·XR 융합을 추진.',
        code: '// Meta 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Meta_Platforms_Inc._logo.svg/800px-Meta_Platforms_Inc._logo.svg.png',
    },
    {
        name: 'Amazon',
        category: 'Web',
        description:
            '전자상거래와 AWS 클라우드를 양 축으로 성장. 대규모 분산 시스템·로지스틱스·추천 알고리즘이 강점.',
        code: '// Amazon 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    },
    {
        name: 'LINE',
        category: 'Platform',
        description:
            '모바일 메신저를 중심으로 결제·음악·뉴스·게임 등으로 확장. 일본·동남아 시장에서 강력한 사용자 기반.',
        code: '// LINE 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    },
    {
        name: 'Toss',
        category: 'Finance',
        description:
            '간편 송금에서 출발해 보험·증권·은행까지 확장한 핀테크. 사용성 중심의 UX와 과감한 데이터 활용이 특징.',
        code: '// Toss 예시 코드',
        logo: 'https://static.toss.im/web-general/brand/static/logo.svg',
    },
    {
        name: 'NVIDIA',
        category: 'AI',
        description:
            'GPU·가속 컴퓨팅의 표준을 만든 기업. CUDA·TensorRT·Omniverse 등으로 AI 인프라와 개발 스택을 제공.',
        code: '// NVIDIA 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    },
    {
        name: 'IBM',
        category: 'AI',
        description:
            '엔터프라이즈 AI/하이브리드 클라우드에 강점. watsonx를 앞세워 거버넌스·MLOps·데이터 스택을 통합 제공.',
        code: '// IBM 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    },
    {
        name: 'Adobe',
        category: 'Web',
        description:
            '디지털 미디어·마케팅 소프트웨어의 대표 주자. Firefly 등 생성형 AI를 크리에이티브 워크플로에 녹여 생산성 강화.',
        code: '// Adobe 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Adobe_Corporate_Logo.svg',
    },
    {
        name: 'Salesforce',
        category: 'Platform',
        description:
            'CRM 클라우드 1위 기업. 데이터 클라우드·플로우·Einstein AI로 세일즈/마케팅/서비스 자동화를 고도화.',
        code: '// Salesforce 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Salesforce.com_logo.svg',
    },
    {
        name: 'Oracle',
        category: 'Platform',
        description:
            '데이터베이스·ERP 중심의 엔터프라이즈 소프트웨어 강자. OCI 클라우드와 오라클 애널리틱스로 확장 중.',
        code: '// Oracle 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    },
    {
        name: 'Apple',
        category: 'Platform',
        description:
            '디바이스·OS·서비스를 수직 통합한 생태계. 보안·프라이버시·UX 완성도로 하드웨어-소프트웨어 시너지를 극대화.',
        code: '// Apple 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },
    {
        name: 'Baidu',
        category: 'AI',
        description:
            '중국 검색·AI 선도 기업. 자율주행(아폴로)·대규모 모델(ERNIE) 등에서 생태계와 레퍼런스를 확보.',
        code: '// Baidu 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Baidu.svg',
    },
    {
        name: 'Alibaba',
        category: 'Web',
        description:
            '커머스·물류·클라우드를 결합한 초대형 플랫폼. 알리바바 클라우드와 초대규모 세일 행사(11.11)가 상징적.',
        code: '// Alibaba 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Alibaba_Group_logo.svg',
    },
    {
        name: 'Tencent',
        category: 'Platform',
        description:
            '메신저·게임·핀테크를 아우르는 종합 플랫폼. 위챗 생태계와 투자 포트폴리오로 성장 동력을 확보.',
        code: '// Tencent 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Tencent_Logo.svg',
    },
    {
        name: 'Coupang',
        category: 'Web',
        description:
            '로켓배송으로 대표되는 이커머스. 물류 자동화·데이터 기반 수요 예측으로 빠른 배송 경험을 표준화.',
        code: '// Coupang 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Coupang_logo.svg',
    },
    {
        name: 'ByteDance',
        category: 'AI',
        description:
            '콘텐츠 추천 알고리즘을 강점으로 글로벌 확장. 데이터 드리븐 문화와 실험 속도로 빠른 제품 개선을 지향.',
        code: '// ByteDance 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/ByteDance_Logo.png',
    },
    {
        name: 'PayPal',
        category: 'Finance',
        description:
            '온라인 결제의 표준을 만든 핀테크. 대규모 결제 네트워크 운영 노하우와 리스크 관리 역량이 강점.',
        code: '// PayPal 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    },
    {
        name: 'Stripe',
        category: 'Finance',
        description:
            '개발자 친화적 API로 결제·빌링·세금까지 모듈형 제공. 스타트업부터 엔터프라이즈까지 폭넓게 채택.',
        code: '// Stripe 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Stripe_Logo%2C_revised_2016.svg',
    },
    {
        name: 'Visa',
        category: 'Finance',
        description:
            '글로벌 카드 결제 네트워크. 초고가용성·저지연 결제 처리와 보안·위변조 방지 기술이 핵심 역량.',
        code: '// Visa 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    },
    {
        name: 'Samsung',
        category: 'Platform',
        description:
            '반도체·모바일·가전을 아우르는 하드웨어 리더. One UI와 스마트싱스 등으로 디바이스 연동 경험을 확장.',
        code: '// Samsung 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
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
                state: { initialCode: selectedCompany.code, codeIndex: companies.indexOf(selectedCompany) },
            });
        }
    };

    const toggleBookmark = () => setBookmarkActive(!bookmarkActive);

    const toggleCompanyBookmark = (companyName) => {
        if (bookmarks.includes(companyName)) {
            setBookmarks(bookmarks.filter((name) => name !== companyName));
        } else {
            setBookmarks([...bookmarks, companyName]);
        }
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
                                className={`bookmark-toggle ${
                                    bookmarks.includes(company.name) ? 'bookmarked' : ''
                                }`}
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
