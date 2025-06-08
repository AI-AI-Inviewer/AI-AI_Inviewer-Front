import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/AiInviewer.scss';

const companies = [
    {
        name: 'OpenAI',
        description: 'AI 기술을 선도하는 미국의 스타트업',
        code: '// OpenAI 관련 코드 예시',
    },
    {
        name: 'Google',
        description: '검색 엔진과 다양한 서비스를 제공하는 글로벌 IT 기업',
        code: '// Google 관련 코드 예시',
    },
    {
        name: 'Naver',
        description: '대한민국의 대표 포털 서비스 기업',
        code: '// Naver 관련 코드 예시',
    },
];

const AiInviewer = () => {
    const navigate = useNavigate();
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleCompanyClick = (company, index) => {
        setSelectedCompany({ ...company, index });
    };

    const handleStartInterview = () => {
        if (selectedCompany) {
            navigate('/codetool', {
                state: {
                    initialCode: selectedCompany.code,
                    codeIndex: selectedCompany.index,
                },
            });
        }
    };

    return (
        <div className="aiinviewer-wrapper">
            <aside className="aiinviewer-sidebar">
                <h3>회사 목록</h3>
                <ul>
                    {companies.map((company, index) => (
                        <li
                            key={index}
                            onClick={() => handleCompanyClick(company, index)}
                            className={selectedCompany?.index === index ? 'active' : ''}
                        >
                            {company.name}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="aiinviewer-main">
                <h2>AI 면접 페이지</h2>
                {selectedCompany ? (
                    <div className="company-detail">
                        <h3>{selectedCompany.name}</h3>
                        <p>{selectedCompany.description}</p>
                        <button onClick={handleStartInterview}>AI 면접으로 이동</button>
                    </div>
                ) : (
                    <p>회사를 선택해 주세요.</p>
                )}
            </main>
        </div>
    );
};

export default AiInviewer;




