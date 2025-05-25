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
    function handleClickCommunity() {
        ChangeEventHandler("community");
    }
    function test() {
        ChangeEventHandler("")
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
                            <Link className="nav-link" to="/home" onClick={test}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/captcha" onClick={handleClickCaptCha}>CaptCha</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/codetools" onClick={handleClickCodeTool}>CodeTool</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false" to="/community" onClick={handleClickCommunity}>
                                Community
                            </Link>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Notice Board</a></li>
                                <li><a className="dropdown-item" href="#">Feed Back</a></li>
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

//<Link className="" to="" onClick={직접 만든 함수명}>
