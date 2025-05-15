import React from 'react';
import '../scss/CaptCha.scss';

const CaptCha = () => {
    return (
        <div className="captcha-wrapper">
            {/* 왼쪽 메뉴 */}
            <aside className="captcha-sidebar">
                <h3>메뉴</h3>
                <ul>
                    <li>항목 1</li>
                    <li>항목 2</li>
                    <li>항목 3</li>
                </ul>
            </aside>

            {/* 오른쪽 박스 영역 */}
            <main className="captcha-main">
                <h2>CaptCha Page</h2>
                <div className="captcha-grid">
                    {[...Array(9)].map((_, index) => (
                        <div key={index} className="captcha-box">
                            {/* SCSS에서 background로 이미지 설정 예정 */}
                            <span>박스 {index + 1}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CaptCha;
