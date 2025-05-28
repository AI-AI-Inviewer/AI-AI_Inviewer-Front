import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../scss/CaptCha.scss';

const codes = [
    "// 코드 1 예시",
    "// 코드 2 예시",
    "// 코드 3 예시",
    "// 코드 4 예시",
    "// 코드 5 예시",
    "// 코드 6 예시",
    "// 코드 7 예시",
    "// 코드 8 예시",
    "// 코드 9 예시",
];

const CaptCha = () => {
    const navigate = useNavigate();

    const handleBoxClick = (index) => {
        // codes[index]를 state로 전달
        navigate('/codetool', { state: { initialCode: codes[index], codeIndex: index } });
    };

    return (
        <div className="captcha-wrapper">
            <aside className="captcha-sidebar">
                <h3>메뉴</h3>
                <ul>
                    <li>카테고리</li>
                    <li>북마크</li>
                    <li>MyCAPTCHA</li>
                </ul>
            </aside>

            <main className="captcha-main">
                <h2>CaptCha Page</h2>
                <div className="captcha-grid">
                    {codes.map((_, index) => (
                        <div
                            key={index}
                            className="captcha-box"
                            onClick={() => handleBoxClick(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>박스 {index + 1}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CaptCha;



