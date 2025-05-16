import React from 'react';
import '../scss/Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section company">
                    <h3>소개</h3>
                    <p>
                        OpenCaptCha<br />
                    </p>
                </div>
                <div className="footer-section links">
                    <h4>바로가기</h4>
                    <ul>
                        <li><a href="#">사이트 소개</a></li>
                        <li><a href="#">이용약관</a></li>
                        <li><a href="#">개인정보처리방침</a></li>
                        <li><a href="#">고객센터</a></li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h4>Follow us</h4>
                    <div className="social-icons">
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/facebook--v1.png" alt="Facebook" /></a>
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/instagram-new.png" alt="Instagram" /></a>
                        <a href="#"><img src="https://img.icons8.com/ios-filled/20/000000/twitter.png" alt="Twitter" /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                ⓒ 2025 OpenCaptCha. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
