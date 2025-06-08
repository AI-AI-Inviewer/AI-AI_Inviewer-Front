import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/AiInviewer.scss';

const companies = [
    { name: 'OpenAI', category: 'AI', description: 'AI 기술을 선도하는 미국의 스타트업', code: '// OpenAI 코드' },
    { name: 'Google', category: 'Web', description: '검색 엔진과 다양한 서비스를 제공하는 글로벌 기업', code: '// Google 코드' },
    { name: 'Naver', category: 'Portal', description: '대한민국 대표 포털 서비스 기업', code: '// Naver 코드' },
    { name: 'Kakao', category: 'Platform', description: '카카오톡으로 유명한 플랫폼 기업', code: '// Kakao 코드' },
    { name: 'Meta', category: 'AI', description: '메타버스와 AI 기술에 투자하는 글로벌 기업', code: '// Meta 코드' },
];

const categories = ['전체', 'AI', 'Web', 'Portal', 'Platform'];

const AiInviewer = () => {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('전체');

    const handleStartInterview = () => {
        if (selectedCompany) {
            navigate('/codetool', {
                state: {
                    initialCode: selectedCompany.code,
                    codeIndex: companies.findIndex(c => c.name === selectedCompany.name),
                },
            });
        }
    };

    const filteredCompanies = companies.filter(company => {
        const matchCategory = activeCategory === '전체' || company.category === activeCategory;
        const matchSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="aiinviewer-wrapper">
            <aside className="aiinviewer-sidebar">
                <input
                    type="text"
                    placeholder="회사 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="category-buttons">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="favorites">
                    <button>⭐ 즐겨찾기</button>
                </div>
            </aside>

            <main className="aiinviewer-main">
                <h2>AI 면접 회사 목록</h2>
                <div className="company-grid">
                    {filteredCompanies.map((company, idx) => (
                        <div
                            key={idx}
                            className={`company-box ${selectedCompany?.name === company.name ? 'selected' : ''}`}
                            onClick={() => setSelectedCompany(company)}
                        >
                            <h3>{company.name}</h3>
                            <p>{company.category}</p>
                        </div>
                    ))}
                </div>

                {selectedCompany && (
                    <div className="company-detail">
                        <h3>{selectedCompany.name}</h3>
                        <p>{selectedCompany.description}</p>
                        <button onClick={handleStartInterview}>AI 면접으로 이동</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AiInviewer;



