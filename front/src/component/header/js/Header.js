import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../scss/Header.scss";

const Header = ({ ChangeEventHandler, isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const [profileDropdown, setProfileDropdown] = useState(false);
    const profileRef = useRef();
    const dropdownRef = useRef();

    const handleNavigation = (path) => {
        ChangeEventHandler(path);
    };

    const handleLogout = () => {
        onLogout();
        alert("로그아웃 되었습니다.");
        navigate("/");
        setProfileDropdown(false);
    };

    const toggleDropdown = () => {
        setProfileDropdown((prev) => !prev);
    };

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
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                {/* 로고 */}
                <div className="logo" onClick={() => handleNavigation("/")}>
                    AI Inviewer
                </div>

                {/* 메뉴 */}
                <nav className="nav">
                    <ul className="nav-list main-menu">
                        <li>
                            <Link to="/" onClick={() => handleNavigation("/")}>
                                홈
                            </Link>
                        </li>
                        <li>
                            <Link to="/AiInviewer" onClick={() => handleNavigation("interview")}>
                                AI 면접연습
                            </Link>
                        </li>
                        <li>
                            <Link to="/jobposting" onClick={() => handleNavigation("jobposting")}>
                                채용 공고
                            </Link>
                        </li>
                        <li>
                            <Link to="/CL" onClick={() => handleNavigation("/CL")}>
                                자소서
                            </Link>
                        </li>
                        <li className="dropdown">
                            <span>전체 게시판</span>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/feedback" onClick={() => handleNavigation("noticeboard")}>
                                        자유 게시판
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/postscript" onClick={() => handleNavigation("feedback")}>
                                        면접 후기 게시판
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    {/* 로그인/프로필 */}
                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className="profile-dropdown">
                                <div
                                    className="profile-circle"
                                    onClick={toggleDropdown}
                                    ref={profileRef}
                                >
                                    {userNickname?.[0] || "U"}
                                </div>
                                {profileDropdown && (
                                    <ul className="dropdown-menu profile-menu" ref={dropdownRef}>
                                        <li>
                                            <Link
                                                to="/mypage"
                                                onClick={() => {
                                                    handleNavigation("mypage");
                                                    setProfileDropdown(false);
                                                }}
                                            >
                                                마이페이지
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="btn-logout" onClick={handleLogout}>
                                                로그아웃
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link to="/signin" onClick={() => handleNavigation("signin")}>
                                        Sign In
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" onClick={() => handleNavigation("signup")}>
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
