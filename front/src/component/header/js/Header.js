import "../scss/Header.scss";
import React from "react";
import { Link } from "react-router-dom";
//import {onDOMContentLoaded} from "bootstrap/js/src/util";

const Header = ({ isCheckHeader, ChangeEventHandler }) => {
    function handleClickMain() {
        ChangeEventHandler("/");
        console.log("isCheckHeader : ", isCheckHeader, "")
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
                            <Link className="nav-link" to="/" onClick={handleClickMain}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/captcha" onClick={handleClickCaptCha}>CaptCha</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/codetool" onClick={handleClickCodeTool}>CodeTool</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                Community
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/noticeboard" onClick={handleClickNoticeBoard}>Notice Board</Link></li>
                                <li><Link className="dropdown-item" to="/feedback" onClick={handleClickFeedBack}>Feed Back</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="navbar-nav" id="login">
                        <li className="nav-item"><Link className="nav-link" to="/SignIn" onClick={handleClickSignIn}>Sign In</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/SignUp" onClick={handleClickSignUp}>Sign up</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;

//<Link className="" to="" onClick={직접 만든 함수명}>
