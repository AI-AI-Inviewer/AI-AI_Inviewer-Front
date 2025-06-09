import "../scss/Header.scss";
import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Header = ({ isCheckHeader, ChangeEventHandler, isLoggedIn, userNickname, onLogout }) => {

    function handleClickMain() {
        ChangeEventHandler("/");
    }
    function handleClickCaptCha() {
        ChangeEventHandler("captcha");
    }
    function handleClickCodeTool() {
        ChangeEventHandler("codetool");
    }
    function handleClickNoticeBoard() {
        ChangeEventHandler("noticeboard");
    }
    function handleClickFeedBack() {
        ChangeEventHandler("feedback");
    }
    function handleClickSignIn() {
        ChangeEventHandler("signin");
    }
    function handleClickSignUp() {
        ChangeEventHandler("signup");
    }
    function handleClickMypage() {
        ChangeEventHandler("mypage");
    }
    const navigate = useNavigate();
    function handleClickLogout() {
        onLogout(); // App.js에서 넘어온 logout 함수 호출
        alert("로그아웃 되었습니다.");
        navigate("/"); // 홈으로 리다이렉트
    }


    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" onClick={handleClickMain}>홈</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/captcha" onClick={handleClickCaptCha}>AI 면접연습</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cl" onClick={handleClickCodeTool}>자소서</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                전체 게시판
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/feedback" onClick={handleClickNoticeBoard}>피드백</Link></li>
                                <li><Link className="dropdown-item" to="/postscript" onClick={handleClickFeedBack}>면접 후기</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="navbar-nav" id="login">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/mypage" onClick={handleClickMypage}>
                                        {userNickname}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleClickLogout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signin" onClick={handleClickSignIn}>Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup" onClick={handleClickSignUp}>Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
