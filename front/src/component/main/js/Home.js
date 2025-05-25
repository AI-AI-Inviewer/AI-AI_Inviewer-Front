// import React from 'react';
// import "../scss/Home.scss";
//
// const Home = () => {
//     return (
//         <main className="home-main">
//             {/* Hero Section: 배경 그림 + 오버레이만 */}
//             <section className="hero-section">
//                 <div className="overlay" />
//             </section>
//
//             {/* Features Section */}
//             <section className="features-section">
//                 <h2>주요 기능</h2>
//                 <div className="features-grid">
//                     <div className="feature-card">
//                         <h3>기술 공유 허브</h3>
//                         <p>개발자 간 리캡차 알고리즘과 분석 정보를 자유롭게 공유할 수 있는 커뮤니티 제공</p>
//                     </div>
//                     <div className="feature-card">
//                         <h3>오픈소스 기반</h3>
//                         <p>누구나 참여하고 개선할 수 있도록 오픈소스로 운영</p>
//                     </div>
//                     <div className="feature-card">
//                         <h3>확장 가능한 구조</h3>
//                         <p>새로운 리캡차 유형을 손쉽게 추가할 수 있도록 설계된 유연한 구조</p>
//                     </div>
//                 </div>
//
//                 {/* 주요 기능 밑 문구 */}
//                 <div className="platform-description">
//                     <p>개발자들이 함께 만들고, 개선하고, 공유하는 새로운 리캡차 시스템</p>
//                 </div>
//             </section>
//         </main>
//     );
// };
//
// export default Home;
import React from 'react';
import "../scss/Home.scss";

const Home = () => {
    const sampleCode = `
function example() {
  console.log("Hello OpenCaptcha!");
}
  `.trim();

    return (
        <main className="home-main">
            {/* Hero Section: 배경 그림 + 중앙 박스 코드 */}
            <section className="hero-section">
                <div className="hero-content">
                    <pre>{sampleCode}</pre>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2>주요 기능</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>기술 공유 허브</h3>
                        <p>개발자 간 리캡차 알고리즘과 분석 정보를 자유롭게 공유할 수 있는 커뮤니티 제공</p>
                    </div>
                    <div className="feature-card">
                        <h3>오픈소스 기반</h3>
                        <p>누구나 참여하고 개선할 수 있도록 오픈소스로 운영</p>
                    </div>
                    <div className="feature-card">
                        <h3>확장 가능한 구조</h3>
                        <p>새로운 리캡차 유형을 손쉽게 추가할 수 있도록 설계된 유연한 구조</p>
                    </div>
                </div>

                <div className="platform-description">
                    <p>개발자들이 함께 만들고, 개선하고, 공유하는 새로운 리캡차 시스템</p>
                </div>
            </section>
        </main>
    );
};

export default Home;
