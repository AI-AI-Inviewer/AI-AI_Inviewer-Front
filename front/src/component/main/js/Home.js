import React from 'react';
import { Link } from 'react-router-dom';
import "../scss/Home.scss";

const Home = () => {
    return (
        <div className="homemain-container">
            <section className="intro-section">
                <h1>Welcome OpenCaptCha</h1>
                <p>
                    OpenCaptCha는 오픈소스 CAPTCHA 플랫폼입니다.<br />
                    다양한 인증 방식과 간편한 접근성을 통해 더 나은 사용자 경험을 제공합니다.
                </p>
            </section>

            <div className="homemainimg-container">
                <h2>시작하려면 로그인 또는 회원가입</h2>
                <p className="intro-text">
                    아래 버튼을 클릭하여 로그인하거나 새로운 계정을 만들어보세요.
                </p>
                <div className="auth-buttons">
                    <Link to="/signin" className="btn login-btn">로그인</Link>
                    <Link to="/signup" className="btn signup-btn">회원가입</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;

