import React from 'react';
import '../scss/Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* 왼쪽: 회사/사이트 소개 */}
                <div className="footer-section company">
                    <h3>AI Inviewer</h3>
                    <p>AI 면접 연습 플랫폼<br />당신의 면접을 더 스마트하게</p>
                </div>

                {/* 가운데: 링크 */}
                <div className="footer-section links">
                    <h4>바로가기</h4>
                    <ul>
                        <li><a href="#">사이트 소개</a></li>
                        <li><a href="#">이용약관</a></li>
                        <li><a href="#">개인정보처리방침</a></li>
                        <li><a href="#">고객센터</a></li>
                    </ul>
                </div>

                {/* 오른쪽: SNS */}
                <div className="footer-section social">
                    <h4>Follow us</h4>
                    <div className="social-icons">
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/facebook--v1.png" alt="Facebook" /></a>
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/instagram-new.png" alt="Instagram" /></a>
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/twitter.png" alt="Twitter" /></a>
                    </div>
                </div>
            </div>

            {/* 하단 저작권 */}
            <div className="footer-bottom">
                ⓒ 2025 AI Inviewer. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;

