import "../scss/Header.scss";
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ isCheckHeader, ChangeEventHandler }) => {

    function handleClickHome() {
        ChangeEventHandler("home");
    }

    function handleClickCaptCha() {
        ChangeEventHandler("captcha");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">OPENCAPTCHA</Link>
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
                            <a className="nav-link" href="#">CodeTool</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                COMMUNITY
                            </a>
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
