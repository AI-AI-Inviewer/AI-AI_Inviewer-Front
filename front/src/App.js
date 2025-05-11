import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// 각 페이지 컴포넌트들
function HomePage() {
  return null;  // 내용 없이 비워둡니다.
}

function TopMenuPage() {
  return null;  // 내용 없이 비워둡니다.
}

function CommunityPage() {
  return null;  // 내용 없이 비워둡니다.
}

function GuidePage() {
  return null;  // 내용 없이 비워둡니다.
}

function MyPage() {
  return null;  // 내용 없이 비워둡니다.
}

function SignUpPage() {
  return null;  // 회원가입 페이지 내용 제거
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`검색어: ${searchQuery}`);
  };

  return (
      <Router>
        <div className="App">
          {/* 상단 메뉴 */}
          <header className="App-header">
            <nav className="navbar">
              {/* 왼쪽 메뉴 */}
              <div className="nav-left">
                <Link to="/" className="nav-item">홈</Link>
                <Link to="/topmenu" className="nav-item">상단 메뉴</Link>
                <Link to="/community" className="nav-item">커뮤니티</Link>
                <Link to="/guide" className="nav-item">이용가이드</Link>
              </div>

              {/* 가운데 검색 입력 */}
              <div className="search-container">
                <form onSubmit={handleSearchSubmit}>
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="검색어를 입력하세요"
                      className="search-input"
                  />
                  <button type="submit" className="search-button">검색</button>
                </form>
              </div>

              {/* 오른쪽 메뉴 */}
              <div className="nav-right">
                <Link to="/mypage" className="nav-item small">
                  로그인
                </Link>
                <Link to="/signup" className="nav-item small">
                  회원가입
                </Link>
              </div>
            </nav>
          </header>

          {/* 중앙에 3개의 직사각형 칸 */}
          <main className="main-content">
            <div className="rectangles-container">
              <div className="rectangle">리캡차 1</div>
              <div className="rectangle">리캡차 2</div>
              <div className="rectangle">리캡차 3</div>
            </div>

            {/* 페이지 라우팅 */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/topmenu" element={<TopMenuPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-links">
              <span>회사소개</span>
              <span>/</span>
              <span>이용약관</span>
              <span>/</span>
              <span>개인정보처리방침</span>
              <span>/</span>
              <span>고객센터</span>
            </div>
            <div className="footer-copy">
              2025 OpenCaptcha. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
  );
}

export default App;
