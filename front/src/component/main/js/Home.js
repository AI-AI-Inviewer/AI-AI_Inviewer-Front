import React from "react";
import "../scss/Home.scss";

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1>AI 면접 연습 플랫폼</h1>
                    <p>실제 면접처럼 준비하고 AI 피드백으로 성장하세요.</p>
                    <button className="cta-btn">지금 시작하기</button>
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>주요 기능</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <img src="#" alt="AI Interview" />
                        <h3>AI 모의면접</h3>
                        <p>실제 면접관처럼 질문을 받고 답변해보세요.</p>
                    </div>
                    <div className="feature-card">
                        <img src="#" alt="Feedback" />
                        <h3>즉시 피드백</h3>
                        <p>답변 내용을 분석하고 강점과 개선점을 알려줍니다.</p>
                    </div>
                    <div className="feature-card">
                        <img src="#" alt="Company DB" />
                        <h3>기업별 맞춤</h3>
                        <p>지원할 기업과 직무에 맞춘 질문으로 연습하세요.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>사용자 후기</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>“면접 전에 연습할 수 있어서 자신감이 생겼어요!”</p>
                        <span>- 대학생 김민수</span>
                    </div>
                    <div className="testimonial-card">
                        <p>“AI가 바로 피드백을 주니까 개선이 빨라요.”</p>
                        <span>- 취준생 이지은</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 AI Interview Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;


