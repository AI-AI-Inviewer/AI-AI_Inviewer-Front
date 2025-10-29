import React from "react";
import { useNavigate } from "react-router-dom";
import "../scss/Home.scss";

const Home = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const goToInterview = () => {
        if (isLoggedIn) {
            navigate("/AiInviewer");
        } else {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/signin", { replace: true, state: { from: "/AiInviewer" } });
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <h1>AI 면접 연습 플랫폼</h1>
                    <p>실제 면접처럼 준비하고 AI 피드백으로 성장하세요.</p>
                    <button className="cta-btn" onClick={goToInterview}>
                        지금 시작하기
                    </button>
                </div>
            </header>

            {/* How-It-Works Section */}
            <section className="how-it-works">
                <h2>3단계로 시작하는 AI 면접 연습</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>회원가입 및 로그인</h3>
                        <p>간단한 정보만으로 AI Inviewer의 모든 기능을 시작할 수 있습니다.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>모의면접 시작</h3>
                        <p>원하는 직무와 난이도를 선택해 실제 면접처럼 연습하세요.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>피드백 확인 및 반복</h3>
                        <p>AI가 분석한 상세 피드백을 바탕으로 부족한 점을 보완합니다.</p>
                    </div>
                </div>
            </section>

            {/* Join Us Section */}
            <section className="join-us">
                <h2>지금 바로 당신의 면접을 업그레이드하세요</h2>
                <p>AI Inviewer와 함께라면 합격의 문이 더 가까워집니다.</p>
                <button className="btn-join" onClick={goToInterview}>
                    무료로 시작하기
                </button>
            </section>

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
                        <span>- 대학생 조현준</span>
                    </div>
                    <div className="testimonial-card">
                        <p>“AI가 바로 피드백을 주니까 개선이 빨라요.”</p>
                        <span>- 취준생 김광진</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
