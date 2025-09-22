import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../scss/Header.scss";

const Header = ({ ChangeEventHandler, isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [boardDropdown, setBoardDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef();

    const handleNavigation = (path) => {
        ChangeEventHandler(path);
        navigate(path);
        setMobileMenuOpen(false);
        setBoardDropdown(false);
        setProfileDropdown(false);
    };

    const handleLogout = () => {
        onLogout();
        alert("로그아웃 되었습니다.");
        navigate("/");
        setProfileDropdown(false);
    };

    const toggleProfileDropdown = () => setProfileDropdown(prev => !prev);
    const toggleBoardDropdown = () => setBoardDropdown(prev => !prev);
    const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

    // 외부 클릭 시 프로필 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo" onClick={() => handleNavigation("/")}>AI Inviewer</div>

                {/* 햄버거 버튼 */}
                <div className="hamburger" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* 네비게이션 */}
                <nav className={`nav ${mobileMenuOpen ? "show" : ""}`}>
                    <ul className="nav-list main-menu">
                        <li><Link to="/" onClick={() => handleNavigation("/")}>홈</Link></li>
                        <li><Link to="/AiInviewer" onClick={() => handleNavigation("/AiInviewer")}>AI 면접연습</Link></li>
                        <li><Link to="/jobposting" onClick={() => handleNavigation("/jobposting")}>채용 공고</Link></li>
                        <li><Link to="/CL" onClick={() => handleNavigation("/CL")}>자소서</Link></li>

                        {/* 전체 게시판 */}
                        <li className={`dropdown ${boardDropdown ? "open" : ""}`}>
                            <span onClick={toggleBoardDropdown}>
                                전체 게시판 <span className="arrow">{boardDropdown ? "▲" : "▼"}</span>
                            </span>
                            <ul className="dropdown-menu">
                                <li><Link to="/feedback" onClick={() => handleNavigation("/feedback")}>자유 게시판</Link></li>
                                <li><Link to="/postscript" onClick={() => handleNavigation("/postscript")}>면접 후기 게시판</Link></li>
                            </ul>
                        </li>
                    </ul>

                    {/* 로그인/프로필 */}
                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className={`profile-dropdown ${profileDropdown ? "open" : ""}`} ref={profileRef}>
                                <div className="profile-circle" onClick={toggleProfileDropdown}>
                                    {userNickname?.[0] || "U"}
                                </div>
                                <ul className="dropdown-menu profile-menu">
                                    <li><Link to="/mypage" onClick={() => handleNavigation("/mypage")}>마이페이지</Link></li>
                                    <li><button className="btn-logout" onClick={handleLogout}>로그아웃</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li><Link to="/signin" onClick={() => handleNavigation("/signin")}>Sign In</Link></li>
                                <li><Link to="/signup" onClick={() => handleNavigation("/signup")}>Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
