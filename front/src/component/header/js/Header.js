import "../scss/Header.scss";
import React from "react";
import { Link } from "react-router-dom";
import {onDOMContentLoaded} from "bootstrap/js/src/util";

const Header = ({ isCheckHeader, ChangeEventHandler }) => {
    function handleClickHome() {
        ChangeEventHandler("home");
        console.log(isCheckHeader);
    }
    function handleClickCaptCha() {
        ChangeEventHandler("captcha");
    }
    function handleClickCodeTool() {
        ChangeEventHandler("codetools");
    }
    function handleClickNoticeBoard() {
        ChangeEventHandler("noticeboard");
    }
    function handleClickFeedBack() {
        ChangeEventHandler("feedback");
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
                            <Link className="nav-link" to="/home" onClick={handleClickHome}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/captcha" onClick={handleClickCaptCha}>CaptCha</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/codetools" onClick={handleClickCodeTool}>CodeTool</Link>
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
                        <li className="nav-item"><a className="nav-link" href="#">login</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">sign up</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
