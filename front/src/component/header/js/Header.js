import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";
import "../scss/Header.scss";

/** 로그인 확인 + 단일 내비게이션 처리 */
const AuthLink = ({ to, children, isLoggedIn, closeMenus }) => {
    const navigate = useNavigate();
    // 로그인 필요한 경로들
    const authRequired = new Set([
        "/AiInviewer",
        "/mypage",
        "/feedback/write",
        "/postscript/write",
        "/CL",
    ]);

    const handleClick = (e) => {
        // Link 기본 내비게이션과 충돌 방지
        e.preventDefault();

        if (authRequired.has(to) && !isLoggedIn) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/signin", { replace: true, state: { from: to } });
        } else {
            navigate(to);
        }
        closeMenus?.();
    };

    return (
        <Link to={to} onClick={handleClick}>
            {children}
        </Link>
    );
};

const Header = ({ isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const { setIsCheckHeader } = useHeader();

    const [profileDropdown, setProfileDropdown] = useState(false);
    const [mainDropdown, setMainDropdown] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);

    const profileRef = useRef(null);
    const mainDropdownRef = useRef(null);

    const closeAllMenus = () => {
        setProfileDropdown(false);
        setMainDropdown(false);
        setMobileNav(false);
    };

    const handleLogout = () => {
        onLogout?.();
        closeAllMenus();
        alert("로그아웃 되었습니다.");
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdown(false);
            }
            if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
                setMainDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 문서 레벨 mousedown과의 레이스 방지
    const toggleMainDropdown = (e) => {
        e.stopPropagation();
        setProfileDropdown(false);
        setMainDropdown((prev) => !prev);
    };
    const toggleMainDropdownMouseDown = (e) => e.stopPropagation();

    const toggleProfileDropdown = (e) => {
        e.stopPropagation();
        setMainDropdown(false);
        setProfileDropdown((prev) => !prev);
    };
    const toggleProfileDropdownMouseDown = (e) => e.stopPropagation();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeAllMenus}>
                    AI Inviewer
                </Link>

                <div className="hamburger" onClick={() => setMobileNav((p) => !p)}>
                    <span></span><span></span><span></span>
                </div>

                <nav className={`nav ${mobileNav ? "show" : ""}`}>
                    {/* --- 메인 메뉴 --- */}
                    <ul className="nav-list main-menu">
                        <li>
                            <AuthLink to="/" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                홈
                            </AuthLink>
                        </li>
                        <li>
                            <AuthLink to="/AiInviewer" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                AI 면접연습
                            </AuthLink>
                        </li>
                        <li>
                            {/* ★ App.jsx의 경로와 대소문자 일치시킴: /JobPosting */}
                            <AuthLink to="/JobPosting" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                채용 공고
                            </AuthLink>
                        </li>
                        <li>
                            <AuthLink to="/CL" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                자소서
                            </AuthLink>
                        </li>

                        {/* --- 전체 게시판 드롭다운 --- */}
                        <li className={`header-dropdown ${mainDropdown ? "open" : ""}`} ref={mainDropdownRef}>
                            <button
                                className="dropdown-toggle"
                                onMouseDown={toggleMainDropdownMouseDown}
                                onClick={toggleMainDropdown}
                            >
                                전체 게시판
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <AuthLink to="/feedback" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                        <svg className="icon-svg" viewBox="0 0 24 24">
                                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                                        </svg>
                                        자유 게시판
                                    </AuthLink>
                                </li>
                                <li>
                                    <AuthLink to="/postscript" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                        <svg className="icon-svg" viewBox="0 0 24 24">
                                            <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"></path>
                                        </svg>
                                        면접 후기
                                    </AuthLink>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    {/* --- 로그인/프로필 메뉴 --- */}
                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className={`header-dropdown ${profileDropdown ? "open" : ""}`} ref={profileRef}>
                                <button
                                    className="dropdown-toggle profile-circle"
                                    onMouseDown={toggleProfileDropdownMouseDown}
                                    onClick={toggleProfileDropdown}
                                    title="프로필 메뉴"
                                >
                                    {userNickname?.[0]?.toUpperCase() || "U"}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <AuthLink to="/mypage" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>
                                            <svg className="icon-svg" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                            </svg>
                                            마이페이지
                                        </AuthLink>
                                    </li>
                                    <li>
                                        <button className="btn-logout" onClick={handleLogout}>
                                            <svg className="icon-svg" viewBox="0 0 24 24">
                                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                                            </svg>
                                            로그아웃
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/signin" onClick={closeAllMenus}>
                                        Sign In
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="signup-btn" onClick={closeAllMenus}>
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
