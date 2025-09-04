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
        name: 'Meta',
        category: 'AI',
        description:
            '소셜 네트워크 기반의 글로벌 기업. 오픈소스 Llama 시리즈와 AR/VR(메타버스) 투자로 AI·XR 융합을 추진.',
        code: '// Meta 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Meta_Platforms_Inc._logo.svg',
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
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Adobe_Corporate_logo.svg',
    },
    {
        name: 'Salesforce',
        category: 'Platform',
        description:
            'CRM 클라우드 1위 기업. 데이터 클라우드·플로우·Einstein AI로 세일즈/마케팅/서비스 자동화를 고도화.',
        code: '// Salesforce 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
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
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Baidu_Logo.svg',
    },
    {
        name: 'Alibaba',
        category: 'Web',
        description:
            '커머스·물류·클라우드를 결합한 초대형 플랫폼. 알리바바 클라우드와 초대규모 세일 행사(11.11)가 상징적.',
        code: '// Alibaba 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Alibaba_Cloud_logo.svg',
    },
    {
        name: 'Tencent',
        category: 'Platform',
        description:
            '메신저·게임·핀테크를 아우르는 종합 플랫폼. 위챗 생태계와 투자 포트폴리오로 성장 동력을 확보.',
        code: '// Tencent 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Tencent_Logo.svg',
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
        name: 'Samsung',
        category: 'Platform',
        description:
            '반도체·모바일·가전을 아우르는 하드웨어 리더. One UI와 스마트싱스 등으로 디바이스 연동 경험을 확장.',
        code: '// Samsung 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    },
    {
        name: 'GitHub',
        category: 'Platform',
        description:
            '전 세계 최대 개발자 협업 플랫폼. 오픈소스, 코드 관리, CI/CD 등 개발 생태계의 중심 허브.',
        code: '// GitHub 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    },
    {
        name: 'Intel',
        category: 'Platform',
        description:
            '반도체와 CPU 시장의 선두 기업. AI·데이터센터·클라우드 컴퓨팅을 위한 하드웨어 생태계를 제공.',
        code: '// Intel 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg',
    },
    {
        name: 'ARM',
        category: 'Platform',
        description:
            '저전력 고효율 CPU 아키텍처로 모바일 및 임베디드 기기 생태계를 주도. 클라우드와 AI 분야로 확장 중.',
        code: '// ARM 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/ARM_logo_2017.svg',
    },
    {
        name: 'Cloudflare',
        category: 'Web',
        description:
            'CDN, 보안, 성능 최적화 솔루션을 제공하는 글로벌 네트워크 기업. 엣지 컴퓨팅과 제로트러스트 보안을 확장.',
        code: '// Cloudflare 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg',
    },
    {
        name: 'Spotify',
        category: 'Web',
        description:
            '글로벌 음악 스트리밍 플랫폼. 추천 알고리즘과 데이터 분석으로 개인화된 음악 경험을 제공.',
        code: '// Spotify 예시 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg',
    }
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
