import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../scss/Header.scss";

const Header = ({ ChangeEventHandler, isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [mainDropdown, setMainDropdown] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);
    const profileRef = useRef();
    const dropdownRef = useRef();
    const mainDropdownRef = useRef();

    // 페이지 이동
    const handleNavigation = (path) => {
        ChangeEventHandler(path);
        navigate(path);
        setProfileDropdown(false);
        setMobileNav(false);
        setMainDropdown(false);
    };

    // 로그아웃
    const handleLogout = () => {
        onLogout();
        alert("로그아웃 되었습니다.");
        navigate("/");
        setProfileDropdown(false);
    };

    // 드롭다운 토글
    const toggleProfileDropdown = () => setProfileDropdown(prev => !prev);
    const toggleMainDropdown = () => setMainDropdown(prev => !prev);
    const toggleMobileNav = () => setMobileNav(prev => !prev);

    // 클릭 바깥 영역 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current && !profileRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setProfileDropdown(false);
            }
            if (
                mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)
            ) {
                setMainDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo" onClick={() => handleNavigation("/")}>AI Inviewer</div>

                <div className="hamburger" onClick={toggleMobileNav}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className={`nav ${mobileNav ? "show" : ""}`}>
                    {/* 메인 메뉴 */}
                    <ul className="nav-list main-menu">
                        <li onClick={() => handleNavigation("/")}>홈</li>
                        <li onClick={() => handleNavigation("/AiInviewer")}>AI 면접연습</li>
                        <li onClick={() => handleNavigation("/jobposting")}>채용 공고</li>
                        <li onClick={() => handleNavigation("/CL")}>자소서</li>
                        <li
                            className={mainDropdown ? "open" : ""}
                            onClick={toggleMainDropdown}
                            ref={mainDropdownRef}
                        >
                            <span>전체 게시판</span>
                            <ul className="dropdown-menu">
                                <li onClick={() => handleNavigation("/feedback")}>자유 게시판</li>
                                <li onClick={() => handleNavigation("/postscript")}>면접 후기 게시판</li>
                            </ul>
                        </li>
                    </ul>

                    {/* 로그인/프로필 */}
                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className={`profile-dropdown ${profileDropdown ? "open" : ""}`}>
                                <div className="profile-circle" onClick={toggleProfileDropdown} ref={profileRef}>
                                    {userNickname?.[0] || "U"}
                                </div>
                                <ul className="profile-menu" ref={dropdownRef}>
                                    <li onClick={() => handleNavigation("/mypage")}>마이페이지</li>
                                    <li>
                                        <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li onClick={() => handleNavigation("/signin")}>Sign In</li>
                                <li onClick={() => handleNavigation("/signup")}>Sign Up</li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
