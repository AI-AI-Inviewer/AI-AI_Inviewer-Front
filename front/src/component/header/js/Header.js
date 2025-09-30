// src/component/header/js/Header.jsx
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

    // 로그인 필요한 경로 목록
    const authRequired = new Set([
        "/AiInviewer",
        "/mypage",
        "/feedback/write",
        "/postscript/write",
    ]);

    // 공통 내비게이션 (헤더 참고 패턴)
    const handleNavigation = (path) => {
        const go = () => {
            ChangeEventHandler(path);
            navigate(path);
            setProfileDropdown(false);
            setMobileNav(false);
            setMainDropdown(false);
        };

        if (authRequired.has(path) && !isLoggedIn) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/signin", { replace: true, state: { from: path } });
            setProfileDropdown(false);
            setMobileNav(false);
            setMainDropdown(false);
            return;
        }

        go();
    };

    // 로그아웃
    const handleLogout = () => {
        onLogout();
        alert("로그아웃 되었습니다.");
        navigate("/");
        setProfileDropdown(false);
    };

    const toggleProfileDropdown = () => setProfileDropdown((p) => !p);
    const toggleMainDropdown = () => setMainDropdown((p) => !p);
    const toggleMobileNav = () => setMobileNav((p) => !p);

    // 클릭 바깥 영역 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setProfileDropdown(false);
            }
            if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
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
                    <span></span><span></span><span></span>
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
                                <li onClick={() => handleNavigation("/feedback")}>
                                    <div className="circle-icon">F</div> 자유 게시판
                                </li>
                                <li onClick={() => handleNavigation("/postscript")}>
                                    <div className="circle-icon">R</div> 면접 후기 게시판
                                </li>
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
                                    <li onClick={() => handleNavigation("/mypage")}>
                                        <div className="circle-icon">M</div> 마이페이지
                                    </li>
                                    <li>
                                        <div className="circle-icon">L</div>
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
