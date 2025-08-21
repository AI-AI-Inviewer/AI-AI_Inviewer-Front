import "../scss/Header.scss";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ ChangeEventHandler, isLoggedIn, userNickname, onLogout }) => {
    const navigate = useNavigate();
    const [profileDropdown, setProfileDropdown] = useState(false);

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
        setProfileDropdown(!profileDropdown);
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* 왼쪽 로고 */}
                <div className="logo" onClick={() => handleNavigation("/")}>
                    AI Inviewer
                </div>

                {/* 가운데 메뉴 */}
                <nav className="nav">
                    <ul className="nav-list main-menu">
                        <li><Link to="/" onClick={() => handleNavigation("/")}>홈</Link></li>
                        <li><Link to="/captcha" onClick={() => handleNavigation("captcha")}>AI 면접연습</Link></li>
                        <li><Link to="/cl" onClick={() => handleNavigation("codetool")}>자소서</Link></li>
                        <li className="dropdown">
                            <span>전체 게시판</span>
                            <ul className="dropdown-menu">
                                <li><Link to="/feedback" onClick={() => handleNavigation("noticeboard")}>피드백</Link></li>
                                <li><Link to="/postscript" onClick={() => handleNavigation("feedback")}>면접 후기</Link></li>
                            </ul>
                        </li>
                    </ul>

                    {/* 오른쪽 로그인/프로필 */}
                    <ul className="nav-list login-menu">
                        {isLoggedIn ? (
                            <li className="profile-dropdown">
                                <span className="profile-name" onClick={toggleDropdown}>
                                    {userNickname}
                                </span>
                                {profileDropdown && (
                                    <ul className="dropdown-menu profile-menu">
                                        <li>
                                            <Link to="/mypage" onClick={() => {handleNavigation("mypage"); setProfileDropdown(false);}}>
                                                마이페이지
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <>
                                <li><Link to="/signin" onClick={() => handleNavigation("signin")}>Sign In</Link></li>
                                <li><Link to="/signup" onClick={() => handleNavigation("signup")}>Sign Up</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;



