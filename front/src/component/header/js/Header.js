// component/header/js/Header.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";
import { useTheme } from "../../common/js/ThemeContext";
import "../scss/Header.scss";

const AuthLink = ({ to, children, isLoggedIn, closeMenus }) => {
    const navigate = useNavigate();
    const authRequired = new Set([
        "/AiInviewer", "/mypage", "/feedback/write", "/postscript/write", "/CL"
    ]);

    const handleClick = (e) => {
        e.preventDefault();
        if (authRequired.has(to) && !isLoggedIn) {
            alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            navigate("/signin", { replace: true, state: { from: to } });
        } else {
            navigate(to);
        }
        closeMenus?.();
    };

    return <Link to={to} onClick={handleClick}>{children}</Link>;
};

const Header = ({ isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const { setIsCheckHeader } = useHeader();
    const { theme, toggleTheme } = useTheme();

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

    const toggleMainDropdown = (e) => { e.stopPropagation(); setProfileDropdown(false); setMainDropdown((p) => !p); };
    const toggleMainDropdownMouseDown = (e) => e.stopPropagation();
    const toggleProfileDropdown = (e) => { e.stopPropagation(); setMainDropdown(false); setProfileDropdown((p) => !p); };
    const toggleProfileDropdownMouseDown = (e) => e.stopPropagation();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeAllMenus}>AI Inviewer</Link>

                <div className="hamburger" onClick={() => setMobileNav((p) => !p)}>
                    <span></span><span></span><span></span>
                </div>

                <nav className={`nav ${mobileNav ? "show" : ""}`}>
                    <ul className="nav-list main-menu">
                        <li><AuthLink to="/" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>홈</AuthLink></li>
                        <li><AuthLink to="/AiInviewer" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>AI 면접연습</AuthLink></li>
                        <li><AuthLink to="/JobPosting" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>채용 공고</AuthLink></li>
                        <li><AuthLink to="/CL" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>자소서</AuthLink></li>

                        <li className={`header-dropdown ${mainDropdown ? "open" : ""}`} ref={mainDropdownRef}>
                            <button className="dropdown-toggle" onMouseDown={toggleMainDropdownMouseDown} onClick={toggleMainDropdown}>전체 게시판</button>
                            <ul className="dropdown-menu">
                                <li><AuthLink to="/feedback" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>자유 게시판</AuthLink></li>
                                <li><AuthLink to="/postscript" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>면접 후기</AuthLink></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className={`header-dropdown ${profileDropdown ? "open" : ""}`} ref={profileRef}>
                                <button className="dropdown-toggle profile-circle" onMouseDown={toggleProfileDropdownMouseDown} onClick={toggleProfileDropdown}>
                                    {userNickname?.[0]?.toUpperCase() || "U"}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><AuthLink to="/mypage" isLoggedIn={isLoggedIn} closeMenus={closeAllMenus}>마이페이지</AuthLink></li>
                                    <li><button className="btn-darkmode-toggle" onClick={toggleTheme}>
                                        {theme === "light" ? "다크모드" : "라이트모드"}
                                    </button></li>
                                    <li><button className="btn-logout" onClick={handleLogout}>로그아웃</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li><Link to="/signin" onClick={closeAllMenus}>Sign In</Link></li>
                                <li><Link to="/signup" className="signup-btn" onClick={closeAllMenus}>Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
