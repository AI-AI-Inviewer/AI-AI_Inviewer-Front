import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/AiInviewer.scss';

const categories = ['전체', 'AI', 'Web', 'Platform', 'Portal', 'Finance'];

const companies = [
    {
        name: 'OpenAI',
        category: 'AI',
        description: 'AI 기술을 선도하는 미국의 스타트업',
        code: '// OpenAI 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    },
    {
        name: 'Google',
        category: 'Web',
        description: '검색 엔진과 다양한 서비스를 제공하는 글로벌 기업',
        code: '// Google 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    },
    {
        name: 'Naver',
        category: 'Portal',
        description: '대한민국 대표 포털 서비스 기업',
        code: '// Naver 코드',
        logo: 'https://ssl.pstatic.net/static/nid/join/m_logo_naver.png',
    },
    {
        name: 'Kakao',
        category: 'Platform',
        description: '카카오톡으로 유명한 플랫폼 기업',
        code: '// Kakao 코드',
        logo: 'https://static.cdnlogo.com/logos/k/39/kakao.svg',
    },
    {
        name: 'Meta',
        category: 'AI',
        description: '메타버스와 AI 기술에 투자하는 글로벌 기업',
        code: '// Meta 코드',
        logo: 'https://1000logos.net/wp-content/uploads/2021/10/Meta-Logo.png',
    },
    {
        name: 'Amazon',
        category: 'Web',
        description: '글로벌 전자상거래 및 클라우드 컴퓨팅 선도 기업',
        code: '// Amazon 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    },
    {
        name: 'LINE',
        category: 'Platform',
        description: '모바일 메신저 및 다양한 디지털 서비스 제공 기업',
        code: '// LINE 코드',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    },
    {
        name: 'Toss',
        category: 'Finance',
        description: '대한민국의 간편 송금 및 금융 플랫폼 기업',
        code: '// Toss 코드',
        logo: 'https://static.toss.im/web-general/brand/static/logo.svg',
    },
];

const AiInviewer = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedCompany, setSelectedCompany] = useState(null);

    const filteredCompanies = selectedCategory === '전체'
        ? companies
        : companies.filter((c) => c.category === selectedCategory);

    const handleStartInterview = () => {
        if (selectedCompany) {
            navigate('/codetool', {
                state: {
                    initialCode: selectedCompany.code,
                    codeIndex: companies.indexOf(selectedCompany),
                },
            });
        }
    };

    return (
        <div className="aiinviewer-wrapper">
            <aside className="aiinviewer-sidebar">
                <input
                    type="text"
                    placeholder="회사 검색"
                    className="sidebar-search"
                />

                <div className="category-select">
                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <button className="bookmark-btn">⭐ 즐겨찾기</button>
            </aside>

            <main className="aiinviewer-main">
                <h2>AI 면접 기업 목록</h2>
                <div className="company-grid">
                    {filteredCompanies.map((company, index) => (
                        <div
                            key={index}
                            className="company-box"
                            onClick={() => setSelectedCompany(company)}
                        >
                            <img src={company.logo} alt={company.name} className="company-logo" />
                            <span>{company.name}</span>
                        </div>
                    ))}
                </div>

                {selectedCompany && (
                    <div className="company-modal">
                        <div className="modal-content">
                            <img src={selectedCompany.logo} alt={selectedCompany.name} className="modal-logo" />
                            <h3>{selectedCompany.name}</h3>
                            <p>{selectedCompany.description}</p>
                            <button onClick={handleStartInterview} className="interview-btn">AI 면접으로 이동</button>
                            <button onClick={() => setSelectedCompany(null)} className="close-btn">닫기</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AiInviewer;

