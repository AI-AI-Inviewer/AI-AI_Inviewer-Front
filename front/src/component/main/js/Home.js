import React from 'react';
import { Link } from 'react-router-dom';
import "../scss/Home.scss";

const Home = ({ isLoggedIn, ChangeEventHandler }) => {
    function handleClickCaptCha() {
        ChangeEventHandler("captcha");
    }
    return (
        <div className="homemain-container">
            <section className="intro-section">
                <h1>Welcome AI-Inviewer</h1>
                <p>
                    AI-Inviewer는 AI 면접 플랫폼입니다.<br/>
                    AI를 사용한 면접과 편리한 인터페이스, 사용자 간의 면접 피드백을 <br/>
                    통해 다양한 정보를 제공합니다.
                </p>
            </section>

            <div className="homemainimg-container">
                {isLoggedIn ? (
                    <>
                        <h2>AI 면접에 도전해보세요!</h2>
                        <p className="intro-text">
                            AI 면접을 바로 시작해보세요.
                        </p>
                        <div className="auth-buttons">
                            <Link to="/captcha" className="btn signup-btn">
                                AI 면접 바로가기
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>시작하려면 로그인 또는 회원가입</h2>
                        <p className="intro-text">
                            아래 버튼을 클릭하여 로그인하거나 새로운 계정을 만들어보세요.
                        </p>
                        <div className="auth-buttons">
                            <Link to="/signin" className="btn login-btn">로그인</Link>
                            <Link to="/signup" className="btn signup-btn">회원가입</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
